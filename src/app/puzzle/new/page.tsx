import PuzzleServer from '@/app/components/puzzleServer';
import { getSudoku } from 'sudoku-gen';

export default async function RandomNew() {
  const puzzleObj = getSudoku();
  const puzzle = puzzleObj.puzzle.replace(/-/g, '.');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2">
      <PuzzleServer puzzle={puzzle} />
    </main>
  );
}
