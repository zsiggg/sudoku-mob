import { getPuzzle, getPuzzleIds } from '../utils/supabase/puzzlesDb';
import GridClient from './gridClient';

const GridServer = async ({
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
    <GridClient
      puzzleId={puzzleId}
      puzzle={puzzle}
      puzzleIds={puzzleIds}
      puzzleRowNum={puzzleRowNum}
    />
  ));
};

export default GridServer;
