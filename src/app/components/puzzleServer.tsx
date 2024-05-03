import { getPuzzle, getPuzzleIds } from '../utils/supabase/puzzlesDb';
import PuzzleClient from './puzzleClient';

const PuzzleServer = async ({
  puzzleId,
  puzzle,
}: {
  puzzleId?: string;
  puzzle?: string;
}) => {
  const puzzlePromise =
    puzzleId !== undefined ? getPuzzle(puzzleId) : Promise.resolve(puzzle);
  const puzzleIdsPromise = getPuzzleIds();
  const puzzleRowNumPromise = puzzleIdsPromise.then((puzzleIds) =>
    puzzleIds.includes(puzzleId) ? puzzleIds.indexOf(puzzleId) + 1 : undefined,
  );

  return Promise.all([
    puzzlePromise,
    puzzleIdsPromise,
    puzzleRowNumPromise,
  ]).then(([puzzle, puzzleIds, puzzleRowNum]) => (
    <PuzzleClient
      puzzleId={puzzleId}
      puzzle={puzzle}
      puzzleIds={puzzleIds}
      puzzleRowNum={puzzleRowNum}
    />
  ));
};

export default PuzzleServer;
