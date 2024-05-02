'use client';

import { FormEvent, useState } from 'react';
import {
  getRowColBoxIdxs,
  isValidSudoku,
  updateDigits,
  updateValidDigits,
} from './utils/grid/helper';
import { CheckIcon } from '@heroicons/react/16/solid';
import SubmissionToast from './submissionToast';

const Grid = ({ puzzle }: { puzzle: string }) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);

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

  const onSubmit = () => {
    const isValid = isValidSudoku(digits);
    if (isValid) {
      setShowFailureToast(false);
      setShowSuccessToast(true);
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
      {showSuccessToast && <SubmissionToast isSuccess={true} />}
      {showFailureToast && <SubmissionToast isSuccess={false} />}
      <div className="flex h-full flex-col items-center justify-center space-y-5 text-xl md:p-10 lg:space-y-7 xl:p-5">
        <div
          className="grid aspect-square w-full grid-cols-9 grid-rows-9 lg:w-2/5 xl:w-1/2"
          onMouseLeave={onNoHover}
        >
          {initialDigits.map((digit, i) => {
            // booleans to determine grid cells' borders
            const isLastRow = i + 1 >= 72;
            const isLastCol = (i + 1) % 9 == 0;
            const isMultipleOf3InnerRow = i % 27 >= 18 && !isLastRow;
            const isMultipleof3InnerCol = (i + 1) % 3 == 0 && !isLastCol;
            const borderClasses = `border ${
              isMultipleOf3InnerRow ? 'border-b-[3px]' : ''
            } ${isMultipleof3InnerCol ? 'border-r-[3px]' : ''}`;
            const isDigitFromPuzzle = !isNaN(parseInt(digit));

            return isDigitFromPuzzle ? (
              <div
                key={i}
                tabIndex={i}
                className={`flex size-full items-center justify-center ${borderClasses} ${validDigits[i] ? 'text-sky-800/25' : 'text-red-500/50'} ${clickedIdx === i ? 'bg-sky-800/50' : isHighlightedArr[i] ? 'bg-sky-800/25' : ''}`}
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
                className={`flex items-center justify-center ${borderClasses} bg-inherit text-center ${validDigits[i] ? '' : 'text-red-500'} ${clickedIdx === i ? 'bg-sky-800/50' : isHighlightedArr[i] ? 'bg-sky-800/25' : ''}`}
                onInput={(e) => onDigitInput(i, e)}
                onMouseEnter={() => onHover(i)}
                onFocus={() => onFocus(i)}
                onBlur={onBlur}
              />
            );
          })}
        </div>
        <button disabled={emptyCellCount !== 0} onClick={() => onSubmit()}>
          <CheckIcon
            className={`mx-auto size-12 lg:size-10 ${emptyCellCount === 0 ? 'text-sky-800/100' : 'text-sky-800/25'}`}
          />
        </button>
      </div>
    </>
  );
};

export default Grid;
