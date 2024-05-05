import {
  getPuzzleAndMinMoves,
  getPuzzleIdsAndRowNums,
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
  const puzzleIdsAndRowNumsPromise = getPuzzleIdsAndRowNums();
  const puzzleRowNumPromise = puzzleIdsAndRowNumsPromise.then(
    (rows) => rows.filter((row) => row.id === puzzleId)[0]?.row_num,
  );

  return Promise.all([
    puzzlePromise,
    puzzleIdsAndRowNumsPromise,
    puzzleRowNumPromise,
  ]).then(([{ puzzle, min_moves }, puzzleIdsAndRowNums, puzzleRowNum]) => (
    <PuzzleClient
      puzzleId={puzzleId}
      puzzle={puzzle}
      puzzleIdsAndRowNums={puzzleIdsAndRowNums}
      puzzleRowNum={puzzleRowNum}
      targetMoves={min_moves}
    />
  ));
};

export default PuzzleServer;
