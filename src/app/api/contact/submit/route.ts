// src/app/api/contact/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/contact';

// Simulación de servicio de email (Resend / SendGrid)
async function sendEmail(data: any) {
  // AQUÍ IRÍA LA LÓGICA REAL DE RESEND:
  // await resend.emails.send({ from: '...', to: 'support@sporvit.com', ... })
  
  console.log("📧 [Email Service Mock] Enviando correo:", data);
  return new Promise((resolve) => setTimeout(resolve, 1000)); // Simular delay de red
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validar datos con Zod
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error.format() },
        { status: 400 }
      );
    }

    // 2. Procesar el envío (Simulado)
    await sendEmail(validation.data);

    // 3. Responder al cliente
    return NextResponse.json(
      { message: "Mensaje enviado correctamente. Te responderemos en breve." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error en /api/contact/submit:", error);
    return NextResponse.json(
      { error: "Hubo un problema interno al enviar el mensaje." },
      { status: 500 }
    );
  }
}