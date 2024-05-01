'use client';

import { FormEvent, useState } from 'react';
import { updateDigits, updateValidDigits } from './utils/grid/helper';

const Grid = ({ puzzle }: { puzzle: string }) => {
  const initialDigits = puzzle.split('').map((str) => (str === '.' ? '' : str));
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
    } else if (e.currentTarget.value.length == 1 && digit >= 0 && digit <= 9) {
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
    } else {
      // don't change input if other characters are input
      e.currentTarget.value = digits[i];
    }
  };

  return (
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
  );
};

export default Grid;
