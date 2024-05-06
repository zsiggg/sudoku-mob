import { revalidateRootPath } from '@/app/utils/revalidation';
import { Dropdown } from 'flowbite-react';
import Link from 'next/link';
import { HiListBullet } from 'react-icons/hi2';

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
  return (
    <Dropdown
      className="max-h-96 overflow-y-auto"
      placement="top"
      label=""
      renderTrigger={() => (
        <button>
          <HiListBullet className="size-12 text-sky-800 lg:size-10" />
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
        .sort((a, b) => a.row_num - b.row_num)
        .map(({ id, row_num, min_moves }) => (
          <>
            {id !== puzzleId ? (
              <Dropdown.Item
                as={Link}
                href={`/puzzle/${id}`}
                key={id}
                className="w-56 p-4 hover:bg-sky-100"
              >
                <span>Puzzle {row_num}</span>
                <span className="ml-2">{`(Target: ${min_moves ?? '-'})`}</span>
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                as="button"
                key={id}
                disabled={true}
                className="w-56 bg-gray-100 p-4 opacity-50"
              >
                <span>Puzzle {row_num}</span>
                <span className="ml-2">{`(Target: ${min_moves ?? '-'})`}</span>
              </Dropdown.Item>
            )}
          </>
        ))}
    </Dropdown>
  );
};

export default PuzzleDropdownButton;
