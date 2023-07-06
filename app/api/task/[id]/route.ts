import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = Number(pathname.split('/').pop());

  const tasks = await prisma.task.findMany({
    where: {
      taskListId: id
    }
  })

  return NextResponse.json({ success: true, tasks })
}