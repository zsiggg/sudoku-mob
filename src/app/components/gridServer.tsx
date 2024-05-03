import { getPuzzle, getPuzzleIds } from '../utils/supabase/puzzlesDb';
import GridClient from './gridClient';

const GridServer = async ({
  puzzle_id,
  puzzle,
}: {
  puzzle_id?: string;
  puzzle?: string;
}) => {
  const puzzlePromise =
    puzzle_id !== undefined ? getPuzzle(puzzle_id) : Promise.resolve(puzzle);
  const puzzleIdsPromise = getPuzzleIds();
  const puzzleRowNumPromise = puzzleIdsPromise.then((puzzleIds) =>
    puzzleIds.includes(puzzle_id)
      ? puzzleIds.indexOf(puzzle_id) + 1
      : undefined,
  );

  return Promise.all([
    puzzlePromise,
    puzzleIdsPromise,
    puzzleRowNumPromise,
  ]).then(([puzzle, puzzleIds, puzzleRowNum]) => (
    <GridClient
      puzzle_id={puzzle_id}
      puzzle={puzzle}
      puzzle_ids={puzzleIds}
      puzzle_row_number={puzzleRowNum}
    />
  ));
};

export default GridServer;
