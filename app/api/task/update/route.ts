import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const data = await request.json()
  const { task, id } = data

  const updatedTask = await prisma.task.update({
    where: {
      id: task?.id
    },
    data: {
      title: task?.title,
      description: task?.description,
      dueDate: new Date(task?.dueDate),
      taskList: {
        connect: {
          id: task?.list
        }
      },
    }
  })

  return NextResponse.json({ success: true, updatedTask })
}