import type { JobPosting } from '@/lib/supabase';

interface JobDetailsModalProps {
    job: JobPosting;
    isOpen: boolean;
    onClose: () => void;
    onApply?: (jobId: string) => void;
    applying?: boolean;
    showApplyButton?: boolean;
}

export default function JobDetailsModal({
    job,
    isOpen,
    onClose,
    onApply,
    applying,
    showApplyButton
}: JobDetailsModalProps) {
    if (!isOpen) return null;

    const formatSalary = (min?: number, max?: number) => {
        if (!min && !max) return 'Salary not specified';
        if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        if (min) return `$${min.toLocaleString()}+`;
        return `Up to $${max?.toLocaleString()}`;
    };

    const getCompanyInitials = (company: string) => {
        return company
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const jobDate = new Date(date);
        const diffInHours = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return jobDate.toLocaleDateString();
    };

    const getJobTypeColor = (type: string) => {
        const colors = {
            'full-time': 'bg-blue-100 text-blue-800',
            'part-time': 'bg-indigo-100 text-indigo-800',
            'contract': 'bg-purple-100 text-purple-800',
            'internship': 'bg-orange-100 text-orange-800',
            'remote': 'bg-green-100 text-green-800',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            {/* Company Logo */}
                            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xl">
                                    {getCompanyInitials(job.company)}
                                </span>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-sm text-gray-500 font-medium">{getTimeAgo(job.created_at)}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm text-gray-500">Less than 25 applicants</span>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {job.title}
                                </h1>

                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-indigo-600 font-semibold text-lg">{job.company}</span>
                                    <span className="text-gray-400">/</span>
                                    <span className="text-gray-600 capitalize">{job.job_type.replace('-', ' ')}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600 capitalize">{job.experience_level} level</span>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {job.location}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        {formatSalary(job.salary_min, job.salary_max)}
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.job_type)}`}>
                                        {job.job_type === 'remote' ? 'Remote' : job.job_type === 'internship' ? 'Internship' : job.job_type.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-400 hover:text-indigo-500 rounded-full hover:bg-indigo-50 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>

                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 mt-4">
                        {showApplyButton && onApply && (
                            <button
                                onClick={() => onApply(job.id)}
                                disabled={applying}
                                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        )}
                        <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            Save Job
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Job Description */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {job.description}
                                    </p>
                                </div>
                            </div>

                            {/* Requirements */}
                            {job.requirements && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {job.requirements}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            {job.benefits && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {job.benefits}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Job Details Card */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Job Type</dt>
                                        <dd className="text-sm text-gray-900 capitalize">{job.job_type.replace('-', ' ')}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
                                        <dd className="text-sm text-gray-900 capitalize">{job.experience_level}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                                        <dd className="text-sm text-gray-900">{job.location}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Salary</dt>
                                        <dd className="text-sm text-gray-900">{formatSalary(job.salary_min, job.salary_max)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Posted</dt>
                                        <dd className="text-sm text-gray-900">{getTimeAgo(job.created_at)}</dd>
                                    </div>
                                </div>
                            </div>

                            {/* Company Info Card */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.company}</h3>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold">
                                            {getCompanyInitials(job.company)}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{job.company}</h4>
                                        <p className="text-sm text-gray-500">Technology Company</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    A leading company in the industry, committed to innovation and excellence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}