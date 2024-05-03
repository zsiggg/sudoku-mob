'use client';

import { FormEvent, Suspense, useEffect, useRef, useState, JSX } from 'react';
import {
  getRowColBoxIdxs,
  isValidSudoku,
  updateDigits,
  updateValidDigits,
} from '../utils/gridClient/helper';
import { CheckIcon, PlusIcon } from '@heroicons/react/16/solid';
import SubmissionToast from './submissionToast';
import { Dropdown } from 'flowbite-react';
import {
  addPuzzle,
  checkIsPuzzleInDb,
  getPuzzleIds,
} from '../utils/supabase/puzzlesDb';
import Link from 'next/link';
import { revalidateRootPath } from '../utils/helper';

const GridClient = ({
  puzzle,
  puzzle_id,
}: {
  puzzle: string;
  puzzle_id?: string;
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
      if (puzzle_id === undefined) {
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

  const dropdownRef = useRef(new Promise<JSX.Element>(() => {}));
  useEffect(() => {
    dropdownRef.current = getPuzzleIds().then((arr) => (
      <>
        {arr.map((id, i) => (
          <>
            {id !== puzzle_id ? (
              <Dropdown.Item
                as={Link}
                href={`/puzzle/${id}`}
                key={id}
                className="w-56 p-4 hover:bg-sky-100"
              >
                Puzzle {i + 1}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                as="button"
                key={id}
                disabled={true}
                className="w-56 bg-gray-100 p-4 opacity-50"
              >
                Puzzle {i + 1}
              </Dropdown.Item>
            )}
          </>
        ))}
      </>
    ));
  }, [puzzle_id]);

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
        <div className="flex items-center justify-center gap-5">
          <Dropdown
            className="max-h-96 overflow-y-auto"
            placement="top"
            label=""
            renderTrigger={() => (
              <button>
                <PlusIcon className="size-12 text-sky-800 lg:size-10" />
              </button>
            )}
          >
            <Dropdown.Header className="p-4 font-bold">
              Choose a new puzzle
            </Dropdown.Header>
            <Dropdown.Item
              as={Link}
              href={`/puzzle/new`}
              onClick={() => revalidateRootPath()}
              className="w-56 p-4 hover:bg-sky-100"
            >
              New Puzzle
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              href={`/`}
              onClick={() => revalidateRootPath()}
              className="w-56 p-4 hover:bg-sky-100"
            >
              Random from database
            </Dropdown.Item>
            <Suspense
              fallback={
                <Dropdown.Item as="div" className="w-56 p-4">
                  <div className="flex gap-2">
                    <span>Loading more from database</span>
                    <svg
                      aria-hidden="true"
                      className="size-4 animate-spin fill-sky-800 text-sky-100"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                </Dropdown.Item>
              }
            >
              {dropdownRef.current}
            </Suspense>
          </Dropdown>

          <button disabled={emptyCellCount !== 0} onClick={() => onSubmit()}>
            <CheckIcon
              className={`mx-auto size-12 lg:size-10 ${emptyCellCount === 0 ? 'text-sky-800/100' : 'text-sky-800/25'}`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default GridClient;
