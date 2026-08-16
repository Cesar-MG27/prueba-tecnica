import { StatusStep } from '@/components/details/StatusStep/StatusStep';
import type { StatusStepItem } from '@/types/order';
import styles from './StatusStepper.module.css';

interface StatusStepperProps {
  steps: StatusStepItem[];
}

export function StatusStepper({ steps }: StatusStepperProps) {
  return (
    <ol className={styles.stepper}>
      {steps.map((step, index) => (
        <StatusStep
          key={step.label}
          label={step.label}
          active={step.active}
          isLast={index === steps.length - 1}
        />
      ))}
    </ol>
  );
}
