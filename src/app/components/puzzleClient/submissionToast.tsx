import { revalidateRootPath } from '@/app/utils/revalidation';
import { Transition } from '@headlessui/react';
import { HiMiniBolt, HiCheck, HiTrophy, HiXMark } from 'react-icons/hi2';
import { Toast } from 'flowbite-react';
import Link from 'next/link';

const SubmissionToast = ({
  isShowingSuccess,
  isShowingFailure,
  isShowingAddedToDb,
  isShowingNewMinScore,
  onSuccessDismiss,
  onFailureDismiss,
  onAddedToDbDismiss,
  onNewMinScoreDismiss,
}: {
  isShowingSuccess: boolean;
  isShowingFailure: boolean;
  isShowingAddedToDb: boolean;
  isShowingNewMinScore: boolean;
  onSuccessDismiss: () => void;
  onFailureDismiss: () => void;
  onAddedToDbDismiss: () => void;
  onNewMinScoreDismiss: () => void;
}) => {
  return (
    <>
      <Transition
        appear={true}
        show={isShowingNewMinScore}
        enter="transition-transform transform-gpu duration-300 ease-out"
        enterFrom={
          isShowingSuccess || isShowingFailure
            ? '-translate-y-36'
            : '-translate-y-20'
        }
        enterTo="translate-y-0"
        leave="transition-transform transform-gpu duration-300 ease-out"
        leaveFrom="translate-y-0"
        leaveTo={
          isShowingSuccess || isShowingFailure
            ? '-translate-y-36'
            : '-translate-y-20'
        }
        className="fixed top-0 w-screen"
      >
        <Toast
          className={`fixed left-1/2 top-5 w-4/5 max-w-max -translate-x-1/2 ${isShowingSuccess || isShowingFailure ? 'translate-y-16' : 'translate-y-0'} transform-gpu bg-white p-2 transition-transform duration-300 ease-out`}
        >
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
            <HiTrophy className="size-5" />
          </div>
          <div className="ml-2 mr-1 text-sm">
            Congratulations! You beat the previous high score!
          </div>
          <Toast.Toggle onDismiss={onNewMinScoreDismiss} />
        </Toast>
      </Transition>
      <Transition
        appear={true}
        show={!isShowingNewMinScore && isShowingAddedToDb}
        enter="transition-transform transform-gpu duration-300 ease-out"
        enterFrom={
          isShowingSuccess || isShowingFailure
            ? '-translate-y-36'
            : '-translate-y-20'
        }
        enterTo="translate-y-0"
        leave="transition-transform transform-gpu duration-300 ease-out"
        leaveFrom="translate-y-0"
        leaveTo={
          isShowingSuccess || isShowingFailure
            ? '-translate-y-36'
            : '-translate-y-20'
        }
        className="fixed top-0 w-screen"
      >
        <Toast
          className={`fixed left-1/2 top-5 w-4/5 max-w-max -translate-x-1/2 ${isShowingSuccess || isShowingFailure ? 'translate-y-16' : 'translate-y-0'} transform-gpu bg-white p-2 transition-transform duration-300 ease-out`}
        >
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
            <HiMiniBolt className="size-5" />
          </div>
          <div className="ml-2 mr-1 text-sm">
            {
              "You're the first to solve this puzzle. It's been added to the database!"
            }
          </div>
          <Toast.Toggle onDismiss={onAddedToDbDismiss} />
        </Toast>
      </Transition>
      <Transition
        appear={true}
        show={isShowingSuccess}
        enter="transition-transform transform-gpu duration-300 ease-out"
        enterFrom="-translate-y-20"
        enterTo="translate-y-0"
        leave="transition-transform transform-gpu duration-300 ease-out"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-20"
        className="fixed top-0 w-screen"
      >
        <Toast className="fixed left-1/2 top-5 w-4/5 max-w-max -translate-x-1/2 bg-white p-2">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
            <HiCheck className="size-5" />
          </div>
          <div className="ml-2 text-sm">You solved it!</div>
          <Link
            className="mx-1 rounded-lg p-1 text-sm font-medium text-cyan-600 hover:font-bold"
            href={'/puzzle/new'}
            onClick={() => revalidateRootPath()}
          >
            New puzzle?
          </Link>
          <Toast.Toggle onDismiss={onSuccessDismiss} />
        </Toast>
      </Transition>
      <Transition
        appear={true}
        show={isShowingFailure}
        enter="transition-transform transform-gpu duration-300 ease-out"
        enterFrom="-translate-y-20"
        enterTo="translate-y-0"
        leave="transition-transform transform-gpu duration-300 ease-out"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-20"
        className="fixed top-0 w-screen"
      >
        <Toast className="fixed left-1/2 top-5 w-4/5 max-w-max -translate-x-1/2 bg-white p-2">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
            <HiXMark className="size-5" />
          </div>
          <div className="mx-2 text-sm">Check the puzzle again</div>
          <Toast.Toggle onDismiss={onFailureDismiss} />
        </Toast>
      </Transition>
    </>
  );
};

export default SubmissionToast;
