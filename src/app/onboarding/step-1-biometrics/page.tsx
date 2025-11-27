// src/app/onboarding/step-1-biometrics/page.tsx
import OnboardingFormWrapper from '@/components/onboarding/OnboardingFormWrapper';
import Step1Biometrics from '@/components/onboarding/Step1Biometrics';

export default function Step1Page() {
  return (
    <OnboardingFormWrapper title="Paso 1: Biometría" step={1}>
      <Step1Biometrics />
    </OnboardingFormWrapper>
  );
}