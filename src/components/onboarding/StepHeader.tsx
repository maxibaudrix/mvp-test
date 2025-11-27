
// src/components/onboarding/StepHeader.tsx
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/Progress';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ currentStep, totalSteps, title, description }) => {
  const progressValue = (currentStep / totalSteps) * 100;
  
  return (
    <CardHeader className="p-6 pb-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-blue-400">Paso {currentStep} de {totalSteps}</p>
        <p className="text-sm text-slate-400">Progreso: {Math.round(progressValue)}%</p>
      </div>
      <Progress value={progressValue} className="mb-4 h-2" />
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};

export default StepHeader;
        