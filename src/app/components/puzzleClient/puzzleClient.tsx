'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  isValidSudoku,
  updateDigits,
  updateValidDigits,
} from '../../utils/puzzleClient/helper';
import SubmissionToast from './submissionToast';
import {
  addPuzzleAndMinMoves,
  getPuzzleId,
  updateMinMoves,
} from '../../utils/supabase/puzzlesDb';
import ControlRow from './controlRow';
import Grid from './grid';
import { useMediaQuery } from 'react-responsive';
import NumButtons from './numButtons';

const PuzzleClient = ({
  puzzle,
  puzzleIdsAndRowNums,
  puzzleId,
  puzzleRowNum,
  targetMoves,
}: {
  puzzle: string;
  puzzleIdsAndRowNums: { id: string; row_num: number }[];
  puzzleId?: string;
  puzzleRowNum?: number;
  targetMoves: number | null;
}) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [showAddedToDbToast, setShowAddedToDbToast] = useState(false);
  const [showNewMinScoreToast, setShowNewMinScoreToast] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 1023px)' });
  const [isShowingNumButtons, setIsShowingNumButtons] = useState(false);

  const initialDigits = puzzle.split('').map((str) => (str === '.' ? '' : str));
  const initialEmptyCellCount = initialDigits.reduce(
    (count, digit) => (digit === '' ? count + 1 : count),
    0,
  );
  const [emptyCellCount, setEmptyCellCount] = useState(initialEmptyCellCount);
  const [digits, setDigits] = useState(initialDigits);

  // assume puzzle is valid (no duplicate digits in rows, cols, or boxes)
  const [validDigits, setValidDigits] = useState(
    Array.from({ length: digits.length }, () => true),
  );

  const [clickedIdx, setClickedIdx] = useState<number | null>(null);

  const [moveCount, setMoveCount] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);

  const onSubmit = async () => {
    const isValid = isValidSudoku(digits);
    if (isValid) {
      setShowFailureToast(false);
      setShowSuccessToast(true);
      if (puzzleId === undefined) {
        // check if puzzle is in db
        const dbPuzzleId = await getPuzzleId(puzzle);
        if (dbPuzzleId === undefined) {
          await addPuzzleAndMinMoves(puzzle, moveCount);
          setShowAddedToDbToast(true);
        } else {
          const isUpdated = await updateMinMoves(dbPuzzleId, moveCount);
          if (isUpdated) {
            setShowNewMinScoreToast(true);
          }
        }
      } else {
        const isUpdated = await updateMinMoves(puzzleId, moveCount);
        if (isUpdated) {
          setShowNewMinScoreToast(true);
        }
      }
    } else {
      setShowFailureToast(true);
      setTimeout(() => setShowFailureToast(false), 5000);
      setShowSuccessToast(false);
    }
  };

  const onDigitInput = (
    i: number,
    e?: FormEvent<HTMLInputElement>,
    value?: string,
  ) => {
    const digitStr = e?.currentTarget.value ?? value ?? '';
    const digit = parseInt(digitStr);
    const prevDigit = digits[i];

    if (digitStr == '') {
      // store empty string if user backspaces
      const newDigits = updateDigits(i, '', digits, setDigits);
      updateValidDigits(
        i,
        '',
        prevDigit,
        validDigits,
        setValidDigits,
        newDigits,
      );

      setEmptyCellCount(emptyCellCount + 1);
    } else if (digitStr.length == 1 && digit >= 1 && digit <= 9) {
      // store valid digit
      const newDigits = updateDigits(i, digit.toString(), digits, setDigits);
      updateValidDigits(
        i,
        digit.toString(),
        prevDigit,
        validDigits,
        setValidDigits,
        newDigits,
      );

      setMoveCount(moveCount + 1);

      // if cell was previously empty before valid digit was input
      if (prevDigit === '') {
        setEmptyCellCount(emptyCellCount - 1);
      }
    } else {
      // don't change input if other characters are input
      if (e) {
        e.currentTarget.value = digits[i];
      }
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
        isShowingNewMinScore={showNewMinScoreToast}
        onSuccessDismiss={() => setShowSuccessToast(false)}
        onFailureDismiss={() => setShowFailureToast(false)}
        onAddedToDbDismiss={() => setShowAddedToDbToast(false)}
        onNewMinScoreDismiss={() => setShowNewMinScoreToast(false)}
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
          onDigitInput={onDigitInput}
          validDigits={validDigits}
          moveCount={moveCount}
        />
        <ControlRow
          puzzleIdsAndRowNums={puzzleIdsAndRowNums}
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
          onDigitInput={onDigitInput}
        />
      </div>
    </>
  );
};

export default PuzzleClient;
