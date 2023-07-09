import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { pathname, searchParams } = new URL(request.url);
  const id = Number(pathname.split('/').pop());

  const searchValue = decodeURIComponent(searchParams.get('searchValue') || '');

  const tasks = await prisma.task.findMany({
    where: {
      authorId: id,
      title: {
        contains: searchValue || "",
        mode: 'insensitive'
      }
    },
  })

  return NextResponse.json({ success: true, tasks })
}