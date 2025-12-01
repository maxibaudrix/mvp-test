// src/lib/auth-helper.ts 
import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function getUserIdFromSession(request?: NextRequest) {
  const session = request ? await auth(request.headers) : await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id as string;
}

export function handleUnauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}