import Link from 'next/link';
import { seedJobs } from '@/lib/domain/seedJobs';
import { jobs } from '@/lib/domain/devStore';
import { getOrCreateTodayEntry, updateTodayEntry } from '@/lib/domain/dailyEntryStore';

type Props = {
  params: { jobId: string };
};

export default function JobDetailPage({ params }: Props) {
  seedJobs();

  const job = jobs.find((j) => j.id === params.jobId);

  if (!job) {
    return (
      <main className="min-h-screen bg-neutral-100 p-8 text-neutral-900">
        <h1 className="text-xl font-semibold">Job not found</h1>
        <p className="mt-2 text-sm text-neutral-600">
          No job with id: <span className="font-mono">{params.jobId}</span>
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium underline">
          Back to dashboard
        </Link>
      </main>
    );
  }

  const entry = getOrCreateTodayEntry(job.id);

  return (
    <main className="min-h-screen bg-neutral-100 p-8 text-neutral-900">
      <div className="mb-6">
        <Link href="/" className="text-sm font-medium underline">
          ← Back
        </Link>

        <div className="mt-3 text-sm text-neutral-500">Job</div>
        <h1 className="text-2xl font-bold tracking-tight">
          {job.jobNumber} — {job.name}
        </h1>

        <div className="mt-2 text-sm text-neutral-700">
          <div>
            <span className="font-semibold">Main Contractor:</span> {job.mainContractor}
          </div>
          <div>
            <span className="font-semibold">Site:</span> {job.siteAddress}
          </div>
          <div>
            <span className="font-semibold">Stage:</span> {job.stage}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-8 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
              Today Entry
            </h2>
            <div className="text-xs text-neutral-500">
              {entry.date}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Labour Summary
              </label>
              <textarea
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                rows={4}
                defaultValue={entry.labourSummary}
                onBlur={(e) => updateTodayEntry(job.id, { labourSummary: e.target.value })}
                placeholder="Crew, hours, key work completed, constraints."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Materials Summary
              </label>
              <textarea
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                rows={4}
                defaultValue={entry.materialsSummary}
                onBlur={(e) => updateTodayEntry(job.id, { materialsSummary: e.target.value })}
                placeholder="Deliveries, orders placed, shortages, returns."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Issues Summary
              </label>
              <textarea
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                rows={4}
                defaultValue={entry.issuesSummary}
                onBlur={(e) => updateTodayEntry(job.id, { issuesSummary: e.target.value })}
                placeholder="RFIs, variations, safety, access, delays, decisions required."
              />
            </div>

            <p className="text-xs text-neutral-500">
              Autosaves on field blur (temporary in-memory store until Supabase in M8).
            </p>
          </div>
        </section>

        <aside className="col-span-4 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Job Actions
          </h2>

          <div className="mt-4 space-y-2 text-sm">
            <button
              type="button"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-left shadow-sm hover:bg-neutral-50"
              disabled
              title="Connected in a later milestone"
            >
              + Add task (M7)
            </button>
            <button
              type="button"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-left shadow-sm hover:bg-neutral-50"
              disabled
              title="Connected in a later milestone"
            >
              + Add material order (M7)
            </button>
            <button
              type="button"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-left shadow-sm hover:bg-neutral-50"
              disabled
              title="Connected in a later milestone"
            >
              + Add issue (M7)
            </button>
          </div>

          <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
            <div className="font-semibold">Today Entry Status</div>
            <div className="mt-1">
              Created: <span className="font-mono">{entry.createdAt}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}