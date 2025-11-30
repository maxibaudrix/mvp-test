// src/app/onboarding/step-3-diet/page.tsx
import OnboardingFormWrapper from '@/components/onboarding/OnboardingFormWrapper';
import Step3Diet from '@/components/onboarding/Step3Diet';

export default function Step3Page() {
  return (
    <OnboardingFormWrapper title="Paso 3: Dieta y Restricciones" step={3}>
      <Step3Diet />
    </OnboardingFormWrapper>
  );
}