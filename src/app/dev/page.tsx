import { seedAndTestRollover } from '@/lib/rollover/rolloverTest';

export default function DevPage() {
  const r = seedAndTestRollover();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-xl font-semibold">Dev Tools</h1>
      <p className="mt-2 text-sm text-neutral-600">Rollover test output:</p>
      <pre className="mt-4 rounded-md bg-neutral-950 p-4 text-xs text-neutral-100 overflow-auto">
        {JSON.stringify(r, null, 2)}
      </pre>
    </main>
  );
}
