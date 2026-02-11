import React from 'react';
import { BookOpen, Brain, TrendingUp, CheckCircle, FileText, Layers, AlertTriangle, Database, BarChart3, Star, Target, Zap, Shield, HelpCircle, Activity, Heart, Clock } from 'lucide-react';

// Import book covers
import proofCover from 'figma:asset/5c9cc05b9263baa3a352ea86e5d9e616da333add.png';
import spotItCover from 'figma:asset/c96381ee722dcf250fe4e2642e201c8802dc3930.png';
import catCover from 'figma:asset/82e98b0c076d1ccc611ae137148c3b03243ef9d8.png';
import workbookCover from 'figma:asset/fdfb19885d9e08b5312f32a21629fca03db0d3ad.png';
import underTheHoodCover from 'figma:asset/f6622333bd9fe8e9767231b0875a1ba83a528937.png';

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  price: number;
  pages: number;
  level: string;
  buyLink: string;
  coverImage: string;
  description: React.ReactNode;
  features: {
    title: string;
    description: string;
  }[];
  audience: string[];
}

export const products: Product[] = [
  {
    slug: 'proof-is-in-the-pudding',
    title: 'The Proof is in the Pudding',
    subtitle: 'Break Down the Question, Find the Answer',
    tagline: 'NREMT Test Strategies for the EMT Exam',
    price: 13.99,
    pages: 53,
    level: 'EMT',
    buyLink: 'https://path2medic.thinkific.com/enroll/3569566?price_id=4502528',
    coverImage: proofCover,
    description: (
      <>
        <p className="mb-4">
          This isn't a content review book. You already learned the clinical material in your EMT course. This guide teaches you how to strategically approach the NREMT exam itself — how to break down questions, interpret what they're actually asking, and systematically find the best answer.
        </p>
        <p>
          Everything in this guide references official NREMT documentation, including the 2025 EMT Test Plan and EMT Sample Item Packet. You'll learn to recognize domain language, apply the ABC/CAB framework under pressure, and use a scratch paper brain dump strategy that makes your first 30 seconds of the exam your most productive.
        </p>
      </>
    ),
    features: [
      { title: 'Official NREMT domain weights', description: 'Understand what they mean for your study plan.' },
      { title: 'CAT Explained', description: 'How Computer Adaptive Testing works and why it matters.' },
      { title: 'The Power Word Method', description: 'Identify what each question is really testing.' },
      { title: 'ABC/CAB Prioritization', description: 'Framework for eliminating wrong answers.' },
      { title: 'Scratch Paper Brain Dump', description: 'A 30-second pre-exam routine that keeps your thinking organized.' },
      { title: 'Quick Reference Sheet', description: 'Designed for rapid review in the 72 hours before your exam.' }
    ],
    audience: [
      'EMT students preparing for the NREMT certification exam',
      'Students who have failed previously and need a strategic approach, not more content',
      'Anyone who understands the material but struggles with how the test asks questions'
    ]
  },
  {
    slug: 'spot-it-sort-it-solve-it',
    title: 'Spot It, Sort It, Solve It',
    subtitle: 'Clinical Judgment Framework for AEMT & Paramedic Candidates',
    tagline: 'A Deeper Dive Into How the NREMT Evaluates Clinical Judgment',
    price: 15.99,
    pages: 37,
    level: 'AEMT & Paramedic',
    buyLink: 'https://path2medic.thinkific.com/enroll/3585671?price_id=4520694',
    coverImage: spotItCover,
    description: (
      <>
        <p className="mb-4">
          The NREMT adopted a Clinical Judgment framework in July 2024 that fundamentally changed how exam questions are designed and scored. This guide breaks down that framework into the six cognitive functions the exam actually tests: Recognize Cues, Analyze Cues, Define Hypothesis, Generate Solutions, Take Action, and Evaluate Outcomes.
        </p>
        <p>
          Every claim in this guide is supported by the research behind the framework — including the work of Gugiu, McKenna, Platt, and Panchal (2022) who developed it, and McAllister et al. (2024) who validated it with 88.1% concordance. You'll also get coverage of all TEI (Technology-Enhanced Item) formats, the three-phase scenario structure, clinical practice scenarios with cognitive walkthroughs, and guidance on the 2025 AHA Guidelines transition.
        </p>
      </>
    ),
    features: [
      { title: 'The Six Cognitive Functions', description: 'Explained with practical EMS examples.' },
      { title: 'Three-Phase Scenario Structure', description: 'En Route, Scene, Post-Scene and how to identify which phase a question is testing.' },
      { title: 'All TEI Formats', description: 'Multiple Response, Build List, Drag-and-Drop, Options Box — with strategies for each.' },
      { title: 'Three Full Clinical Scenarios', description: 'Step-by-step cognitive walkthroughs (Hypoglycemia, Severe Asthma, Anaphylaxis).' },
      { title: '2025 AHA Guidelines Update', description: 'What\'s current, what\'s transitioning, and what it means for your exam.' },
      { title: '72-Hour Readiness Checklist', description: 'Confirm you\'re prepared before test day.' }
    ],
    audience: [
      'AEMT and Paramedic students preparing for NREMT certification',
      'Students who want to understand HOW the exam evaluates clinical thinking, not just what content to memorize',
      'Anyone preparing for an exam that includes TEI question formats'
    ]
  },
  {
    slug: 'cat-got-your-tongue',
    title: 'CAT Got Your Tongue?',
    subtitle: 'The Nervous EMT & Paramedic Student\'s Guide to Computer Adaptive Testing (CAT)',
    tagline: 'Evidence-based strategies for managing test anxiety and mastering the CAT format',
    price: 15.99,
    pages: 60,
    level: 'EMT & Paramedic',
    buyLink: 'https://path2medic.thinkific.com/enroll/3636485?price_id=4577181',
    coverImage: catCover,
    description: (
      <>
        <p className="mb-4">
          56% of paramedic students experience moderate-to-high test anxiety across 10 countries. High-anxiety students score 7–12% lower on CAT versus fixed-format tests. This guide addresses what most test prep materials ignore: the psychological side of the NREMT.
        </p>
        <p>
          You'll learn exactly how the CAT algorithm works — how it adapts in real time, why it feels like you're always getting questions wrong, and why that feeling is actually the test working as designed. Every intervention in this guide is backed by peer-reviewed research and documented EMS student outcomes. This isn't motivational fluff — it's cognitive psychology applied to a high-stakes EMS exam.
        </p>
      </>
    ),
    features: [
      { title: 'How CAT Actually Works', description: 'The algorithm, the shutdown rules, and why you can\'t go back.' },
      { title: 'Evidence-Based Anxiety Management', description: 'Techniques specific to CAT format exams.' },
      { title: 'The Forward-Focus Methodology', description: 'Why dwelling on previous questions hurts your score and how to stop doing it.' },
      { title: 'Question Format Strategies', description: 'Multiple Choice, Build List, SATA, Drag-and-Drop, Matching, Image-Enhanced.' },
      { title: 'The Whiteboard Strategy', description: 'How to use your allowed writing surface effectively during the exam.' },
      { title: 'Exam Results Guide', description: 'What to do if you pass, if you don\'t, and how to interpret your result either way.' }
    ],
    audience: [
      'EMT or Paramedic students who feel anxious about the NREMT',
      'Students who know the material but freeze up or second-guess themselves during the actual test',
      'Anyone who has failed the NREMT and suspects anxiety played a role'
    ]
  },
  {
    slug: 'clinical-judgment-workbook-paramedic',
    title: 'Clinical Judgment & TEI Workbook',
    subtitle: 'Paramedic Edition: Scenarios • Answer Key • Rationales',
    tagline: '10 clinical scenarios with 30 questions across every TEI format',
    price: 15.99,
    pages: 71,
    level: 'Paramedic',
    buyLink: 'https://path2medic.thinkific.com/enroll/3605333?price_id=4541954',
    coverImage: workbookCover,
    description: (
      <>
        <p className="mb-4">
          This is a hands-on practice workbook. Ten clinical scenarios, each with three questions spanning every TEI format the NREMT uses. You'll work through realistic patient encounters — respiratory distress, altered mental status, chest pain, trauma, anaphylaxis, behavioral emergencies, abdominal pain, syncope, status asthmaticus, and cardiac arrest.
        </p>
        <p>
          The second half of the workbook is a complete answer key with detailed clinical rationales for every question. Not just "the answer is C" — each rationale explains the clinical reasoning, why the correct answer is correct, and what specific misconception each wrong answer represents. Includes a performance analysis guide so you can identify patterns in your results and target your remaining study time.
        </p>
      </>
    ),
    features: [
      { title: '10 Realistic Scenarios', description: 'Covering airway, cardiology, trauma, medical, and special populations.' },
      { title: '30 TEI Questions', description: 'Using Multiple Choice, Multiple Response (SATA), Build List, Drag-and-Drop, and Options Box.' },
      { title: 'Detailed Answer Key', description: 'With clinical rationales for every option — correct and incorrect.' },
      { title: 'Clinical Judgment Framework', description: 'Reference showing how each question maps to the six cognitive functions.' },
      { title: 'Performance Analysis Guide', description: 'With scoring interpretation and content domain review.' },
      { title: 'Realistic Conditions', description: 'Designed to be taken under timed conditions (90–120 minutes).' }
    ],
    audience: [
      'Paramedic students who want to practice TEI formats before the real exam',
      'Students who have read strategy guides and now need to apply what they\'ve learned',
      'EMS educators looking for quality scenario-based assessment tools for their students'
    ]
  },
  {
    slug: 'under-the-hood',
    title: 'Under the Hood',
    subtitle: 'How NREMT Exam Items Are Built & What That Means for Your Prep',
    tagline: 'The item writing guide for educators and tutors',
    price: 22.99,
    pages: 76,
    level: 'Educators / Tutors',
    buyLink: 'https://path2medic.thinkific.com/enroll/3674017?price_id=4619456',
    coverImage: underTheHoodCover,
    description: (
      <>
        <p className="mb-4">
          This book is about the other side of the exam — how the questions are actually written. It covers the current research on NREMT item development, the Clinical Judgment framework from the item writer's perspective, how each TEI format is structured and scored, and the principles of evidence-based distractor construction.
        </p>
        <p>
          If you write practice exams for students or tutor NREMT candidates, this changes how you approach it. The biggest insight: tagging metadata on every answer option — not just the correct answer, but each individual distractor. When you know what misconception a wrong answer reveals, you can pinpoint exactly where a student's clinical reasoning breaks down and address it directly. This book is based on the research, official NREMT documentation, and what the author has seen work across hundreds of students.
        </p>
      </>
    ),
    features: [
      { title: 'NREMT Item Development', description: 'The methodology, the committees, and the standards.' },
      { title: 'Clinical Judgment Framework', description: 'From the item writer\'s perspective.' },
      { title: 'All 6 TEI Formats', description: 'Explained with structure, scoring rules, and design intent.' },
      { title: 'Evidence-Based Distractors', description: 'How to write wrong answers that reveal specific misconceptions.' },
      { title: 'Metadata Tagging', description: 'Methodology for correct answers, question types, and incorrect options.' },
      { title: 'Companion Excel Template', description: 'Item bank template with example items demonstrating the full metadata structure.' }
    ],
    audience: [
      'EMS educators who write practice exams or classroom assessments',
      'NREMT tutors who want to build better diagnostic tools for their students'
    ]
  }
];
