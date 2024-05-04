import {
  getPuzzleAndMinMoves,
  getPuzzleIds,
} from '../utils/supabase/puzzlesDb';
import PuzzleClient from './puzzleClient';

const PuzzleServer = async ({
  puzzleId,
  puzzle,
}: {
  puzzleId?: string;
  puzzle?: string;
}) => {
  const puzzlePromise =
    puzzleId !== undefined
      ? getPuzzleAndMinMoves(puzzleId)
      : puzzle !== undefined
        ? Promise.resolve({ puzzle: puzzle, min_moves: null })
        : Promise.reject('No puzzleId or puzzle provided');
  const puzzleIdsPromise = getPuzzleIds();
  const puzzleRowNumPromise = puzzleIdsPromise.then((puzzleIds) =>
    puzzleIds.includes(puzzleId ?? '')
      ? puzzleIds.indexOf(puzzleId ?? '') + 1
      : undefined,
  );

  return Promise.all([
    puzzlePromise,
    puzzleIdsPromise,
    puzzleRowNumPromise,
  ]).then(([{ puzzle, min_moves }, puzzleIds, puzzleRowNum]) => (
    <PuzzleClient
      puzzleId={puzzleId}
      puzzle={puzzle}
      puzzleIds={puzzleIds}
      puzzleRowNum={puzzleRowNum}
      targetMoves={min_moves}
    />
  ));
};

export default PuzzleServer;
