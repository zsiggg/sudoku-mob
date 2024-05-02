import { Dispatch, SetStateAction } from 'react';

// updates digits and validDigits arrays
export const updateDigits = (
  i: number,
  digit: string,
  digits: string[],
  setDigits: Dispatch<SetStateAction<string[]>>,
): string[] => {
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
): boolean[] => {
  // if user changed digit directly without backspacing, handle as backspace, then input new digit
  if (prevDigit !== '' && digit !== '') {
    validDigits = updateValidDigits(
      i,
      '',
      prevDigit,
      validDigits,
      setValidDigits,
      digits,
    );
    return updateValidDigits(i, digit, '', validDigits, setValidDigits, digits);
  }

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

  return validDigitsCpy;
};

// update validDigits array of row, col or box indices
// returns whether all targetDigits at the indices are valid
const updateValidDigitsOfIndices = (
  indices: number[],
  validDigits: boolean[],
  targetDigit: string,
  digits: string[],
): boolean => {
  // get indices where digits[i] === targetDigit
  const targetDigitIndices = indices.reduce((acc, idx) => {
    if (digits[idx] === targetDigit) {
      acc.push(idx);
    }
    return acc;
  }, new Array<number>());

  if (targetDigitIndices.length > 1) {
    // if >1 occurrence of targetDigit, then not valid
    targetDigitIndices.forEach((i) => {
      validDigits[i] = false;
    });
    return false;
  } else if (targetDigitIndices.length === 1) {
    // if only 1 occurrence of targetDigit, valid if no other digits in its own row, col, box
    const i = targetDigitIndices[0];
    const isPreviouslyValid = validDigits[i];
    if (isPreviouslyValid) {
      // if previously valid, must be that targetDigit did not exist in its own row, col, box
      validDigits[i] = true;
      return true;
    } else {
      // if previously not valid, check if targetDigit exists in its own row, col, box

      const row = Math.floor(i / 9);
      const col = i % 9;
      const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      const rowIdxs = Array.from({ length: 9 }, (_, col) => row * 9 + col);
      const colIdxs = Array.from({ length: 9 }, (_, row) => row * 9 + col);
      const boxIdxs = Array.from({ length: 9 }, (_, boxIdx) => {
        const currRow = Math.floor(box / 3) * 3 + Math.floor(boxIdx / 3);
        const currCol = (box % 3) * 3 + (boxIdx % 3);
        return currRow * 9 + currCol;
      });

      const idxs = Array.from(new Set(rowIdxs.concat(colIdxs).concat(boxIdxs))); // unique indices
      const targetDigitCount = idxs.reduce(
        (count, idx) => (digits[idx] === targetDigit ? count + 1 : count),
        0,
      );

      if (targetDigitCount > 1) {
        validDigits[i] = false;
        return false;
      } else {
        validDigits[i] = true;
        return true;
      }
    }
  } else {
    // if no occurrence of targetDigit, then by default it is valid
    return true;
  }
};

export const isValidSudoku = (digits: string[]) => {
  const set = new Set();

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const value = digits[i * 9 + j];

      if (value === '') {
        return false;
      } else {
        const rowStr = `r, ${i}, ${value}`;
        const colStr = `c, ${j}, ${value}`;
        const boxStr = `b, ${Math.floor(i / 3) * 3 + Math.floor(j / 3)}, ${value}`;

        if (set.has(rowStr) || set.has(colStr) || set.has(boxStr)) {
          return false;
        } else {
          set.add(rowStr);
          set.add(colStr);
          set.add(boxStr);
        }
      }
    }
  }

  return true;
};
