import PuzzleDropdownButton from './puzzleDropdownButton';
import SubmitButton from './submitButton';

const ControlRow = ({
  puzzleIds,
  puzzleId,
  emptyCellCount,
  onSubmit,
}: {
  puzzleIds: string[];
  puzzleId?: string;
  emptyCellCount: number;
  onSubmit: () => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-5">
      <PuzzleDropdownButton puzzleIds={puzzleIds} puzzleId={puzzleId} />
      <SubmitButton emptyCellCount={emptyCellCount} onSubmit={onSubmit} />
    </div>
  );
};

export default ControlRow;
