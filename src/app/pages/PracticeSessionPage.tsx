import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Clock,
  Grid3X3,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Send,
  RotateCcw,
  Image as ImageIcon,
} from 'lucide-react';

/* ================================================================== */
/*  TYPES                                                              */
/* ================================================================== */

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  stem: string;
  options: QuestionOption[];
  correct_answer: string | string[] | string[][];
  item_type: 'MC' | 'MR' | 'BL' | 'DD' | 'OB' | 'Graphics';
  difficulty_level: number;
  domain: string;
  cj_step: string;
  rationale_correct: string;
  rationales_distractors: Record<string, string>;
  scenario_context: string | null;
  certification_level: string;
  image_url: string | null;
}

type UserAnswer = string | string[] | string[][];

interface AnswerRecord {
  answer: UserAnswer;
  startedAt: number; // timestamp ms
}

interface SessionResults {
  questions: Question[];
  answers: Record<string, AnswerRecord>;
  flagged: Set<string>;
  score: number;
  totalQuestions: number;
  correctCount: number;
  domainBreakdown: Record<string, { correct: number; total: number; pct: number }>;
  teiBreakdown: Record<string, { correct: number; total: number; pct: number }>;
  cjBreakdown: Record<string, { correct: number; total: number; pct: number }>;
  durationSeconds: number;
  certLevel: string;
  mode: string;
}

/* ================================================================== */
/*  UTILITY FUNCTIONS                                                  */
/* ================================================================== */

/** Fisher-Yates (Knuth) shuffle -- in-place, returns the same array */
function fisherYatesShuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Deep-equal comparison for scoring */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a as Record<string, unknown>);
    const bKeys = Object.keys(b as Record<string, unknown>);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }

  return false;
}

/** Check if a user answer is correct (binary scoring) */
function isAnswerCorrect(question: Question, userAnswer: UserAnswer): boolean {
  const correct = question.correct_answer;

  if (question.item_type === 'MC' || question.item_type === 'Graphics') {
    return correct === userAnswer;
  }

  if (question.item_type === 'MR') {
    // Order does NOT matter for MR -- sort both and compare
    if (!Array.isArray(userAnswer) || !Array.isArray(correct)) return false;
    const sortedUser = [...(userAnswer as string[])].sort();
    const sortedCorrect = [...(correct as string[])].sort();
    return deepEqual(sortedUser, sortedCorrect);
  }

  if (question.item_type === 'BL') {
    // Order MATTERS for Build-List
    return deepEqual(correct, userAnswer);
  }

  if (question.item_type === 'DD' || question.item_type === 'OB') {
    // Array of pairs -- order of pairs doesn't matter, but pair contents must match
    if (!Array.isArray(userAnswer) || !Array.isArray(correct)) return false;
    const sortPairs = (arr: string[][]) =>
      [...arr].sort((a, b) => {
        const ja = JSON.stringify(a);
        const jb = JSON.stringify(b);
        return ja < jb ? -1 : ja > jb ? 1 : 0;
      });
    return deepEqual(sortPairs(correct as string[][]), sortPairs(userAnswer as string[][]));
  }

  return false;
}

/** Format seconds as mm:ss */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/* ================================================================== */
/*  TEI RENDERERS                                                      */
/* ================================================================== */

/* ---- 1. MC (Multiple Choice) ---- */
interface MCRendererProps {
  question: Question;
  value: string;
  onChange: (val: string) => void;
}

function MCRenderer({ question, value, onChange }: MCRendererProps) {
  return (
    <div className="space-y-3">
      {question.options.map((opt) => (
        <label
          key={opt.id}
          className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
            value === opt.id
              ? 'border-[#1a5f7a] bg-[#1a5f7a]/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name={`mc-${question.id}`}
            value={opt.id}
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#1a5f7a]"
          />
          <span className="text-sm text-gray-800">{opt.text}</span>
        </label>
      ))}
    </div>
  );
}

/* ---- 2. MR (Multiple Response / SATA) ---- */
interface MRRendererProps {
  question: Question;
  value: string[];
  onChange: (val: string[]) => void;
}

function MRRenderer({ question, value, onChange }: MRRendererProps) {
  const toggle = (id: string) => {
    const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="mb-2 rounded-md bg-[#d4a843]/10 px-3 py-2 text-sm font-medium text-[#0D2137]">
        Select All That Apply
      </p>
      {question.options.map((opt) => (
        <label
          key={opt.id}
          className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
            value.includes(opt.id)
              ? 'border-[#1a5f7a] bg-[#1a5f7a]/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            value={opt.id}
            checked={value.includes(opt.id)}
            onChange={() => toggle(opt.id)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#1a5f7a]"
          />
          <span className="text-sm text-gray-800">{opt.text}</span>
        </label>
      ))}
    </div>
  );
}

/* ---- 3. BL (Build List) -- Drag & Drop ordering ---- */

const BL_ITEM_TYPE = 'BL_ITEM';

interface BLItemProps {
  id: string;
  text: string;
  index: number;
  moveItem: (from: number, to: number) => void;
  isMobile: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function BLDragItem({ id, text, index, moveItem, isMobile, onMoveUp, onMoveDown, isFirst, isLast }: BLItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: BL_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: BL_ITEM_TYPE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  if (!isMobile) {
    drag(drop(ref));
  }

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-white p-4 transition-all ${
        isDragging ? 'border-[#1a5f7a] opacity-50 shadow-lg' : 'hover:border-gray-300'
      }`}
    >
      {!isMobile && <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-gray-400" />}
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0D2137] text-xs font-bold text-white">
        {index + 1}
      </span>
      <span className="flex-1 text-sm text-gray-800">{text}</span>
      {isMobile && (
        <div className="flex flex-col gap-1">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

interface BLRendererProps {
  question: Question;
  value: string[];
  onChange: (val: string[]) => void;
}

function BLRenderer({ question, value, onChange }: BLRendererProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Initialise value from options if empty
  useEffect(() => {
    if (value.length === 0 && question.options.length > 0) {
      onChange(question.options.map((o) => o.id));
    }
  }, [question.options, value.length, onChange]);

  const moveItem = useCallback(
    (from: number, to: number) => {
      const updated = [...value];
      const [removed] = updated.splice(from, 1);
      updated.splice(to, 0, removed);
      onChange(updated);
    },
    [value, onChange],
  );

  const optMap = useMemo(() => {
    const m = new Map<string, string>();
    question.options.forEach((o) => m.set(o.id, o.text));
    return m;
  }, [question.options]);

  return (
    <div className="space-y-3">
      <p className="mb-2 rounded-md bg-[#d4a843]/10 px-3 py-2 text-sm font-medium text-[#0D2137]">
        {isMobile
          ? 'Use the arrows to arrange items in the correct order'
          : 'Drag items to arrange them in the correct order'}
      </p>
      {value.map((id, idx) => (
        <BLDragItem
          key={id}
          id={id}
          text={optMap.get(id) || id}
          index={idx}
          moveItem={moveItem}
          isMobile={isMobile}
          onMoveUp={() => moveItem(idx, idx - 1)}
          onMoveDown={() => moveItem(idx, idx + 1)}
          isFirst={idx === 0}
          isLast={idx === value.length - 1}
        />
      ))}
    </div>
  );
}

/* ---- 4. DD (Drag & Drop Matching) ---- */

const DD_ITEM_TYPE = 'DD_ITEM';

interface DDRendererProps {
  question: Question;
  value: string[][];
  onChange: (val: string[][]) => void;
}

function DDRenderer({ question, value, onChange }: DDRendererProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Extract categories and items from correct_answer structure
  const categories = useMemo(() => {
    const cats = new Set<string>();
    if (Array.isArray(question.correct_answer)) {
      (question.correct_answer as string[][]).forEach((pair) => {
        if (pair.length === 2) cats.add(pair[1]);
      });
    }
    return Array.from(cats);
  }, [question.correct_answer]);

  const items = useMemo(() => question.options.map((o) => o.id), [question.options]);

  const optMap = useMemo(() => {
    const m = new Map<string, string>();
    question.options.forEach((o) => m.set(o.id, o.text));
    return m;
  }, [question.options]);

  const assignedMap = useMemo(() => {
    const m = new Map<string, string>();
    value.forEach(([item, cat]) => m.set(item, cat));
    return m;
  }, [value]);

  const unassigned = items.filter((id) => !assignedMap.has(id));

  const assignToCategory = useCallback(
    (itemId: string, category: string) => {
      const next = value.filter(([i]) => i !== itemId);
      next.push([itemId, category]);
      onChange(next);
      setSelectedItem(null);
    },
    [value, onChange],
  );

  const removeFromCategory = useCallback(
    (itemId: string) => {
      onChange(value.filter(([i]) => i !== itemId));
    },
    [value, onChange],
  );

  /* Desktop drop target for each category */
  function CategoryDropZone({ category, children }: { category: string; children: React.ReactNode }) {
    const [{ isOver }, drop] = useDrop({
      accept: DD_ITEM_TYPE,
      drop: (item: { id: string }) => assignToCategory(item.id, category),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    });

    return (
      <div
        ref={drop as unknown as React.Ref<HTMLDivElement>}
        className={`min-h-[80px] rounded-lg border-2 border-dashed p-3 transition-all ${
          isOver ? 'border-[#1a5f7a] bg-[#1a5f7a]/5' : 'border-gray-300'
        }`}
      >
        <h4 className="mb-2 text-sm font-semibold text-[#0D2137]">{category}</h4>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    );
  }

  function DraggableItem({ id }: { id: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag({
      type: DD_ITEM_TYPE,
      item: { id },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });
    drag(ref);

    return (
      <div
        ref={ref}
        className={`cursor-grab rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all ${
          isDragging ? 'opacity-40' : 'hover:shadow-md'
        }`}
      >
        {optMap.get(id) || id}
      </div>
    );
  }

  /* Mobile: tap-to-select then tap-category */
  if (isMobile) {
    return (
      <div className="space-y-4">
        <p className="rounded-md bg-[#d4a843]/10 px-3 py-2 text-sm font-medium text-[#0D2137]">
          Tap an item, then tap a category to place it
        </p>

        {/* Unassigned */}
        {unassigned.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Items</h4>
            <div className="flex flex-wrap gap-2">
              {unassigned.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedItem(selectedItem === id ? null : id)}
                  className={`rounded-md border px-3 py-2 text-sm transition-all ${
                    selectedItem === id
                      ? 'border-[#1a5f7a] bg-[#1a5f7a] text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  }`}
                >
                  {optMap.get(id) || id}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              disabled={!selectedItem}
              onClick={() => selectedItem && assignToCategory(selectedItem, cat)}
              className={`w-full rounded-lg border-2 border-dashed p-3 text-left transition-all ${
                selectedItem ? 'border-[#1a5f7a] hover:bg-[#1a5f7a]/5' : 'border-gray-300'
              }`}
            >
              <h4 className="mb-2 text-sm font-semibold text-[#0D2137]">{cat}</h4>
              <div className="flex flex-wrap gap-2">
                {value
                  .filter(([, c]) => c === cat)
                  .map(([itemId]) => (
                    <span
                      key={itemId}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCategory(itemId);
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-[#1a5f7a]/10 px-2 py-1 text-xs text-[#1a5f7a]"
                    >
                      {optMap.get(itemId) || itemId}
                      <X className="h-3 w-3" />
                    </span>
                  ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* Desktop: drag-and-drop */
  return (
    <div className="space-y-4">
      <p className="rounded-md bg-[#d4a843]/10 px-3 py-2 text-sm font-medium text-[#0D2137]">
        Drag items to the correct category
      </p>

      {/* Unassigned items */}
      {unassigned.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Items</h4>
          <div className="flex flex-wrap gap-2">
            {unassigned.map((id) => (
              <DraggableItem key={id} id={id} />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((cat) => (
          <CategoryDropZone key={cat} category={cat}>
            {value
              .filter(([, c]) => c === cat)
              .map(([itemId]) => (
                <span
                  key={itemId}
                  onClick={() => removeFromCategory(itemId)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-[#1a5f7a]/10 px-2 py-1 text-xs text-[#1a5f7a] hover:bg-[#1a5f7a]/20"
                >
                  {optMap.get(itemId) || itemId}
                  <X className="h-3 w-3" />
                </span>
              ))}
          </CategoryDropZone>
        ))}
      </div>
    </div>
  );
}

/* ---- 5. OB (Options Box / Matrix Grid) ---- */

interface OBRendererProps {
  question: Question;
  value: string[][];
  onChange: (val: string[][]) => void;
}

function OBRenderer({ question, value, onChange }: OBRendererProps) {
  // correct_answer is array of [row_label, selected_option]
  // Options represent possible column choices; rows come from correct_answer structure
  const rows = useMemo(() => {
    if (!Array.isArray(question.correct_answer)) return [];
    return (question.correct_answer as string[][]).map((pair) => pair[0]);
  }, [question.correct_answer]);

  const columnOptions = useMemo(() => question.options.map((o) => o.id), [question.options]);

  const optMap = useMemo(() => {
    const m = new Map<string, string>();
    question.options.forEach((o) => m.set(o.id, o.text));
    return m;
  }, [question.options]);

  const valMap = useMemo(() => {
    const m = new Map<string, string>();
    value.forEach(([row, col]) => m.set(row, col));
    return m;
  }, [value]);

  const setRowValue = (row: string, col: string) => {
    const next = value.filter(([r]) => r !== row);
    next.push([row, col]);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="mb-2 rounded-md bg-[#d4a843]/10 px-3 py-2 text-sm font-medium text-[#0D2137]">
        Select the correct option for each row
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 pr-4 text-left font-semibold text-[#0D2137]">Item</th>
              <th className="py-3 px-4 text-left font-semibold text-[#0D2137]">Selection</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium text-gray-700">{row}</td>
                <td className="py-3 px-4">
                  <select
                    value={valMap.get(row) || ''}
                    onChange={(e) => setRowValue(row, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#1a5f7a] focus:outline-none focus:ring-1 focus:ring-[#1a5f7a]"
                  >
                    <option value="">-- Select --</option>
                    {columnOptions.map((col) => (
                      <option key={col} value={col}>
                        {optMap.get(col) || col}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- 6. Graphics (image-based MC) ---- */
interface GraphicsRendererProps {
  question: Question;
  value: string;
  onChange: (val: string) => void;
}

function GraphicsRenderer({ question, value, onChange }: GraphicsRendererProps) {
  return (
    <div className="space-y-4">
      {question.image_url ? (
        <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50">
          <img
            src={question.image_url}
            alt="Question graphic"
            className="mx-auto max-h-[400px] w-auto object-contain p-4"
            loading="eager"
          />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
          <ImageIcon className="mr-2 h-6 w-6" />
          <span className="text-sm">Image not available</span>
        </div>
      )}
      <MCRenderer question={question} value={value} onChange={onChange} />
    </div>
  );
}

/* ================================================================== */
/*  QUESTION NAVIGATOR (grid sidebar / overlay)                        */
/* ================================================================== */

interface QuestionGridProps {
  total: number;
  current: number;
  answered: Set<number>;
  flagged: Set<number>;
  onJump: (index: number) => void;
  onClose: () => void;
}

function QuestionGrid({ total, current, answered, flagged, onJump, onClose }: QuestionGridProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0D2137]">Question Navigator</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-[#1a5f7a]" /> Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-gray-200" /> Unanswered
          </span>
          <span className="flex items-center gap-1">
            <Flag className="h-3 w-3 text-[#d4a843]" /> Flagged
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border-2 border-[#E03038]" /> Current
          </span>
        </div>

        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: total }, (_, i) => {
            const isAnswered = answered.has(i);
            const isFlagged = flagged.has(i);
            const isCurrent = i === current;
            return (
              <button
                key={i}
                onClick={() => {
                  onJump(i);
                  onClose();
                }}
                className={`relative flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-[#E03038] ring-offset-1'
                    : ''
                } ${isAnswered ? 'bg-[#1a5f7a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {i + 1}
                {isFlagged && (
                  <Flag className="absolute -top-1 -right-1 h-3 w-3 fill-[#d4a843] text-[#d4a843]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>{answered.size} / {total} answered</span>
          <span>{flagged.size} flagged</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  REVIEW SCREEN (pre-submit)                                         */
/* ================================================================== */

interface ReviewScreenProps {
  total: number;
  answered: Set<number>;
  flagged: Set<number>;
  questions: Question[];
  onGoToQuestion: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function ReviewScreen({ total, answered, flagged, questions, onGoToQuestion, onSubmit, onCancel }: ReviewScreenProps) {
  const unansweredCount = total - answered.size;
  const flaggedIndices = Array.from(flagged).sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <h2 className="text-2xl font-bold text-[#0D2137]">Review Before Submitting</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-[#1a5f7a]">{answered.size}</p>
          <p className="text-sm text-gray-500">Answered</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className={`text-3xl font-bold ${unansweredCount > 0 ? 'text-[#E03038]' : 'text-green-600'}`}>
            {unansweredCount}
          </p>
          <p className="text-sm text-gray-500">Unanswered</p>
        </div>
      </div>

      {flaggedIndices.length > 0 && (
        <div className="rounded-xl border border-[#d4a843]/30 bg-[#d4a843]/5 p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#0D2137]">
            <Flag className="h-4 w-4 text-[#d4a843]" />
            Flagged Questions ({flaggedIndices.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {flaggedIndices.map((idx) => (
              <button
                key={idx}
                onClick={() => onGoToQuestion(idx)}
                className="rounded-lg border border-[#d4a843]/30 bg-white px-3 py-1.5 text-sm font-medium text-[#0D2137] hover:bg-[#d4a843]/10"
              >
                Q{idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {unansweredCount > 0 && (
        <div className="rounded-xl border border-[#E03038]/30 bg-[#E03038]/5 p-5">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-[#E03038]">
            <AlertCircle className="h-4 w-4" />
            You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}
          </h3>
          <p className="text-sm text-gray-600">
            Unanswered questions will be marked incorrect.
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300"
        >
          Go Back
        </button>
        <button
          onClick={onSubmit}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E03038] px-6 py-3 font-semibold text-white transition-all hover:bg-[#c72830]"
        >
          <Send className="h-4 w-4" />
          Submit Exam
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN SESSION PAGE COMPONENT                                        */
/* ================================================================== */

export default function PracticeSessionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  /* ---- Parse query params ---- */
  const mode = searchParams.get('mode') || 'random';
  const count = parseInt(searchParams.get('count') || '25', 10);
  const level = searchParams.get('level') || 'EMT';
  const domainParam = searchParams.get('domain') || '';
  const teiTypeParam = searchParams.get('teiType') || '';
  const isTimed = searchParams.get('timed') === 'true';

  /* ---- Core state ---- */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [flaggedSet, setFlaggedSet] = useState<Set<string>>(new Set());
  const [showGrid, setShowGrid] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ---- Loading/Error ---- */
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  /* ---- Timer ---- */
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const sessionStartRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStartRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ---- Fetch questions ---- */
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadSession() {
      try {
        setLoading(true);

        // Get student profile
        const { data: student, error: stuErr } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user!.id)
          .single();

        if (stuErr) throw stuErr;
        setStudentId(student.id);

        let query = supabase
          .from('questions')
          .select('id, stem, options, correct_answer, item_type, difficulty_level, domain, cj_step, rationale_correct, rationales_distractors, scenario_context, certification_level, image_url')
          .eq('certification_level', level);

        // Apply mode-specific filters
        if (mode === 'domain' && domainParam) {
          query = query.eq('domain', domainParam);
        } else if (mode === 'tei' && teiTypeParam) {
          query = query.eq('item_type', teiTypeParam);
        } else if (mode === 'weak') {
          // Find weakest domains from history
          const { data: history } = await supabase
            .from('student_question_history')
            .select('question_id, is_correct, questions(domain)')
            .eq('student_id', student.id)
            .order('answered_at', { ascending: false })
            .limit(200);

          if (history && history.length > 0) {
            const domainStats: Record<string, { correct: number; total: number }> = {};
            history.forEach((h: any) => {
              const dom = h.questions?.domain;
              if (!dom) return;
              if (!domainStats[dom]) domainStats[dom] = { correct: 0, total: 0 };
              domainStats[dom].total++;
              if (h.is_correct) domainStats[dom].correct++;
            });

            // Sort by accuracy ascending, pick weakest domains
            const sorted = Object.entries(domainStats)
              .map(([dom, s]) => ({ dom, pct: s.total > 0 ? s.correct / s.total : 0 }))
              .sort((a, b) => a.pct - b.pct);

            const weakDomains = sorted.slice(0, 3).map((d) => d.dom);
            if (weakDomains.length > 0) {
              query = query.in('domain', weakDomains);
            }
          }
        }
        // 'random' and 'exam' modes use no additional filters

        // Fetch more than needed so we can shuffle and slice
        query = query.limit(count * 3);

        const { data: rawQuestions, error: qErr } = await query;
        if (qErr) throw qErr;

        if (!rawQuestions || rawQuestions.length === 0) {
          setFetchError('No questions found matching your criteria. Try adjusting your filters.');
          return;
        }

        // Shuffle and take the requested count
        const shuffled = fisherYatesShuffle([...rawQuestions]);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length)) as Question[];

        setQuestions(selected);
        sessionStartRef.current = Date.now();
        questionStartRef.current = Date.now();
      } catch (err: any) {
        console.error('Error loading session:', err);
        setFetchError(err.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [user, authLoading, navigate, mode, count, level, domainParam, teiTypeParam]);

  /* ---- Derived state ---- */
  const currentQuestion = questions[currentIndex] || null;

  const answeredIndices = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, i) => {
      if (answers[q.id]) set.add(i);
    });
    return set;
  }, [questions, answers]);

  const flaggedIndices = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, i) => {
      if (flaggedSet.has(q.id)) set.add(i);
    });
    return set;
  }, [questions, flaggedSet]);

  /* ---- Answer management ---- */
  const currentAnswer = currentQuestion ? answers[currentQuestion.id]?.answer : undefined;

  const setCurrentAnswer = useCallback(
    (val: UserAnswer) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          answer: val,
          startedAt: prev[currentQuestion.id]?.startedAt || questionStartRef.current,
        },
      }));
    },
    [currentQuestion],
  );

  /* ---- Navigation ---- */
  const goTo = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < questions.length) {
        setCurrentIndex(idx);
        questionStartRef.current = Date.now();
        setShowReview(false);
      }
    },
    [questions.length],
  );

  const goNext = () => goTo(currentIndex + 1);
  const goPrev = () => goTo(currentIndex - 1);

  /* ---- Flag ---- */
  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedSet((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  /* ---- Submission ---- */
  const handleShowReview = () => {
    setShowReview(true);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const durationSeconds = Math.floor((Date.now() - sessionStartRef.current) / 1000);

      // Score everything
      let correctCount = 0;
      const domainBreakdown: Record<string, { correct: number; total: number; pct: number }> = {};
      const teiBreakdown: Record<string, { correct: number; total: number; pct: number }> = {};
      const cjBreakdown: Record<string, { correct: number; total: number; pct: number }> = {};

      const perQuestionResults: { questionId: string; isCorrect: boolean; timeSpent: number }[] = [];

      questions.forEach((q) => {
        const record = answers[q.id];
        const userAns = record?.answer;
        const correct = userAns != null ? isAnswerCorrect(q, userAns) : false;
        if (correct) correctCount++;

        const timeSpent = record
          ? Math.floor((Date.now() - record.startedAt) / 1000)
          : 0;

        perQuestionResults.push({ questionId: q.id, isCorrect: correct, timeSpent });

        // Domain breakdown
        const dom = q.domain || 'Unknown';
        if (!domainBreakdown[dom]) domainBreakdown[dom] = { correct: 0, total: 0, pct: 0 };
        domainBreakdown[dom].total++;
        if (correct) domainBreakdown[dom].correct++;

        // TEI breakdown
        const tei = q.item_type || 'Unknown';
        if (!teiBreakdown[tei]) teiBreakdown[tei] = { correct: 0, total: 0, pct: 0 };
        teiBreakdown[tei].total++;
        if (correct) teiBreakdown[tei].correct++;

        // CJ Step breakdown
        const cj = q.cj_step || 'Unknown';
        if (!cjBreakdown[cj]) cjBreakdown[cj] = { correct: 0, total: 0, pct: 0 };
        cjBreakdown[cj].total++;
        if (correct) cjBreakdown[cj].correct++;
      });

      // Calculate percentages
      Object.values(domainBreakdown).forEach((v) => {
        v.pct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
      });
      Object.values(teiBreakdown).forEach((v) => {
        v.pct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
      });
      Object.values(cjBreakdown).forEach((v) => {
        v.pct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
      });

      const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

      // ---- Write to Supabase ---- //
      if (studentId) {
        // 1. exam_sessions
        await supabase.from('exam_sessions').insert({
          student_id: studentId,
          certification_level: level,
          mode,
          total_questions: questions.length,
          correct_count: correctCount,
          score_pct: scorePct,
          domain_breakdown: domainBreakdown,
          tei_breakdown: teiBreakdown,
          cj_breakdown: cjBreakdown,
          duration_seconds: durationSeconds,
          completed_at: new Date().toISOString(),
        });

        // 2. student_question_history (batch insert)
        const historyRows = perQuestionResults.map((r) => ({
          student_id: studentId,
          question_id: r.questionId,
          is_correct: r.isCorrect,
          answered_at: new Date().toISOString(),
          time_spent_seconds: r.timeSpent,
        }));

        await supabase.from('student_question_history').insert(historyRows);

        // 3. Check mastery for each question (3 consecutive correct = mastered)
        for (const r of perQuestionResults) {
          if (r.isCorrect) {
            const { data: recentHistory } = await supabase
              .from('student_question_history')
              .select('is_correct')
              .eq('student_id', studentId)
              .eq('question_id', r.questionId)
              .order('answered_at', { ascending: false })
              .limit(3);

            if (
              recentHistory &&
              recentHistory.length >= 3 &&
              recentHistory.every((h: any) => h.is_correct)
            ) {
              await supabase
                .from('student_question_history')
                .update({ is_mastered: true })
                .eq('student_id', studentId)
                .eq('question_id', r.questionId);
            }
          }
        }

        // 4. Study streaks
        const today = new Date().toISOString().split('T')[0];
        const { data: existingStreak } = await supabase
          .from('study_streaks')
          .select('id, streak_count')
          .eq('student_id', studentId)
          .eq('study_date', today)
          .maybeSingle();

        if (!existingStreak) {
          // Check if there's a record from yesterday to continue streak
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const { data: yesterdayStreak } = await supabase
            .from('study_streaks')
            .select('streak_count')
            .eq('student_id', studentId)
            .eq('study_date', yesterday)
            .maybeSingle();

          const newStreak = yesterdayStreak ? (yesterdayStreak.streak_count || 0) + 1 : 1;

          await supabase.from('study_streaks').insert({
            student_id: studentId,
            study_date: today,
            streak_count: newStreak,
          });
        }

        // 5. Update student record
        const { data: currentStudent } = await supabase
          .from('students')
          .select('total_questions_answered')
          .eq('id', studentId)
          .single();

        const prevCount = currentStudent?.total_questions_answered || 0;

        await supabase
          .from('students')
          .update({
            total_questions_answered: prevCount + questions.length,
            last_active_at: new Date().toISOString(),
          })
          .eq('id', studentId);
      }

      // Navigate to results page
      const results: SessionResults = {
        questions,
        answers,
        flagged: flaggedSet,
        score: scorePct,
        totalQuestions: questions.length,
        correctCount,
        domainBreakdown,
        teiBreakdown,
        cjBreakdown,
        durationSeconds,
        certLevel: level,
        mode,
      };

      navigate('/practice/results', { state: { results } });
    } catch (err: any) {
      console.error('Error submitting exam:', err);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Render: Loading ---- */
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#1a5f7a]" />
            <p className="mt-4 text-gray-500">Loading questions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  /* ---- Render: Error ---- */
  if (fetchError) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-[#E03038]" />
            <h2 className="mt-4 text-lg font-semibold text-[#0D2137]">Unable to Load Questions</h2>
            <p className="mt-2 text-sm text-gray-600">{fetchError}</p>
            <button
              onClick={() => navigate('/practice/start')}
              className="mt-6 rounded-lg bg-[#0D2137] px-5 py-2 text-sm font-medium text-white hover:bg-[#0D2137]/90"
            >
              Back to Practice
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  /* ---- Render: Review screen (pre-submit) ---- */
  if (showReview) {
    return (
      <Layout>
        <DndProvider backend={HTML5Backend}>
          <ReviewScreen
            total={questions.length}
            answered={answeredIndices}
            flagged={flaggedIndices}
            questions={questions}
            onGoToQuestion={goTo}
            onSubmit={handleSubmit}
            onCancel={() => setShowReview(false)}
          />
        </DndProvider>
      </Layout>
    );
  }

  /* ---- Render: Main session ---- */
  if (!currentQuestion) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">No question to display.</p>
        </div>
      </Layout>
    );
  }

  const progressPct = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isFlagged = flaggedSet.has(currentQuestion.id);

  /* ---- Build the TEI renderer ---- */
  function renderTEI() {
    if (!currentQuestion) return null;

    switch (currentQuestion.item_type) {
      case 'MC':
        return (
          <MCRenderer
            question={currentQuestion}
            value={(currentAnswer as string) || ''}
            onChange={setCurrentAnswer}
          />
        );
      case 'MR':
        return (
          <MRRenderer
            question={currentQuestion}
            value={(currentAnswer as string[]) || []}
            onChange={setCurrentAnswer}
          />
        );
      case 'BL':
        return (
          <BLRenderer
            question={currentQuestion}
            value={(currentAnswer as string[]) || []}
            onChange={setCurrentAnswer}
          />
        );
      case 'DD':
        return (
          <DDRenderer
            question={currentQuestion}
            value={(currentAnswer as string[][]) || []}
            onChange={setCurrentAnswer}
          />
        );
      case 'OB':
        return (
          <OBRenderer
            question={currentQuestion}
            value={(currentAnswer as string[][]) || []}
            onChange={setCurrentAnswer}
          />
        );
      case 'Graphics':
        return (
          <GraphicsRenderer
            question={currentQuestion}
            value={(currentAnswer as string) || ''}
            onChange={setCurrentAnswer}
          />
        );
      default:
        return (
          <MCRenderer
            question={currentQuestion}
            value={(currentAnswer as string) || ''}
            onChange={setCurrentAnswer}
          />
        );
    }
  }

  return (
    <Layout>
      <DndProvider backend={HTML5Backend}>
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          {/* ---- Top bar ---- */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            {/* Question counter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#0D2137]">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {currentQuestion.item_type}
              </span>
            </div>

            {/* Timer + Grid button */}
            <div className="flex items-center gap-3">
              {isTimed && (
                <div className="flex items-center gap-1.5 rounded-lg bg-[#0D2137] px-3 py-1.5 text-sm font-mono font-bold text-white">
                  <Clock className="h-4 w-4" />
                  {formatTime(elapsedSeconds)}
                </div>
              )}
              <button
                onClick={() => setShowGrid(true)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Navigator</span>
              </button>
            </div>
          </div>

          {/* ---- Progress bar ---- */}
          <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#1a5f7a] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* ---- Question Card ---- */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Scenario context */}
            {currentQuestion.scenario_context && (
              <div className="mb-5 rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#1a5f7a]">
                  Scenario
                </span>
                {currentQuestion.scenario_context}
              </div>
            )}

            {/* Stem */}
            <h2 className="mb-6 text-lg font-semibold leading-relaxed text-[#0D2137]">
              {currentQuestion.stem}
            </h2>

            {/* TEI Renderer */}
            {renderTEI()}
          </div>

          {/* ---- Bottom controls ---- */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Flag */}
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                isFlagged
                  ? 'border-[#d4a843] bg-[#d4a843]/10 text-[#d4a843]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Flag className={`h-4 w-4 ${isFlagged ? 'fill-[#d4a843]' : ''}`} />
              {isFlagged ? 'Flagged' : 'Flag for Review'}
            </button>

            {/* Center: Prev / Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-1 rounded-lg bg-[#1a5f7a] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1a5f7a]/90"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleShowReview}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-[#E03038] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#c72830] disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Submit Exam
                </button>
              )}
            </div>

            {/* Right: Early submit (visible when not on last question) */}
            {currentIndex < questions.length - 1 && (
              <button
                onClick={handleShowReview}
                className="text-sm text-gray-400 underline hover:text-gray-600"
              >
                End early
              </button>
            )}
          </div>
        </div>

        {/* ---- Question Grid Modal ---- */}
        {showGrid && (
          <QuestionGrid
            total={questions.length}
            current={currentIndex}
            answered={answeredIndices}
            flagged={flaggedIndices}
            onJump={goTo}
            onClose={() => setShowGrid(false)}
          />
        )}
      </DndProvider>
    </Layout>
  );
}
