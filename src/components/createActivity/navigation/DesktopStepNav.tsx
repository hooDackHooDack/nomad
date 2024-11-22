import Image from 'next/image';
import Link from 'next/link';
import { Step } from '@/components/createActivity/layout/steps';

interface DesktopStepNavigationProps {
  steps: Step[];
  mode: 'create' | 'edit';
  activityId?: string;
  getStepStatus: (stepId: string) => string;
  getStepStyles: (status: string) => string;
}

export const DesktopStepNavigation = ({
  steps,
  mode,
  activityId,
  getStepStatus,
  getStepStyles,
}: DesktopStepNavigationProps) => {
  return (
    <nav className="flex flex-col gap-2">
      {steps.map((step) => {
        const status = getStepStatus(step.id);
        const textColorClass =
          status === 'completed'
            ? 'text-blue-DEFAULT'
            : status === 'current'
              ? 'text-yellow-DEFAULT'
              : 'text-gray-400';

        return (
          <Link
            key={step.id}
            href={`/activities/${mode}/${step.path}${
              mode === 'edit' ? `?id=${activityId}` : ''
            }`}
            className={getStepStyles(status)}
          >
            <span className="mr-3">
              <Image
                src={step.image}
                alt={step.title}
                width={20}
                height={20}
                className={textColorClass}
              />
            </span>
            <span className="flex-1">{step.title}</span>
            {status === 'completed' && (
              <span className="ml-3">
                <Image
                  src="/images/number/check.png"
                  alt="완료"
                  width={16}
                  height={16}
                />
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
