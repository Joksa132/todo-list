import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = Number(pathname.split('/').pop());

  const taskLists = await prisma.taskList.findMany({
    where: {
      authorId: id
    },
    include: {
      tasks: true
    }
  })

  return NextResponse.json({ success: true, taskLists })
}