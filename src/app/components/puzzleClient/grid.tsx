import {
  getRowColBoxIdxs,
  updateDigits,
  updateValidDigits,
} from '@/app/utils/puzzleClient/helper';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const Grid = ({
  puzzleId,
  puzzleRowNum,
  initialDigits,
  digits,
  setDigits,
  emptyCellCount,
  setEmptyCellCount,
}: {
  puzzleId?: string;
  puzzleRowNum?: number;
  initialDigits: string[];
  digits: string[];
  setDigits: Dispatch<SetStateAction<string[]>>;
  emptyCellCount: number;
  setEmptyCellCount: Dispatch<SetStateAction<number>>;
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1023px)' });

  const initialIsHighlightedArr = Array.from({ length: 81 }, () => false);
  const [isHighlightedArr, setIsHighlightedArr] = useState(
    initialIsHighlightedArr,
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [clickedIdx, setClickedIdx] = useState<number | null>(null);

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

  const onMobileTouch = (i: number) => {
    setClickedIdx(i);
    highlightRowColOfCell(i);
  };

  return (
    <>
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
              onMouseEnter={() => (!isMobile ? onHover(i) : undefined)}
              onTouchStart={() => onMobileTouch(i)}
              onTouchMove={(e) => {
                const i = document
                  .elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
                  ?.getAttribute('tabIndex');
                if (i !== null && i !== undefined) {
                  onMobileTouch(parseInt(i));
                }
              }}
              onFocus={() => (!isMobile ? onFocus(i) : undefined)}
              onBlur={!isMobile ? onBlur : undefined}
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
              onMouseEnter={() => (!isMobile ? onHover(i) : undefined)}
              onTouchStart={() => onMobileTouch(i)}
              onTouchMove={(e) => {
                const i = document
                  .elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
                  ?.getAttribute('tabIndex');
                if (i !== null && i !== undefined) {
                  onMobileTouch(parseInt(i));
                }
              }}
              onFocus={() => (!isMobile ? onFocus(i) : undefined)}
              onBlur={!isMobile ? onBlur : undefined}
            />
          );
        })}
      </div>
      <div className="flex w-full flex-wrap items-center justify-evenly lg:hidden">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            className="m-1 size-14 rounded-md bg-sky-100 text-sky-800 hover:bg-sky-200 hover:text-sky-900 md:mx-2"
            key={i + 1}
            onClick={() => {
              if (clickedIdx !== null) {
                const element = document.querySelector(
                  `input[tabindex="${clickedIdx}"]`,
                );
                if (element) {
                  element.value = (i + 1).toString();
                }
              }
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Grid;
