import { useMemo, useState, useEffect } from 'react';
import { useJobsData } from '../../contexts/JobsDataContext';
import { useCompanies } from '../../contexts/CompaniesContext';
import { getAllApplications } from '../../services/jobApplicationService';
import { getRegisteredUserCount } from '../../services/reportService';

const StatCard = ({ label, value, textColor, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}>
    <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</div>
  </div>
);

const BreakdownList = ({ title, entries }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
    {entries.length === 0 ? (
      <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
    ) : (
      <div className="space-y-3">
        {entries.map(([label, count, percent]) => (
          <div key={label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
              <span className="text-gray-500 dark:text-gray-400">{count}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const toSortedEntries = (counts, total) =>
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => [label, count, total > 0 ? Math.round((count / total) * 100) : 0]);

const Reports = () => {
  const { jobs, loading: jobsLoading } = useJobsData();
  const { companies, loading: companiesLoading } = useCompanies();
  const [applications, setApplications] = useState([]);
  const [registeredUserCount, setRegisteredUserCount] = useState(0);
  const [reportDataLoading, setReportDataLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadReportData = async () => {
      const [apps, userCount] = await Promise.all([
        getAllApplications(),
        getRegisteredUserCount()
      ]);
      if (isMounted) {
        setApplications(apps);
        setRegisteredUserCount(userCount);
        setReportDataLoading(false);
      }
    };

    loadReportData();

    return () => {
      isMounted = false;
    };
  }, []);

  const jobsByCategory = useMemo(() => {
    const counts = {};
    jobs.forEach((job) => {
      counts[job.category] = (counts[job.category] || 0) + 1;
    });
    return toSortedEntries(counts, jobs.length);
  }, [jobs]);

  const jobsByWorkType = useMemo(() => {
    const counts = {};
    jobs.forEach((job) => {
      counts[job.workType] = (counts[job.workType] || 0) + 1;
    });
    return toSortedEntries(counts, jobs.length);
  }, [jobs]);

  const applicationsByStatus = useMemo(() => {
    const counts = {};
    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return toSortedEntries(counts, applications.length);
  }, [applications]);

  const isLoading = jobsLoading || companiesLoading || reportDataLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Platform-wide activity and breakdowns
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                label="Total Jobs"
                value={jobs.length}
                textColor="text-blue-600 dark:text-blue-400"
                bgColor="bg-blue-50 dark:bg-blue-900/20"
              />
              <StatCard
                label="Total Companies"
                value={companies.length}
                textColor="text-purple-600 dark:text-purple-400"
                bgColor="bg-purple-50 dark:bg-purple-900/20"
              />
              <StatCard
                label="Total Applications"
                value={applications.length}
                textColor="text-green-600 dark:text-green-400"
                bgColor="bg-green-50 dark:bg-green-900/20"
              />
              <StatCard
                label="Registered Users"
                value={registeredUserCount}
                textColor="text-amber-600 dark:text-amber-400"
                bgColor="bg-amber-50 dark:bg-amber-900/20"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <BreakdownList title="Jobs by Category" entries={jobsByCategory} />
              <BreakdownList title="Jobs by Work Type" entries={jobsByWorkType} />
              <BreakdownList title="Applications by Status" entries={applicationsByStatus} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
