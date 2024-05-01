'use client';

import { FormEvent, useState } from 'react';

const Grid = ({ puzzle }: { puzzle: string }) => {
  const initialDigits = puzzle.split('').map((str) => (str === '.' ? '' : str));
  const [digits, setDigits] = useState(initialDigits);
  // assume puzzle is valid (no duplicate digits in rows, cols, or boxes)
  const [validDigits, setValidDigits] = useState(
    Array.from({ length: digits.length }, () => true),
  );

  // update validDigits array after user input that adds or deletes the targetDigit
  const updateValidDigits = (
    indices: number[],
    validDigits: boolean[],
    targetDigit: string,
    digits: string[],
  ) => {
    // get indices where digits[i] === targetDigit
    const targetDigitIndices = indices.reduce((acc, idx) => {
      if (digits[idx] === targetDigit) {
        acc.push(idx);
      }
      return acc;
    }, new Array<number>());

    // if >1 occurrences of targetDigit, then the occurrences are not valid
    const isValid = targetDigitIndices.length <= 1;

    // update validDigits array
    targetDigitIndices.forEach((i) => {
      validDigits[i] = isValid;
    });

    return isValid;
  };

  // updates digits and validDigits arrays
  const updateDigits = (i: number, digit: string) => {
    const row = Math.floor(i / 9);
    const col = i % 9;
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    const targetDigit = digit === '' ? digits[i] : digit;

    // set digits
    const digitsCpy = [...digits];
    digitsCpy[i] = digit;
    setDigits(digitsCpy);

    // update validDigits by considering the row, col, and box of the digit
    const validDigitsCpy = [...validDigits];

    const rowIdxs = Array.from({ length: 9 }, (_, col) => row * 9 + col);
    const isValidInRow = updateValidDigits(
      rowIdxs,
      validDigitsCpy,
      targetDigit,
      digitsCpy,
    );

    const colIdxs = Array.from({ length: 9 }, (_, row) => row * 9 + col);
    const isValidInCol = updateValidDigits(
      colIdxs,
      validDigitsCpy,
      targetDigit,
      digitsCpy,
    );

    const boxIdxs = Array.from({ length: 9 }, (_, boxIdx) => {
      const currRow = Math.floor(box / 3) * 3 + Math.floor(boxIdx / 3);
      const currCol = (box % 3) * 3 + (boxIdx % 3);
      return currRow * 9 + currCol;
    });
    const isValidInBox = updateValidDigits(
      boxIdxs,
      validDigitsCpy,
      targetDigit,
      digitsCpy,
    );

    validDigitsCpy[i] =
      digit === '' ||
      (digit !== '' && isValidInRow && isValidInCol && isValidInBox);

    setValidDigits([...validDigitsCpy]);
  };

  const onDigitInput = (i: number, e: FormEvent<HTMLInputElement>) => {
    const digit = parseInt(e.currentTarget.value);

    if (e.currentTarget.value == '') {
      // store empty string if user backspaces
      updateDigits(i, '');
    } else if (e.currentTarget.value.length == 1 && digit >= 0 && digit <= 9) {
      // store valid digit
      updateDigits(i, digit.toString());
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
