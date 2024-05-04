import {
  getRowColBoxIdxs,
  updateDigits,
  updateValidDigits,
} from '@/app/utils/puzzleClient/helper';
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

const Grid = ({
  gridRef,
  puzzleId,
  puzzleRowNum,
  initialDigits,
  digits,
  setDigits,
  emptyCellCount,
  setEmptyCellCount,
  clickedIdx,
  setClickedIdx,
  isMobile,
  isShowingNumButtons,
}: {
  gridRef: RefObject<HTMLDivElement>;
  puzzleId?: string;
  puzzleRowNum?: number;
  initialDigits: string[];
  digits: string[];
  setDigits: Dispatch<SetStateAction<string[]>>;
  emptyCellCount: number;
  setEmptyCellCount: Dispatch<SetStateAction<number>>;
  clickedIdx: number | null;
  setClickedIdx: Dispatch<SetStateAction<number | null>>;
  isMobile: boolean;
  isShowingNumButtons: boolean;
}) => {
  const initialIsHighlightedArr = Array.from({ length: 81 }, () => false);
  const [isHighlightedArr, setIsHighlightedArr] = useState(
    initialIsHighlightedArr,
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // assume puzzle is valid (no duplicate digits in rows, cols, or boxes)
  const [validDigits, setValidDigits] = useState(
    Array.from({ length: digits.length }, () => true),
  );

  // keep track of previous values of isShowingNumButtons, so that we can determine when it changes in useEffect
  const [prevIsShowingNumButtons, setPrevIsShowingNumButtons] =
    useState(isShowingNumButtons);

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

  const unhighlightAllCells = useCallback(() => {
    setIsHighlightedArr(initialIsHighlightedArr);
  }, [initialIsHighlightedArr]);

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

  const onMobileBlur = () => {
    setClickedIdx(null);
    unhighlightAllCells();
  };

  useEffect(() => {
    if (prevIsShowingNumButtons !== isShowingNumButtons) {
      if (!isShowingNumButtons) {
        setClickedIdx(null);
        unhighlightAllCells();
      }
      setPrevIsShowingNumButtons(isShowingNumButtons);
    }
  }, [
    isShowingNumButtons,
    prevIsShowingNumButtons,
    setClickedIdx,
    unhighlightAllCells,
    setPrevIsShowingNumButtons,
  ]);

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
        ref={gridRef}
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
              onTouchStart={() => onFocus(i)}
              onTouchMove={(e) => {
                const i = document
                  .elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
                  ?.getAttribute('tabIndex');
                if (i !== null && i !== undefined) {
                  onFocus(parseInt(i));
                }
              }}
              onFocus={() => onFocus(i)}
              onBlur={
                isMobile && isShowingNumButtons
                  ? undefined
                  : isMobile
                    ? onMobileBlur
                    : onBlur
              }
            >
              {digits[i]}
            </div>
          ) : (
            <input
              type="text"
              id={`grid-cell-${i}`} // to select correct <input> in numButtons.tsx
              key={i}
              tabIndex={i}
              max={9}
              min={0}
              step={1}
              className={`flex items-center justify-center caret-transparent ${borderClasses} bg-inherit text-center ${validDigits[i] ? '' : 'text-red-600'} ${clickedIdx === i ? 'bg-sky-800/50' : isHighlightedArr[i] ? 'bg-sky-800/25' : ''}`}
              onInput={(e) => onDigitInput(i, e)}
              onMouseEnter={() => onHover(i)}
              onTouchStart={() => onFocus(i)}
              onTouchMove={(e) => {
                const i = document
                  .elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
                  ?.getAttribute('tabIndex');
                if (i !== null && i !== undefined) {
                  onFocus(parseInt(i));
                }
              }}
              onFocus={() => onFocus(i)}
              onBlur={
                isShowingNumButtons
                  ? undefined
                  : isMobile
                    ? onMobileBlur
                    : onBlur
              }
              readOnly={isMobile && isShowingNumButtons}
            />
          );
        })}
      </div>
    </>
  );
};

export default Grid;
