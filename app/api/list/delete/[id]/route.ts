import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const id = Number(pathname.split("/").pop());

  const deletedTaskList = await prisma.$transaction([
    prisma.task.deleteMany({
      where: {
        taskListId: id,
      },
    }),
    prisma.taskList.delete({
      where: {
        id,
      },
    }),
  ]);

  return NextResponse.json({ success: true, deletedTaskList });
}
