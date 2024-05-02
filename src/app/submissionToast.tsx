import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { Toast } from 'flowbite-react';
import { usePathname } from 'next/navigation';

const SubmissionToast = ({ isSuccess }: { isSuccess: boolean }) => {
  const pathname = usePathname();

  return (
    <>
      {isSuccess ? (
        <Toast className="fixed top-5 w-fit bg-white p-2">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
            <CheckIcon className="size-5" />
          </div>
          <div className="ml-2 text-sm">You solved it!</div>
          <a
            className="mx-1 rounded-lg p-1 text-sm font-medium text-cyan-600 hover:font-bold"
            href={pathname}
          >
            Restart?
          </a>
          <Toast.Toggle />
        </Toast>
      ) : (
        <Toast className="fixed top-5 w-fit bg-white p-2">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
            <XMarkIcon className="size-5" />
          </div>
          <div className="mx-2 text-sm">Check the puzzle again</div>
          <Toast.Toggle />
        </Toast>
      )}
    </>
  );
};

export default SubmissionToast;
