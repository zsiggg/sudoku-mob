import { Suspense } from 'react';
import GridSuspense from './components/gridSuspense';
import SuspenseFallback from './loading';

export default function Home({ params }: { params: { puzzle_id: string } }) {
  const { puzzle_id } = params;
  return (
    <main className="flex h-screen flex-col items-center justify-between p-2">
      <Suspense fallback={<SuspenseFallback />}>
        <GridSuspense puzzle_id={puzzle_id} />
      </Suspense>
    </main>
  );
}
