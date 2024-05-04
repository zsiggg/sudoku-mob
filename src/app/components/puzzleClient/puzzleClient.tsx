'use client';

import { useEffect, useRef, useState } from 'react';
import { isValidSudoku } from '../../utils/puzzleClient/helper';
import SubmissionToast from './submissionToast';
import { addPuzzle, checkIsPuzzleInDb } from '../../utils/supabase/puzzlesDb';
import ControlRow from './controlRow';
import Grid from './grid';
import { useMediaQuery } from 'react-responsive';
import NumButtons from './numButtons';

const PuzzleClient = ({
  puzzle,
  puzzleIds,
  puzzleId,
  puzzleRowNum,
  targetMoves,
}: {
  puzzle: string;
  puzzleIds: string[];
  puzzleId?: string;
  puzzleRowNum?: number;
  targetMoves: number | null;
}) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [showAddedToDbToast, setShowAddedToDbToast] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 1023px)' });
  const [isShowingNumButtons, setIsShowingNumButtons] = useState(false);

  const initialDigits = puzzle.split('').map((str) => (str === '.' ? '' : str));
  const initialEmptyCellCount = initialDigits.reduce(
    (count, digit) => (digit === '' ? count + 1 : count),
    0,
  );
  const [emptyCellCount, setEmptyCellCount] = useState(initialEmptyCellCount);
  const [digits, setDigits] = useState(initialDigits);

  const [clickedIdx, setClickedIdx] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const onSubmit = async () => {
    const isValid = isValidSudoku(digits);
    if (isValid) {
      setShowFailureToast(false);
      setShowSuccessToast(true);
      if (puzzleId === undefined) {
        const isPuzzleInDb = await checkIsPuzzleInDb(puzzle);
        if (!isPuzzleInDb) {
          await addPuzzle(puzzle);
          setShowAddedToDbToast(true);
        }
      }
    } else {
      setShowFailureToast(true);
      setTimeout(() => setShowFailureToast(false), 5000);
      setShowSuccessToast(false);
    }
  };

  useEffect(() => {
    setIsShowingNumButtons(isMobile);
  }, [isMobile]);

  return (
    <>
      <SubmissionToast
        isShowingSuccess={showSuccessToast}
        isShowingFailure={showFailureToast}
        isShowingAddedToDb={showAddedToDbToast}
        onSuccessDismiss={() => setShowSuccessToast(false)}
        onFailureDismiss={() => setShowFailureToast(false)}
        onAddedToDbDismiss={() => setShowAddedToDbToast(false)} // test
      />
      <div className="flex h-full flex-col items-center justify-center space-y-5 text-xl md:p-10 lg:space-y-7 xl:p-5">
        <Grid
          gridRef={gridRef}
          puzzleId={puzzleId}
          puzzleRowNum={puzzleRowNum}
          initialDigits={initialDigits}
          digits={digits}
          setDigits={setDigits}
          emptyCellCount={emptyCellCount}
          setEmptyCellCount={setEmptyCellCount}
          clickedIdx={clickedIdx}
          setClickedIdx={setClickedIdx}
          isMobile={isMobile}
          isShowingNumButtons={isShowingNumButtons}
          targetMoves={targetMoves}
        />
        <ControlRow
          puzzleIds={puzzleIds}
          puzzleId={puzzleId}
          emptyCellCount={emptyCellCount}
          onSubmit={onSubmit}
          isShowingNumButtons={isShowingNumButtons}
          setIsShowingNumButtons={setIsShowingNumButtons}
        />
        <NumButtons
          clickedIdx={clickedIdx}
          isShowing={isShowingNumButtons}
          gridRef={gridRef}
        />
      </div>
    </>
  );
};

export default PuzzleClient;
