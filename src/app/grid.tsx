'use client';

import { FormEvent } from 'react';

const Grid = ({ puzzle }: { puzzle: string }) => {
  const digits = puzzle.split('').map((str) => (str === '.' ? '' : str));

  const onDigitInput = (i: number, e: FormEvent<HTMLInputElement>) => {
    const digit = parseInt(e.currentTarget.value);

    if (e.currentTarget.value == '') {
      // store empty string if user backspaces
      digits[i] = '';
    } else if (e.currentTarget.value.length == 1 && digit >= 0 && digit <= 9) {
      // store valid digit
      digits[i] = digit.toString();
    } else {
      // don't change input if other characters are input
      e.currentTarget.value = digits[i];
    }
  };

  return (
    <div className="grid aspect-square w-full grid-cols-9 grid-rows-9 lg:w-2/5">
      {digits.map((digit, i) => {
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
            className={`flex items-center justify-center ${borderClasses} text-gray-500`}
          >
            {digits[i]}
          </div>
        ) : (
          <input
            type="text"
            max={9}
            min={0}
            step={1}
            className={`flex items-center justify-center ${borderClasses} bg-inherit text-center`}
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
