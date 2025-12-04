// src/app/api/onboarding/complete/route.ts
import { NextResponse } from "next/server";
// ✅ Correcto
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1) Validar usuario autenticado
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión nuevamente." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // 2) Obtener datos enviados desde Step 6
    const body = await req.json();
    const {
      biometrics,
      goal,
      activity,
      training,
      diet,
      calculatedMacros,
    } = body;

    // 3) VALIDACIONES SIMPLES (opcional, más seguridad)
    if (!biometrics || !goal || !activity || !training || !diet || !calculatedMacros) {
      return NextResponse.json(
        { error: "Faltan datos del onboarding." },
        { status: 400 }
      );
    }

    // 4) GUARDAR / ACTUALIZAR USER PROFILE (Biometrics + Activity + Training)
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        // Biometrics
        age: biometrics.age,
        gender: biometrics.gender,
        heightCm: biometrics.height,
        currentWeight: biometrics.weight,
        bodyFatPercentage: biometrics.bodyFatPercentage ?? null,

        // Activity (step 3)
        activityLevel: activity.activityLevel,
        dailySteps: activity.dailySteps ?? null,
        sittingHours: activity.sittingHours ?? null,
        workType: activity.workType ?? null,

        // Training (step 4)
        trainingLevel: training.trainingLevel,
        trainingTypes: JSON.stringify(training.trainingTypes ?? []),
        sessionDuration: training.sessionDuration ?? null,
        intensity: training.intensity ?? null,
        workoutDaysPerWeek: training.trainingFrequency ?? 0,
      },
      create: {
        userId: user.id,

        // Biometrics
        age: biometrics.age,
        gender: biometrics.gender,
        heightCm: biometrics.height,
        currentWeight: biometrics.weight,
        bodyFatPercentage: biometrics.bodyFatPercentage ?? null,

        // Activity
        activityLevel: activity.activityLevel,
        dailySteps: activity.dailySteps ?? null,
        sittingHours: activity.sittingHours ?? null,
        workType: activity.workType ?? null,

        // Training
        trainingLevel: training.trainingLevel,
        trainingTypes: JSON.stringify(training.trainingTypes ?? []),
        sessionDuration: training.sessionDuration ?? null,
        intensity: training.intensity ?? null,
        workoutDaysPerWeek: training.trainingFrequency ?? 0,
      },
    });

    // 5) GUARDAR / ACTUALIZAR USER GOALS (Objetivos + Dieta + Macros)
    await prisma.userGoals.upsert({
      where: { userId: user.id },
      update: {
        // Goal
        goalType: goal.goalType,
        goalSpeed: goal.goalSpeed ?? null,
        targetWeight: goal.targetWeight ?? 0,

        // Diet
        dietType: diet.dietType,
        allergies: JSON.stringify(diet.allergies ?? []),
        excludedIngredients: JSON.stringify(diet.excludedIngredients ?? []),

        // Macros calculados
        targetCalories: calculatedMacros.targetCalories,
        targetProteinG: calculatedMacros.protein,
        targetCarbsG: calculatedMacros.carbs,
        targetFatG: calculatedMacros.fats,

        // Metabolismo
        bmr: calculatedMacros.bmr,
        tdee: calculatedMacros.tdee,
      },
      create: {
        userId: user.id,

        // Goal
        goalType: goal.goalType,
        goalSpeed: goal.goalSpeed ?? null,
        targetWeight: goal.targetWeight ?? 0,

        // Diet
        dietType: diet.dietType,
        allergies: JSON.stringify(diet.allergies ?? []),
        excludedIngredients: JSON.stringify(diet.excludedIngredients ?? []),

        // Macros calculados
        targetCalories: calculatedMacros.targetCalories,
        targetProteinG: calculatedMacros.protein,
        targetCarbsG: calculatedMacros.carbs,
        targetFatG: calculatedMacros.fats,

        // Metabolismo
        bmr: calculatedMacros.bmr,
        tdee: calculatedMacros.tdee,
      },
    });

    // 6) RESPUESTA FINAL
    return NextResponse.json({ message: "Onboarding completado correctamente." });
  } catch (error) {
    console.error("❌ Error en onboarding/complete:", error);
    return NextResponse.json(
      { error: "Error interno al completar el onboarding." },
      { status: 500 }
    );
  }
}
