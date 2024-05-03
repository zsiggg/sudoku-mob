import { Transition } from '@headlessui/react';
import { BoltIcon, CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { Toast } from 'flowbite-react';
import Link from 'next/link';

const SubmissionToast = ({
  isShowingSuccess,
  isShowingFailure,
  isShowingAddedToDb,
  onSuccessDismiss,
  onFailureDismiss,
  onAddedToDbDismiss,
}: {
  isShowingSuccess: boolean;
  isShowingFailure: boolean;
  isShowingAddedToDb?: boolean;
  onSuccessDismiss: () => void;
  onFailureDismiss: () => void;
  onAddedToDbDismiss?: () => void;
}) => {
  return (
    <>
      <Transition
        appear={true}
        show={!!isShowingAddedToDb}
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
      >
        <Toast
          className={`fixed left-1/2 top-5 w-max -translate-x-1/2 ${isShowingSuccess || isShowingFailure ? 'translate-y-16' : 'translate-y-0'} transform-gpu bg-white p-2 transition-transform duration-300 ease-out`}
        >
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
            <BoltIcon className="size-5" />
          </div>
          <div className="ml-2 mr-1 text-sm">
            Added new puzzle to the database!
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
      >
        <Toast className="fixed left-1/2 top-5 w-max -translate-x-1/2 bg-white p-2">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
            <CheckIcon className="size-5" />
          </div>
          <div className="ml-2 text-sm">You solved it!</div>
          <Link
            className="mx-1 rounded-lg p-1 text-sm font-medium text-cyan-600 hover:font-bold"
            href={'/puzzle/new'}
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
      >
        <Toast className="fixed left-1/2 top-5 w-max -translate-x-1/2 bg-white p-2">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
            <XMarkIcon className="size-5" />
          </div>
          <div className="mx-2 text-sm">Check the puzzle again</div>
          <Toast.Toggle onDismiss={onFailureDismiss} />
        </Toast>
      </Transition>
    </>
  );
};

export default SubmissionToast;
