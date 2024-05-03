'use client';

import { FormEvent, useState } from 'react';
import {
  getRowColBoxIdxs,
  isValidSudoku,
  updateDigits,
  updateValidDigits,
} from '../utils/gridClient/helper';
import SubmissionToast from './submissionToast';
import { addPuzzle, checkIsPuzzleInDb } from '../utils/supabase/puzzlesDb';
import GridClientControlRow from './gridClientControlRow';

const GridClient = ({
  puzzle,
  puzzleIds,
  puzzleId,
  puzzleRowNum,
}: {
  puzzle: string;
  puzzleIds: string[];
  puzzleId?: string;
  puzzleRowNum?: number;
}) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [showAddedToDbToast, setShowAddedToDbToast] = useState(false);

  const initialIsHighlightedArr = Array.from({ length: 81 }, () => false);
  const [isHighlightedArr, setIsHighlightedArr] = useState(
    initialIsHighlightedArr,
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [clickedIdx, setClickedIdx] = useState<number | null>(null);

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

  const onDigitInput = (i: number, e: FormEvent<HTMLInputElement>) => {
    const digit = parseInt(e.currentTarget.value);
    const prevDigit = digits[i];

    if (e.currentTarget.value == '') {
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
    } else if (e.currentTarget.value.length == 1 && digit >= 1 && digit <= 9) {
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

      // if new digit was input
      if (prevDigit === '') {
        setEmptyCellCount(emptyCellCount - 1);
      }
    } else {
      // don't change input if other characters are input
      e.currentTarget.value = digits[i];
    }
  };

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

  const highlightRowColOfCell = (i: number) => {
    const rowColBoxIdxs = getRowColBoxIdxs(i);
    const toBeHighlightedIdxs = rowColBoxIdxs.row.concat(rowColBoxIdxs.col);
    const toBeHighlightedIdxsSet = new Set(toBeHighlightedIdxs);
    const newIsHighlightedArr = isHighlightedArr.map((_, i) =>
      toBeHighlightedIdxsSet.has(i) ? true : false,
    );
    setIsHighlightedArr(newIsHighlightedArr);
  };

  const unhighlightAllCells = () => {
    setIsHighlightedArr(initialIsHighlightedArr);
  };

  const onHover = (i: number) => {
    setHoveredIdx(i);
    if (clickedIdx === null) {
      highlightRowColOfCell(i);
    }
  };

  const onNoHover = () => {
    setHoveredIdx(null);
    if (clickedIdx === null) {
      unhighlightAllCells();
    }
  };

  const onFocus = (i: number) => {
    setClickedIdx(i);
    highlightRowColOfCell(i);
  };

  const onBlur = () => {
    setClickedIdx(null);
    if (hoveredIdx === null) {
      unhighlightAllCells();
    } else {
      highlightRowColOfCell(hoveredIdx);
    }
  };

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
        <div className="text-center text-3xl text-sky-800">
          {puzzleId === undefined ? (
            <p>New Puzzle</p>
          ) : puzzleRowNum === undefined ? (
            <div className="ml-1 h-10 w-44 animate-pulse rounded-lg bg-sky-100"></div>
          ) : (
            <p>{`Puzzle ${puzzleRowNum}`}</p>
          )}
        </div>
        <div
          className="grid aspect-square w-full grid-cols-9 grid-rows-9 border-2 border-sky-950 lg:w-2/5 xl:w-1/2"
          onMouseLeave={onNoHover}
        >
          {initialDigits.map((digit, i) => {
            // booleans to determine grid cells' borders
            const isLastRow = i + 1 >= 72;
            const isLastCol = (i + 1) % 9 == 0;
            const isMultipleOf3InnerRow = i % 27 >= 18 && !isLastRow;
            const isMultipleof3InnerCol = (i + 1) % 3 == 0 && !isLastCol;
            const borderClasses = `border-[0.5px] border-sky-800 border-opacity-60 ${
              isMultipleOf3InnerRow ? 'border-b-[2px]' : ''
            } ${isMultipleof3InnerCol ? 'border-r-[2px]' : ''}`;
            const isDigitFromPuzzle = !isNaN(parseInt(digit));

            return isDigitFromPuzzle ? (
              <div
                key={i}
                tabIndex={i}
                className={`flex size-full items-center justify-center ${borderClasses} ${validDigits[i] ? 'text-sky-800/50' : 'text-red-600/50'} ${clickedIdx === i ? 'bg-sky-800/50' : isHighlightedArr[i] ? 'bg-sky-800/25' : ''}`}
                onMouseEnter={() => onHover(i)}
                onFocus={() => onFocus(i)}
                onBlur={onBlur}
              >
                {digits[i]}
              </div>
            ) : (
              <input
                type="text"
                key={i}
                tabIndex={i}
                max={9}
                min={0}
                step={1}
                className={`flex items-center justify-center ${borderClasses} bg-inherit text-center ${validDigits[i] ? '' : 'text-red-600'} ${clickedIdx === i ? 'bg-sky-800/50' : isHighlightedArr[i] ? 'bg-sky-800/25' : ''}`}
                onInput={(e) => onDigitInput(i, e)}
                onMouseEnter={() => onHover(i)}
                onFocus={() => onFocus(i)}
                onBlur={onBlur}
              />
            );
          })}
        </div>
        <GridClientControlRow
          puzzleIds={puzzleIds}
          puzzleId={puzzleId}
          emptyCellCount={emptyCellCount}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
};

export default GridClient;
