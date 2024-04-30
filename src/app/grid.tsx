'use client';

import { FormEvent } from 'react';

const Grid = () => {
  const puzzle =
    '52...6.........7.13...........4..8..6......5...........418.........3..2...87.....';
  const digits = puzzle.split('').map((str) => (str === '.' ? '' : str));

  const onDigitInput = (i: number, e: FormEvent<HTMLInputElement>) => {
    const digit = parseInt(e.currentTarget.value);

    // reset the input to previous value if it is not empty or a digit
    if (
      e.currentTarget.value != '' &&
      (isNaN(digit) || digit < 0 || digit > 9 || digit % 1 != 0)
    ) {
      e.currentTarget.value = digits[i];
      return;
    }

    // store the new digit
    digits[i] = digit.toString();
  };

  return (
    <div className="w-1/2 grid grid-cols-9 grid-rows-9 aspect-square">
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
            className={`flex justify-center items-center ${borderClasses} text-gray-500`}
          >
            {digits[i]}
          </div>
        ) : (
          <input
            type="text"
            max={9}
            min={0}
            step={1}
            className={`flex justify-center items-center ${borderClasses} bg-inherit text-center`}
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
