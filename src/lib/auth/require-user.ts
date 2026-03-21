import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function requireUser(): Promise<
  { userId: string; error: null } | { userId: null; error: NextResponse }
> {
  const { userId } = await auth();

  if (!userId) {
    return {
      userId: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { userId, error: null };
}
