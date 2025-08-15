'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile, signOut, getJobPostings, applyToJob } from '@/lib/auth';
import type { User, JobPosting } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import JobDetailsModal from '@/components/JobDetailsModal';
import SearchFilters from '@/components/SearchFilters';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  
  // Modal state
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  
  // Enhanced filter states
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);
  const [datePosted, setDatePosted] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  
  const router = useRouter();

  // Load user and jobs
  useEffect(() => {
    loadData();
  }, [router]);

  // Reload jobs when filters change
  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [searchTerm, jobType, location, experienceLevel, salaryRange, datePosted, companySize, sortBy, quickFilters, user]);

  const loadData = async () => {
    const { data: userData, error: userError } = await getCurrentUserProfile();
    
    if (userError || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(userData);
    setLoading(false);
  };

  const loadJobs = async () => {
    const filters = {
      searchTerm: searchTerm || undefined,
      jobType: jobType || undefined,
      location: location || undefined,
      experienceLevel: experienceLevel || undefined,
      salaryMin: salaryRange[0] > 0 ? salaryRange[0] : undefined,
      salaryMax: salaryRange[1] < 200000 ? salaryRange[1] : undefined,
      datePosted: datePosted || undefined,
      companySize: companySize || undefined,
      quickFilters: quickFilters.length > 0 ? quickFilters : undefined,
    };

    const { data: jobsData } = await getJobPostings(filters);
    if (jobsData) {
      // Apply client-side sorting
      let sortedJobs = [...jobsData];
      
      switch (sortBy) {
        case 'salary':
          sortedJobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
          break;
        case 'company':
          sortedJobs.sort((a, b) => a.company.localeCompare(b.company));
          break;
        case 'relevance':
          // Simple relevance based on search term match
          if (searchTerm) {
            sortedJobs.sort((a, b) => {
              const aScore = (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
                           (a.company.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0);
              const bScore = (b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
                           (b.company.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0);
              return bScore - aScore;
            });
          }
          break;
        case 'date':
        default:
          sortedJobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }
      
      setJobs(sortedJobs);
    }
  };

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      alert('🚧 Job Application Feature Coming Soon!\n\nWe\'re working hard to bring you a seamless application experience. This feature will be available in the next update.\n\nStay tuned! 🎉');
      setApplying(null);
    }, 1000);
  };

  const handleJobClick = (job: JobPosting) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">CareerBridge</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {user?.user_type}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.user_type === 'recruiter' ? 'Recruiter Dashboard' : 'Find Your Next Job'}
          </h2>
          <p className="text-gray-600">
            {user?.user_type === 'recruiter' 
              ? 'Manage your job postings and find great candidates'
              : 'Discover opportunities that match your skills'
            }
          </p>
        </div>

        {/* Search & Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          jobType={jobType}
          onJobTypeChange={setJobType}
          location={location}
          onLocationChange={setLocation}
          experienceLevel={experienceLevel}
          onExperienceLevelChange={setExperienceLevel}
          salaryRange={salaryRange}
          onSalaryRangeChange={setSalaryRange}
          datePosted={datePosted}
          onDatePostedChange={setDatePosted}
          companySize={companySize}
          onCompanySizeChange={setCompanySize}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          quickFilters={quickFilters}
          onQuickFiltersChange={setQuickFilters}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Job Cards */}
        <div className="max-w-4xl">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={user?.user_type === 'jobseeker' ? handleApply : undefined}
              applying={applying === job.id}
              showApplyButton={user?.user_type === 'jobseeker'}
              onClick={() => handleJobClick(job)}
            />
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters
            </p>
          </div>
        )}

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onApply={user?.user_type === 'jobseeker' ? handleApply : undefined}
            applying={applying === selectedJob.id}
            showApplyButton={user?.user_type === 'jobseeker'}
          />
        )}
      </main>
    </div>
  );
}