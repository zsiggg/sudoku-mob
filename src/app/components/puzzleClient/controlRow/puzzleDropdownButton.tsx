import { revalidateRootPath } from '@/app/utils/revalidation';
import { PlusIcon } from '@heroicons/react/16/solid';
import { Dropdown } from 'flowbite-react';
import Link from 'next/link';

const PuzzleDropdownButton = ({
  puzzleIds,
  puzzleId,
}: {
  puzzleIds: string[];
  puzzleId?: string;
}) => {
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
      {puzzleIds.map((id, i) => (
        <>
          {id !== puzzleId ? (
            <Dropdown.Item
              as={Link}
              href={`/puzzle/${id}`}
              key={id}
              className="w-56 p-4 hover:bg-sky-100"
            >
              Puzzle {i + 1}
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              as="button"
              key={id}
              disabled={true}
              className="w-56 bg-gray-100 p-4 opacity-50"
            >
              Puzzle {i + 1}
            </Dropdown.Item>
          )}
        </>
      ))}
    </Dropdown>
  );
};

export default PuzzleDropdownButton;
