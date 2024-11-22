import Image from 'next/image';
import Link from 'next/link';
import { Step } from '../layout/steps';


interface MobileStepNavigationProps {
  steps: Step[];
  mode: 'create' | 'edit';
  activityId?: string;
  getStepStatus: (stepId: string) => string;
}

export const MobileStepNavigation = ({
  steps,
  mode,
  activityId,
  getStepStatus,
}: MobileStepNavigationProps) => {
  return (
    <nav className="sm:flex sm:items-center sm:justify-center sm:gap-2 sm:mb-6 md:hidden lg:hidden relative">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            <Link
              href={`/activities/${mode}/${step.path}${
                mode === 'edit' ? `?id=${activityId}` : ''
              }`}
              className="relative"
            >
              <div
                className={`
                rounded-full p-1
                ${
                  status === 'current'
                    ? 'border-2 border-green-dark'
                    : 'border-none'
                }
              `}
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  width={28}
                  height={28}
                  className={
                    status === 'completed'
                      ? 'text-blue-DEFAULT'
                      : status === 'current'
                        ? 'text-yellow-DEFAULT'
                        : 'text-gray-400'
                  }
                />
              </div>
              {status === 'completed' && (
                <div className="absolute -bottom-1 -right-1">
                  <Image
                    src="/images/number/check.png"
                    alt="완료"
                    width={12}
                    height={12}
                  />
                </div>
              )}
            </Link>

            {!isLast && (
              <div className="flex items-center mx-1">
                <div className="w-1 h-1 rounded-full bg-gray-300 mx-0.5"></div>
                <div className="w-1 h-1 rounded-full bg-gray-300 mx-0.5"></div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
