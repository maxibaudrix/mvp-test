// src/app/onboarding/step-2-goal/page.tsx
import OnboardingFormWrapper from '@/components/onboarding/OnboardingFormWrapper';
import Step2Goal from '@/components/onboarding/Step2Goal';

export default function Step2Page() {
  return (
    <OnboardingFormWrapper title="Paso 2: Meta y Actividad" step={2}>
      <Step2Goal />
    </OnboardingFormWrapper>
  );
}