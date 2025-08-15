'use client';

import { useState } from 'react';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  jobType: string;
  onJobTypeChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  experienceLevel: string;
  onExperienceLevelChange: (value: string) => void;
  // New filter props
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  datePosted: string;
  onDatePostedChange: (value: string) => void;
  companySize: string;
  onCompanySizeChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  quickFilters: string[];
  onQuickFiltersChange: (filters: string[]) => void;
}

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  jobType,
  onJobTypeChange,
  location,
  onLocationChange,
  experienceLevel,
  onExperienceLevelChange,
  salaryRange,
  onSalaryRangeChange,
  datePosted,
  onDatePostedChange,
  companySize,
  onCompanySizeChange,
  sortBy,
  onSortByChange,
  quickFilters,
  onQuickFiltersChange,
}: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900";

  const handleSalaryChange = (index: number, value: number) => {
    const newRange: [number, number] = [...salaryRange];
    newRange[index] = value;
    onSalaryRangeChange(newRange);
  };

  const toggleQuickFilter = (filter: string) => {
    const newFilters = quickFilters.includes(filter)
      ? quickFilters.filter(f => f !== filter)
      : [...quickFilters, filter];
    onQuickFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onJobTypeChange('');
    onLocationChange('');
    onExperienceLevelChange('');
    onSalaryRangeChange([0, 200000]);
    onDatePostedChange('');
    onCompanySizeChange('');
    onSortByChange('date');
    onQuickFiltersChange([]);
  };

  const quickFilterOptions = [
    { id: 'remote', label: 'Remote Only', icon: '🏠' },
    { id: 'entry-level', label: 'Entry Level', icon: '🌱' },
    { id: 'high-salary', label: 'High Salary', icon: '💰' },
    { id: 'full-time', label: 'Full Time', icon: '⏰' },
    { id: 'startup', label: 'Startup', icon: '🚀' },
    { id: 'tech', label: 'Tech', icon: '💻' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      {/* Main Search Bar */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search jobs, companies, keywords..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="min-w-[160px]">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className={inputStyle}
            >
              <option value="date">Sort by Date</option>
              <option value="salary">Sort by Salary</option>
              <option value="relevance">Sort by Relevance</option>
              <option value="company">Sort by Company</option>
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span className="text-gray-700">Filters</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {quickFilterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleQuickFilter(option.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                quickFilters.includes(option.id)
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
          
          {(quickFilters.length > 0 || searchTerm || jobType || location || experienceLevel || datePosted || companySize) && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => onJobTypeChange(e.target.value)}
                className={inputStyle}
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="City, State, or Remote"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className={inputStyle}
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => onExperienceLevelChange(e.target.value)}
                className={inputStyle}
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            {/* Date Posted */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Posted</label>
              <select
                value={datePosted}
                onChange={(e) => onDatePostedChange(e.target.value)}
                className={inputStyle}
              >
                <option value="">Any Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="3d">Last 3 Days</option>
                <option value="1w">Last Week</option>
                <option value="1m">Last Month</option>
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => onCompanySizeChange(e.target.value)}
                className={inputStyle}
              >
                <option value="">Any Size</option>
                <option value="startup">Startup (1-50)</option>
                <option value="small">Small (51-200)</option>
                <option value="medium">Medium (201-1000)</option>
                <option value="large">Large (1000+)</option>
              </select>
            </div>

            {/* Salary Range Slider */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
              </label>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min Salary</label>
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="5000"
                      value={salaryRange[0]}
                      onChange={(e) => handleSalaryChange(0, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max Salary</label>
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="5000"
                      value={salaryRange[1]}
                      onChange={(e) => handleSalaryChange(1, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$300k+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}