import Link from 'next/link';
import { seedJobs } from '@/lib/domain/seedJobs';
import { jobs } from '@/lib/domain/devStore';
import { calculatePrioritySummary } from '@/lib/domain/prioritySummary';

export default function Home() {
  seedJobs();
  const summary = calculatePrioritySummary();

  return (
    <main className="min-h-screen bg-neutral-100 p-8 text-neutral-900">
      {/* Top Bar */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">ForgeSiteDiary</h1>

        <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          + New Job
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-9 space-y-6">
          {/* Priority Rail */}
          <div className="rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
              Priority
            </h2>

            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{summary.critical}</div>
                <div className="text-xs text-neutral-500">Critical</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{summary.high}</div>
                <div className="text-xs text-neutral-500">High</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-800">{summary.overdue}</div>
                <div className="text-xs text-neutral-500">Overdue</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{summary.ordered}</div>
                <div className="text-xs text-neutral-500">Ordered</div>
              </div>
            </div>
          </div>

          {/* Jobs */}
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-lg border border-neutral-300 bg-white p-5 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-900/30"
              >
                <div className="text-base font-semibold">
                  {job.jobNumber} — {job.name}
                </div>
                <div className="mt-1 text-sm text-neutral-600">{job.mainContractor}</div>
                <div className="text-xs text-neutral-500">{job.siteAddress}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-3">
          <div className="rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
              Activity
            </h2>
            <p className="text-sm text-neutral-500">(Connected in M5)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
