import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const id = Number(pathname.split('/').pop());

  const deletedTask = await prisma.task.delete({
    where: {
      id: id
    }
  })

  return NextResponse.json({ deletedTask })
}