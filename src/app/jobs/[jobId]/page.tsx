import Link from 'next/link';
import { seedJobs } from '@/lib/domain/seedJobs';
import { jobs } from '@/lib/domain/devStore';

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
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Today Entry (M6)
          </h2>
          <p className="mt-3 text-sm text-neutral-600">
            Daily entry form goes here next.
          </p>
        </section>

        <aside className="col-span-4 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Job Actions (M6)
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-600">
            <li>Add task</li>
            <li>Add material order</li>
            <li>Add issue</li>
            <li>Add follow-up email</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}