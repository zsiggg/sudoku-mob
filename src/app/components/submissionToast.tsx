import { Transition } from '@headlessui/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { Toast } from 'flowbite-react';
import Link from 'next/link';

const SubmissionToast = ({
  isShowingSuccess,
  isShowingFailure,
  onSuccessDismiss,
  onFailureDismiss,
}: {
  isShowingSuccess: boolean;
  isShowingFailure: boolean;
  onSuccessDismiss: () => void;
  onFailureDismiss: () => void;
}) => {
  return (
    <>
      <Transition
        appear={true}
        show={isShowingSuccess}
        enter="transition-transform transition-gpu duration-300 ease-out"
        enterFrom="-translate-y-20"
        enterTo="translate-y-0"
        leave="transition-transform transition-gpu duration-300 ease-out"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-20"
      >
        <Toast className="fixed left-1/2 top-0 w-max -translate-x-1/2 translate-y-5 bg-white p-2">
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
        enter="transition-transform transition-gpu duration-300 ease-out"
        enterFrom="-translate-y-20"
        enterTo="translate-y-0"
        leave="transition-transform transition-gpu duration-300 ease-out"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-20"
      >
        <Toast className="fixed left-1/2 top-0 w-max -translate-x-1/2 translate-y-5 bg-white p-2">
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
