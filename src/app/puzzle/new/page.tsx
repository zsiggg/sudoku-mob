import { getSudoku } from 'sudoku-gen';
import GridClient from '../../components/gridClient';

export default async function RandomNew() {
  const puzzle = getSudoku();

  return (
    <main className="flex h-screen flex-col items-center justify-between p-2">
      <GridClient puzzle={puzzle.puzzle} />
    </main>
  );
}
