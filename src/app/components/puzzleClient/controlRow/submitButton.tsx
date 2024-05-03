import { CheckIcon } from '@heroicons/react/16/solid';

const SubmitButton = ({
  emptyCellCount,
  onSubmit,
}: {
  emptyCellCount: number;
  onSubmit: () => void;
}) => {
  return (
    <button disabled={emptyCellCount !== 0} onClick={() => onSubmit()}>
      <CheckIcon
        className={`mx-auto size-12 lg:size-10 ${emptyCellCount === 0 ? 'text-sky-800/100' : 'text-sky-800/25'}`}
      />
    </button>
  );
};

export default SubmitButton;
