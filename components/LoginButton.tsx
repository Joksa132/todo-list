"use client";

import { signIn } from "next-auth/react";

export default function LoginButton({ provider }: { provider: string }) {
  return (
    <button onClick={() => signIn(provider.toLocaleLowerCase())}>
      Sign in with {provider}
    </button>
  );
}
