import { Dispatch, SetStateAction } from 'react';

// updates digits and validDigits arrays
export const updateDigits = (
  i: number,
  digit: string,
  digits: string[],
  setDigits: Dispatch<SetStateAction<string[]>>,
) => {
  // set digits
  const digitsCpy = [...digits];
  digitsCpy[i] = digit;
  setDigits(digitsCpy);

  return digitsCpy;
};

export const updateValidDigits = (
  i: number,
  digit: string,
  prevDigit: string,
  validDigits: boolean[],
  setValidDigits: Dispatch<SetStateAction<boolean[]>>,
  digits: string[],
) => {
  const row = Math.floor(i / 9);
  const col = i % 9;
  const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
  const targetDigit = digit === '' ? prevDigit : digit;

  // update validDigits of the row, col, and box of the digit
  const validDigitsCpy = [...validDigits];

  const rowIdxs = Array.from({ length: 9 }, (_, col) => row * 9 + col);
  const isValidInRow = updateValidDigitsOfIndices(
    rowIdxs,
    validDigitsCpy,
    targetDigit,
    digits,
  );

  const colIdxs = Array.from({ length: 9 }, (_, row) => row * 9 + col);
  const isValidInCol = updateValidDigitsOfIndices(
    colIdxs,
    validDigitsCpy,
    targetDigit,
    digits,
  );

  const boxIdxs = Array.from({ length: 9 }, (_, boxIdx) => {
    const currRow = Math.floor(box / 3) * 3 + Math.floor(boxIdx / 3);
    const currCol = (box % 3) * 3 + (boxIdx % 3);
    return currRow * 9 + currCol;
  });
  const isValidInBox = updateValidDigitsOfIndices(
    boxIdxs,
    validDigitsCpy,
    targetDigit,
    digits,
  );

  validDigitsCpy[i] =
    digit === '' ||
    (digit !== '' && isValidInRow && isValidInCol && isValidInBox);

  console.log('validdigitscpy in helper file', validDigitsCpy);
  setValidDigits([...validDigitsCpy]);
};

// update validDigits array of row, col or box indices
const updateValidDigitsOfIndices = (
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
