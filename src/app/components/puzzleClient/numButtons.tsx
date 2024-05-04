import { Transition } from '@headlessui/react';
import { FormEvent, RefObject } from 'react';

const NumButtons = ({
  isShowing,
  clickedIdx,
  gridRef,
  onDigitInput,
}: {
  isShowing: boolean;
  clickedIdx: number | null;
  gridRef: RefObject<HTMLDivElement>;
  onDigitInput: (
    i: number,
    e?: FormEvent<HTMLInputElement>,
    value?: string,
  ) => void;
}) => {
  return (
    <Transition
      appear={true}
      show={isShowing}
      enter="transition-all transform-gpu duration-500 ease-out"
      enterFrom="-translate-y-8 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition-all transform-gpu duration-200 ease-out"
      leaveFrom="translate-y-0 opacity-75"
      leaveTo="-translate-y-8 opacity-0"
    >
      <div className="flex w-full flex-wrap items-center justify-evenly">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            className="m-1 size-14 rounded-md bg-sky-100 text-sky-800 hover:bg-sky-200 hover:text-sky-900 md:mx-2"
            key={i + 1}
            onClick={() => {
              if (clickedIdx !== null) {
                const inputElements =
                  gridRef.current?.getElementsByTagName('input');
                const targetInputElement = inputElements?.namedItem(
                  `grid-cell-${clickedIdx}`,
                );
                if (targetInputElement) {
                  const digitStr = (i + 1).toString();
                  targetInputElement.value = digitStr;
                  onDigitInput(clickedIdx, undefined, digitStr);
                }
              }
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </Transition>
  );
};

export default NumButtons;
