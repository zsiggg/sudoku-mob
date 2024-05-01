import { Suspense } from 'react';
import GridSuspense from './gridSuspense';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <Suspense fallback={<p>Loading...</p>}>
        <GridSuspense />
      </Suspense>
    </main>
  );
}
