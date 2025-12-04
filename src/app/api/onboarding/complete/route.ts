// src/app/api/onboarding/complete/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { formData, calculatedData } = body

    // Validate required fields
    if (!formData || !calculatedData) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await prisma.userProfile.update({
        where: { userId: session.user.id },
        data: {
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
          goal: formData.goal,
          goalSpeed: formData.goalSpeed,
          targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
          targetDate: formData.targetDate ? new Date(formData.targetDate) : null,
          dailyActivity: formData.dailyActivity,
          workoutDays: parseInt(formData.workoutDays),
          workoutDuration: parseInt(formData.workoutDuration),
          workoutType: formData.workoutType,
          fitnessLevel: formData.estimatedLevel,
          trainingYears: formData.trainingYears,
          dietType: formData.dietType,
          allergies: formData.allergies || [],
          novaMax: parseInt(formData.novaMax),
          nutriScoreMin: formData.nutriScoreMin,
          preferOrganic: formData.preferOrganic || false,
          targetCalories: calculatedData.targetCalories,
          targetProtein: calculatedData.macros.protein,
          targetCarbs: calculatedData.macros.carbs,
          targetFats: calculatedData.macros.fats,
          bmr: calculatedData.bmr,
          tdee: calculatedData.tdee,
        },
      })

      return NextResponse.json({
        success: true,
        profile: updatedProfile,
        message: 'Perfil actualizado correctamente',
      })
    } else {
      // Create new profile
      const newProfile = await prisma.userProfile.create({
        data: {
          userId: session.user.id,
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
          goal: formData.goal,
          goalSpeed: formData.goalSpeed,
          targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
          targetDate: formData.targetDate ? new Date(formData.targetDate) : null,
          dailyActivity: formData.dailyActivity,
          workoutDays: parseInt(formData.workoutDays),
          workoutDuration: parseInt(formData.workoutDuration),
          workoutType: formData.workoutType,
          fitnessLevel: formData.estimatedLevel,
          trainingYears: formData.trainingYears,
          dietType: formData.dietType,
          allergies: formData.allergies || [],
          novaMax: parseInt(formData.novaMax),
          nutriScoreMin: formData.nutriScoreMin,
          preferOrganic: formData.preferOrganic || false,
          targetCalories: calculatedData.targetCalories,
          targetProtein: calculatedData.macros.protein,
          targetCarbs: calculatedData.macros.carbs,
          targetFats: calculatedData.macros.fats,
          bmr: calculatedData.bmr,
          tdee: calculatedData.tdee,
        },
      })

      return NextResponse.json({
        success: true,
        profile: newProfile,
        message: 'Perfil creado correctamente',
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json(
      { error: 'Error al guardar el perfil' },
      { status: 500 }
    )
  }
}