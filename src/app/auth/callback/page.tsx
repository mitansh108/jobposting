'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUserProfile } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth_failed');
          return;
        }

        if (data.session) {
          // Get user profile to determine redirect
          const { data: profile } = await getCurrentUserProfile();
          
          if (profile?.user_type === 'recruiter') {
            router.push('/recruiter-dashboard');
          } else if (profile?.user_type === 'jobseeker') {
            router.push('/dashboard');
          } else {
            // User exists but no user_type set, or no profile exists (Google OAuth user)
            router.push('/auth/complete-profile');
          }
        } else {
          // No session, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        router.push('/login?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}