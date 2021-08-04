import { signIn, signOut, useSession } from "next-auth/client";
import React from "react";
import { Button } from "./Button";

export interface TopBarProps {
  children: React.ReactNode;
}

export function TopBar({ children }: TopBarProps) {
  const [session] = useSession();

  return (
    <header className="flex items-center bg-gray-300 h-14">
      <div className="flex-1">{children}</div>
      <div className="my-1 mx-5">
        {session ? (
          <>
            <div
              className="rounded-full bg-white cursor-pointer"
              onClick={() => signOut()}
            >
              <img
                className="absolute w-12 opacity-0 hover:opacity-80 bg-gray-800 rounded-full transition-opacity"
                src="/exit.png"
              />
              <img
                className="w-12 object-cover"
                src={session.user?.image ?? "/user.png"}
              />
            </div>
            <h1>{session.user?.name}</h1>
          </>
        ) : (
          <Button onClick={signIn}>Sign in</Button>
        )}
      </div>
    </header>
  );
}
