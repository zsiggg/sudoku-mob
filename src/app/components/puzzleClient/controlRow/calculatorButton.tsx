import { CalculatorIcon } from '@heroicons/react/16/solid';
import { Dispatch, SetStateAction } from 'react';

const CalculatorButton = ({
  isShowingNumButtons,
  setIsShowingNumButtons,
}: {
  isShowingNumButtons: boolean;
  setIsShowingNumButtons: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <button onClick={() => setIsShowingNumButtons(!isShowingNumButtons)}>
      <CalculatorIcon
        className={`mx-auto size-14  text-sky-800 lg:size-12 ${isShowingNumButtons ? 'bg-sky-100' : ''} rounded-lg p-2 transition-colors hover:text-sky-800`}
      />
    </button>
  );
};

export default CalculatorButton;
