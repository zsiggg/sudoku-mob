'use client';

import { FormEvent, useState } from 'react';
import {
  isValidSudoku,
  updateDigits,
  updateValidDigits,
} from './utils/grid/helper';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { Toast } from 'flowbite-react';
import { usePathname } from 'next/navigation';

const Grid = ({ puzzle }: { puzzle: string }) => {
  const pathname = usePathname();

  const initialDigits = puzzle.split('').map((str) => (str === '.' ? '' : str));
  const initialEmptyCellCount = initialDigits.reduce(
    (count, digit) => (digit === '' ? count + 1 : count),
    0,
  );
  const [emptyCellCount, setEmptyCellCount] = useState(initialEmptyCellCount);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);

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

  return (
    <>
      {showSuccessToast && (
        <Toast className="fixed top-5 w-fit bg-white p-2">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <CheckIcon className="size-5" />
          </div>
          <div className="ml-2 text-sm">You solved it!</div>
          <a
            className="mx-1 rounded-lg p-1 text-sm font-medium text-cyan-600 hover:font-bold"
            href={pathname}
          >
            Restart?
          </a>
          <Toast.Toggle />
        </Toast>
      )}
      {showFailureToast && (
        <Toast className="fixed top-5 w-fit bg-white p-2">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <XMarkIcon className="size-5" />
          </div>
          <div className="mx-2 text-sm">Check the puzzle again</div>
          <Toast.Toggle />
        </Toast>
      )}
      <div className="flex flex-col items-center space-y-5 lg:space-y-8">
        <div className="grid aspect-square w-full grid-cols-9 grid-rows-9 lg:w-2/5">
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
                className={`flex items-center justify-center ${borderClasses} ${validDigits[i] ? 'text-gray-500' : 'text-red-500'}`}
              >
                {digits[i]}
              </div>
            ) : (
              <input
                type="text"
                key={i}
                max={9}
                min={0}
                step={1}
                className={`flex items-center justify-center ${borderClasses} bg-inherit text-center ${validDigits[i] ? 'text-white' : 'text-red-500'}`}
                onInput={(e) => {
                  onDigitInput(i, e);
                }}
              />
            );
          })}
        </div>
        <button disabled={emptyCellCount !== 0} onClick={() => onSubmit()}>
          <CheckIcon
            className={`mx-auto size-12 lg:size-10 ${emptyCellCount === 0 ? 'text-white' : 'text-gray-500'}`}
          />
        </button>
      </div>
    </>
  );
};

export default Grid;
