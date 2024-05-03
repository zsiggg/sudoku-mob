import GridServer from '@/app/components/gridServer';
import { getSudoku } from 'sudoku-gen';

export default async function RandomNew() {
  const puzzleObj = getSudoku();
  const puzzle = puzzleObj.puzzle.replace(/-/g, '.');

  return (
    <main className="flex h-screen flex-col items-center justify-between p-2">
      <GridServer puzzle={puzzle} />
    </main>
  );
}
