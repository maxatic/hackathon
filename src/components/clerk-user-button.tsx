"use client";

import { UserButton } from "@clerk/nextjs";

export function ClerkUserButton() {
  return (
    <UserButton
      appearance={{
        elements: {
          userButtonAvatarBox: "size-8",
        },
      }}
    />
  );
}
