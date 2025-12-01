// src/app/api/meal-plan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyPlan } from '@/lib/mealPlanEngine/generator';

// MOCK: Función para simular la búsqueda en la DB
const fetchPlanFromDB = async (userId: string, week: string) => {
    // Aquí iría la consulta a Prisma: 
    // const plan = await prisma.mealPlan.findUnique({ where: { userId_week: { userId, week } } });
    
    // Si no se encuentra en DB, generamos un plan inicial mock basado en la semana
    // Esto simula que si el plan para esa semana no existe, se genera uno por defecto.
    console.log(`[DB Mock] Buscando/Generando plan inicial para ${week}...`);
    return generateWeeklyPlan(userId, week, {
        useFavorites: false, 
        varietyLevel: 'medium', 
        avoidRepeat: false
    });
};

/**
 * GET /api/meal-plan?week=YYYY-WXX
 * Obtiene el plan de comidas para una semana específica.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const week = searchParams.get('week') || '2024-W48'; 

  // Simulación de autenticación
  const userId = 'mock-user-uuid-123'; 
  if (!userId) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    // 1. Lógica de Base de Datos: Buscar el plan.
    const planData = await fetchPlanFromDB(userId, week); 

    return NextResponse.json(planData, { status: 200 });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return NextResponse.json({ message: "Error interno al obtener el plan." }, { status: 500 });
  }
}