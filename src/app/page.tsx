import { seedJobs } from '@/lib/domain/seedJobs';
import { jobs } from '@/lib/domain/devStore';

export default function Home() {
  seedJobs();

  return (
    <main className="min-h-screen bg-neutral-100">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-xl font-semibold">ForgeSiteDiary</h1>
        <button className="rounded-md bg-black px-4 py-2 text-sm text-white">
          + New Job
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6 p-6">

        {/* Priority Rail */}
        <aside className="col-span-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Priority</h2>
          <p className="mt-4 text-xs text-neutral-500">
            (Connected in M4)
          </p>
        </aside>

        {/* Job Grid */}
        <section className="col-span-6 grid gap-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="text-sm font-semibold">
                {job.jobNumber} — {job.name}
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                {job.mainContractor}
              </div>
              <div className="mt-1 text-xs text-neutral-400">
                {job.siteAddress}
              </div>
            </div>
          ))}
        </section>

        {/* Activity Feed */}
        <aside className="col-span-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Activity</h2>
          <p className="mt-4 text-xs text-neutral-500">
            (Connected in M5)
          </p>
        </aside>

      </div>
    </main>
  );
}
