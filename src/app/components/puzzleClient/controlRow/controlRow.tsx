import { Dispatch, SetStateAction } from 'react';
import CalculatorButton from './calculatorButton';
import PuzzleDropdownButton from './puzzleDropdownButton';
import SubmitButton from './submitButton';

const ControlRow = ({
  puzzleIds,
  puzzleId,
  emptyCellCount,
  onSubmit,
  isShowingNumButtons,
  setIsShowingNumButtons,
}: {
  puzzleIds: string[];
  puzzleId?: string;
  emptyCellCount: number;
  onSubmit: () => void;
  isShowingNumButtons: boolean;
  setIsShowingNumButtons: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center justify-center gap-5">
      <PuzzleDropdownButton puzzleIds={puzzleIds} puzzleId={puzzleId} />
      <CalculatorButton
        isShowingNumButtons={isShowingNumButtons}
        setIsShowingNumButtons={setIsShowingNumButtons}
      />
      <SubmitButton emptyCellCount={emptyCellCount} onSubmit={onSubmit} />
    </div>
  );
};

export default ControlRow;
