import { Suspense } from 'react';
import GridServer from './components/gridServer';
import PuzzleLoading from './loading';

export default function Home({ params }: { params: { puzzle_id: string } }) {
  const { puzzle_id } = params;
  return (
    <main className="flex h-screen flex-col items-center justify-between p-2">
      <Suspense fallback={<PuzzleLoading />}>
        <GridServer puzzle_id={puzzle_id} />
      </Suspense>
    </main>
  );
}
