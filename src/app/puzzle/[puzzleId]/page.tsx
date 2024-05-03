import { Suspense } from 'react';
import PuzzleServer from '../../components/puzzleServer';
import PuzzleLoading from './loading';

export default function Home({ params }: { params: { puzzleId: string } }) {
  const { puzzleId } = params;
  return (
    <main className="flex h-screen flex-col items-center justify-between p-2">
      <Suspense fallback={<PuzzleLoading />}>
        <PuzzleServer puzzleId={puzzleId} />
      </Suspense>
    </main>
  );
}
