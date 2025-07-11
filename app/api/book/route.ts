import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.log("[LOG] Não autorizado o usuário");
    return NextResponse.json({ error: "Não Autorizado" }, { status: 401 });
  }

  const { title, style, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { error: "Título e conteúdo são obrigatórios" },
      { status: 400 }
    );
  }

  const book = await prisma.book.create({
    data: {
      title,
      style,
      content,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ book }, { status: 201 });
}
