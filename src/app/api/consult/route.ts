import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consultRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = consultRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, phone, company, message } = parsed.data;

  const consultRequest = await prisma.consultRequest.create({
    data: {
      name,
      email,
      phone: phone || null,
      company: company || null,
      message,
    },
  });

  return NextResponse.json({ consultRequestId: consultRequest.id }, { status: 201 });
}
