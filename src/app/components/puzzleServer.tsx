import {
  getPuzzleAndMinMoves,
  getPuzzleIdsRowNumsMinMoves,
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
  const puzzleIdsRowNumsMinMovesPromise = getPuzzleIdsRowNumsMinMoves();
  const puzzleRowNumPromise = puzzleIdsRowNumsMinMovesPromise.then(
    (rows) => rows.filter((row) => row.id === puzzleId)[0]?.row_num,
  );

  return Promise.all([
    puzzlePromise,
    puzzleIdsRowNumsMinMovesPromise,
    puzzleRowNumPromise,
  ]).then(([{ puzzle, min_moves }, puzzleIdsRowNumsMinMoves, puzzleRowNum]) => (
    <PuzzleClient
      puzzleId={puzzleId}
      puzzle={puzzle}
      puzzleIdsRowNumsMinMoves={puzzleIdsRowNumsMinMoves}
      puzzleRowNum={puzzleRowNum}
      targetMoves={min_moves}
    />
  ));
};

export default PuzzleServer;
