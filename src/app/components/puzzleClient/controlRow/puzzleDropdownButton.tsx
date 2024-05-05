import { revalidateRootPath } from '@/app/utils/revalidation';
import { PlusIcon } from '@heroicons/react/16/solid';
import { Dropdown } from 'flowbite-react';
import Link from 'next/link';

const PuzzleDropdownButton = ({
  puzzleIdsRowNumsMinMoves,
  puzzleId,
}: {
  puzzleIdsRowNumsMinMoves: {
    id: string;
    row_num: number;
    min_moves: number | null;
  }[];
  puzzleId?: string;
}) => {
  // sorts puzzleIdsRowNumsMinMoves by min_moves; if min_moves is null, then by row_num
  const comparePuzzleIdsRowNumsMinMoves = (
    a: { id: string; row_num: number; min_moves: number | null },
    b: { id: string; row_num: number; min_moves: number | null },
  ) => {
    if (a.min_moves === null && b.min_moves === null) {
      return a.row_num - b.row_num;
    } else if (a.min_moves === null) {
      return 1;
    } else if (b.min_moves === null) {
      return -1;
    } else {
      return a.min_moves - b.min_moves;
    }
  };

  return (
    <Dropdown
      className="max-h-96 overflow-y-auto"
      placement="top"
      label=""
      renderTrigger={() => (
        <button>
          <PlusIcon className="size-12 text-sky-800 lg:size-10" />
        </button>
      )}
    >
      <Dropdown.Header className="p-4 font-bold">
        Choose a new puzzle
      </Dropdown.Header>
      <Dropdown.Item
        as={Link}
        href={`/puzzle/new`}
        onClick={() => revalidateRootPath()}
        className="w-56 p-4 hover:bg-sky-100"
      >
        New Puzzle
      </Dropdown.Item>
      <Dropdown.Item
        as={Link}
        href={`/puzzle`}
        onClick={() => revalidateRootPath()}
        className="w-56 p-4 hover:bg-sky-100"
      >
        Random from database
      </Dropdown.Item>
      {puzzleIdsRowNumsMinMoves
        .sort(comparePuzzleIdsRowNumsMinMoves)
        .map(({ id, row_num, min_moves }) => (
          <>
            {id !== puzzleId ? (
              <Dropdown.Item
                as={Link}
                href={`/puzzle/${id}`}
                key={id}
                className="w-56 p-4 hover:bg-sky-100"
              >
                Puzzle {row_num}
                <span className="ml-2">{`(Target: ${min_moves ?? '-'})`}</span>
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                as="button"
                key={id}
                disabled={true}
                className="w-56 bg-gray-100 p-4 opacity-50"
              >
                Puzzle {row_num}
                <span className="ml-2">{`(Target: ${min_moves ?? '-'})`}</span>
              </Dropdown.Item>
            )}
          </>
        ))}
    </Dropdown>
  );
};

export default PuzzleDropdownButton;
