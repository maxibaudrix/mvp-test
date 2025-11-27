
// src/components/onboarding/StepButtons.tsx
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import Link from 'next/link';

interface StepButtonsProps {
  currentStep: number;
  nextPath: string;
  prevPath: string;
  isSubmitting: boolean;
  onNext: () => void;
  isLastStep: boolean;
}

const StepButtons: React.FC<StepButtonsProps> = ({
  currentStep,
  nextPath,
  prevPath,
  isSubmitting,
  onNext,
  isLastStep,
}) => {
  return (
    <CardFooter className="pt-6 justify-between">
      {currentStep > 1 ? (
        <Link href={prevPath} passHref>
          <Button variant="outline" type="button" disabled={isSubmitting}>
            &larr; Anterior
          </Button>
        </Link>
      ) : (
        <div /> // Placeholder para mantener el espacio
      )}

      <Button
        type="submit" // Siempre es un submit si está dentro de un <form>
        onClick={onNext}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {isLastStep ? 'Finalizar' : 'Siguiente &rarr;'}
      </Button>
    </CardFooter>
  );
};

export default StepButtons;
        