import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  user_type: 'jobseeker' | 'recruiter'
  first_name: string
  last_name: string
  company?: string
  created_at: string
}

export interface AuthUser {
  email: string
  password: string
  user_type: 'jobseeker' | 'recruiter'
  first_name: string
  last_name: string
  company?: string
}

export interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
  salary_min?: number
  salary_max?: number
  salary_currency: string
  description: string
  requirements?: string
  benefits?: string
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
  posted_by: string
  is_active: boolean
  created_at: string
  updated_at: string
  expires_at: string
}

export interface Application {
  id: string
  job_id: string
  applicant_id: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  cover_letter?: string
  resume_url?: string
  applied_at: string
}