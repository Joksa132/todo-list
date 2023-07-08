import { prisma } from "@/prisma/prisma";
import { endOfDay } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = Number(pathname.split('/').pop());

  const today = new Date();
  const todayEnd = endOfDay(today)

  const tasks = await prisma.task.findMany({
    where: {
      authorId: id,
      dueDate: {
        gte: todayEnd,
      }
    },
    include: {
      taskList: true,
    }
  })

  return NextResponse.json({ success: true, tasks })
}