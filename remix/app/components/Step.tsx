import type { MouseEventHandler } from 'react';

interface StepProps {
  isActive: boolean;
  isCurrent: boolean; // To highlight the currently playing step
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function Step({ isActive, isCurrent, onClick }: StepProps) {
  const activeClasses = isActive
    ? 'bg-blue-500 hover:bg-blue-600'
    : 'bg-gray-300 hover:bg-gray-400';
  const currentStepClasses = isCurrent ? 'ring-2 ring-offset-1 ring-yellow-400' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 md:w-10 md:h-10 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${activeClasses} ${currentStepClasses}`}
      aria-pressed={isActive}
    />
  );
}
