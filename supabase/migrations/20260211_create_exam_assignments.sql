-- Create exam_assignments table for coaching student exam workflow
-- This table tracks exams assigned by Vincent to coaching students

CREATE TABLE IF NOT EXISTS exam_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_email TEXT NOT NULL,
  student_id UUID REFERENCES students(id),
  exam_type TEXT CHECK (exam_type IN ('intake', 'posttest')) NOT NULL,
  certification_level TEXT NOT NULL CHECK (certification_level IN ('EMT', 'AEMT', 'Paramedic')),
  exam_file_url TEXT,
  exam_id TEXT,
  exam_version TEXT DEFAULT 'v1',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_progress', 'submitted', 'graded')) NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  score_percentage NUMERIC,
  total_questions INTEGER,
  submission_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_exam_assignments_email ON exam_assignments(student_email);
CREATE INDEX IF NOT EXISTS idx_exam_assignments_status ON exam_assignments(status);
CREATE INDEX IF NOT EXISTS idx_exam_assignments_student_id ON exam_assignments(student_id);

-- RLS policies
ALTER TABLE exam_assignments ENABLE ROW LEVEL SECURITY;

-- Students can view their own assignments
CREATE POLICY "Students can view own assignments"
  ON exam_assignments FOR SELECT
  USING (student_email = auth.jwt() ->> 'email');

-- Students can update their own assignments (start/submit)
CREATE POLICY "Students can update own assignments"
  ON exam_assignments FOR UPDATE
  USING (student_email = auth.jwt() ->> 'email')
  WITH CHECK (student_email = auth.jwt() ->> 'email');

-- Service role / admin can do everything (for Vincent's admin actions)
CREATE POLICY "Service role full access"
  ON exam_assignments FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users to insert (for admin usage via client)
CREATE POLICY "Admins can insert assignments"
  ON exam_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
    )
  );

-- Allow admins to update any assignment (for grading)
CREATE POLICY "Admins can update any assignment"
  ON exam_assignments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
    )
  );
