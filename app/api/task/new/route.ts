import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json()
  const { task, id } = data

  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })

  const taskList = await prisma.taskList.findUnique({
    where: {
      id: task.list
    }
  });

  const newTask = await prisma.task.create({
    data: {
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
      taskList: {
        connect: {
          id: taskList?.id
        }
      },
      author: {
        connect: {
          id: user?.id
        }
      }
    }
  })

  return NextResponse.json({ success: true, newTask })
}