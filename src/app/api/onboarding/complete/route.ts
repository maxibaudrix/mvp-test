// src/app/api/onboarding/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'No autenticado', code: 'UNAUTHORIZED' } },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Guardar en user_profiles y user_goals
    await prisma.$transaction([
      // Actualizar perfil base
      prisma.userProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          age: body.age,
          gender: body.gender,
          heightCm: body.height,
          currentWeight: body.weight,
          bodyFatPercentage: body.bodyFatPercentage,
        },
        update: {
          age: body.age,
          gender: body.gender,
          heightCm: body.height,
          currentWeight: body.weight,
          bodyFatPercentage: body.bodyFatPercentage,
        },
      }),

      // Crear objetivos
      prisma.userGoals.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          goalType: body.goalType,
          targetWeight: body.targetWeight,
          dietType: body.dietType,
          allergies: body.allergies,
          excludedIngredients: body.excludedIngredients,
          bmr: body.bmr,
          tdee: body.tdee,
          targetCalories: body.targetCalories,
          targetProteinG: body.targetProteinG,
          targetCarbsG: body.targetCarbsG,
          targetFatG: body.targetFatG,
        },
        update: {
          goalType: body.goalType,
          targetWeight: body.targetWeight,
          dietType: body.dietType,
          allergies: body.allergies,
          excludedIngredients: body.excludedIngredients,
          bmr: body.bmr,
          tdee: body.tdee,
          targetCalories: body.targetCalories,
          targetProteinG: body.targetProteinG,
          targetCarbsG: body.targetCarbsG,
          targetFatG: body.targetFatG,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Error interno', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}