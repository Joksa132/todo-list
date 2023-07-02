import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json()
  const { name, email } = data

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  const newList = await prisma.taskList.create({
    data: {
      name,
      author: {
        connect: {
          id: user?.id
        }
      }
    }
  })

  return NextResponse.json({ success: true, newList })
}