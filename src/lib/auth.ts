import { supabase } from './supabase'
import type { AuthUser, JobPosting } from './supabase'

// Sign up function
export async function signUp(userData: AuthUser) {
    try {
        // 1. First create the auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
        })

        if (authError) {
            throw authError
        }

        // 2. Wait a moment for the auth user to be fully created
        if (authData.user) {
            // Use a small delay to ensure auth context is ready
            await new Promise(resolve => setTimeout(resolve, 100))

            // 3. Create the user profile with the service role
            const { error: profileError } = await supabase
                .from('users')
                .insert([
                    {
                        id: authData.user.id,
                        email: userData.email,
                        user_type: userData.user_type,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        company: userData.company || null,
                    }
                ])

            if (profileError) {
                console.error('Profile creation error:', profileError)
                // If profile creation fails, we should clean up the auth user
                // But for now, let's just log the error and continue
            }
        }

        return { data: authData, error: null }
    } catch (error) {
        console.error('Sign up error:', error)
        return { data: null, error }
    }
}

// Sign in function
export async function signIn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            // Handle specific error cases
            if (error.message === 'Email not confirmed') {
                return {
                    data: null,
                    error: {
                        ...error,
                        message: 'Please check your email and click the confirmation link before signing in.'
                    }
                }
            }
            throw error
        }

        return { data, error: null }
    } catch (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
    }
}

// Sign out function
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
        return { error: null }
    } catch (error) {
        console.error('Sign out error:', error)
        return { error }
    }
}

// Resend confirmation email
export async function resendConfirmation(email: string) {
    try {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        })

        if (error) {
            throw error
        }

        return { error: null }
    } catch (error) {
        console.error('Resend confirmation error:', error)
        return { error }
    }
}

// Send password reset email
export async function sendPasswordReset(email: string) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            throw error
        }

        return { error: null }
    } catch (error) {
        console.error('Password reset error:', error)
        return { error }
    }
}

// Update password (used after reset)
export async function updatePassword(newPassword: string) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            throw error
        }

        return { error: null }
    } catch (error) {
        console.error('Update password error:', error)
        return { error }
    }
}

// Get current user profile
export async function getCurrentUserProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { data: null, error: 'No user found' }
        }

        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) {
            throw error
        }

        return { data: profile, error: null }
    } catch (error) {
        console.error('Get user profile error:', error)
        return { data: null, error }
    }
}

// Job posting functions
export async function getJobPostings(filters?: {
    searchTerm?: string;
    jobType?: string;
    location?: string;
    experienceLevel?: string;
    salaryMin?: number;
    salaryMax?: number;
    datePosted?: string;
    companySize?: string;
    quickFilters?: string[];
}) {
    try {
        let query = supabase
            .from('job_postings')
            .select('*')
            .eq('is_active', true)

        // Apply filters
        if (filters?.searchTerm) {
            query = query.or(`title.ilike.%${filters.searchTerm}%,company.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`)
        }

        if (filters?.jobType) {
            query = query.eq('job_type', filters.jobType)
        }

        if (filters?.location) {
            query = query.ilike('location', `%${filters.location}%`)
        }

        if (filters?.experienceLevel) {
            query = query.eq('experience_level', filters.experienceLevel)
        }

        // Salary range filters
        if (filters?.salaryMin) {
            query = query.gte('salary_min', filters.salaryMin)
        }

        if (filters?.salaryMax) {
            query = query.lte('salary_max', filters.salaryMax)
        }

        // Date posted filter
        if (filters?.datePosted) {
            const now = new Date()
            let dateThreshold: Date

            switch (filters.datePosted) {
                case '24h':
                    dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                    break
                case '3d':
                    dateThreshold = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
                    break
                case '1w':
                    dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    break
                case '1m':
                    dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                    break
                default:
                    dateThreshold = new Date(0)
            }

            query = query.gte('created_at', dateThreshold.toISOString())
        }

        // Quick filters
        if (filters?.quickFilters && filters.quickFilters.length > 0) {
            filters.quickFilters.forEach(filter => {
                switch (filter) {
                    case 'remote':
                        query = query.or('job_type.eq.remote,location.ilike.%remote%')
                        break
                    case 'entry-level':
                        query = query.eq('experience_level', 'entry')
                        break
                    case 'high-salary':
                        query = query.gte('salary_min', 100000)
                        break
                    case 'full-time':
                        query = query.eq('job_type', 'full-time')
                        break
                    case 'startup':
                        // This would need company size data in the database
                        break
                    case 'tech':
                        query = query.or('title.ilike.%developer%,title.ilike.%engineer%,title.ilike.%programmer%,title.ilike.%tech%')
                        break
                }
            })
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return { data, error: null }
    } catch (error) {
        console.error('Get job postings error:', error)
        return { data: null, error }
    }
}

export async function createJobPosting(jobData: Omit<JobPosting, 'id' | 'posted_by' | 'is_active' | 'created_at' | 'updated_at' | 'expires_at'>) {
    try {
        // Get current user ID
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('job_postings')
            .insert([{
                ...jobData,
                posted_by: user.id
            }])
            .select()
            .single()

        if (error) {
            throw error
        }

        return { data, error: null }
    } catch (error) {
        console.error('Create job posting error:', error)
        return { data: null, error }
    }
}

export async function applyToJob(jobId: string, coverLetter?: string) {
    try {
        const { data, error } = await supabase
            .from('applications')
            .insert([
                {
                    job_id: jobId,
                    cover_letter: coverLetter,
                }
            ])
            .select()
            .single()

        if (error) {
            throw error
        }

        return { data, error: null }
    } catch (error) {
        console.error('Apply to job error:', error)
        return { data: null, error }
    }
}

export async function getUserApplications() {
    try {
        const { data, error } = await supabase
            .from('applications')
            .select(`
        *,
        job_postings (
          id,
          title,
          company,
          location,
          job_type
        )
      `)
            .order('applied_at', { ascending: false })

        if (error) {
            throw error
        }

        return { data, error: null }
    } catch (error) {
        console.error('Get user applications error:', error)
        return { data: null, error }
    }
}

// Get jobs posted by current recruiter
export async function getRecruiterJobs() {
    try {
        const { data, error } = await supabase
            .from('job_postings')
            .select('*')
            .eq('posted_by', (await supabase.auth.getUser()).data.user?.id)
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return { data, error: null }
    } catch (error) {
        console.error('Get recruiter jobs error:', error)
        return { data: null, error }
    }
}