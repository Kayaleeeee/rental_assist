"use client";

import { useClientAuthentication } from "@/app/hooks/auth/useClientAuthentication";
import Link from "next/link";
import { Button } from ".";

export const NavLoginButton = () => {
  const { user, loading } = useClientAuthentication();

  if (!user && loading) return null;

  return (
    <Link href={"/login"}>
      <Button variant="outlined" size="Medium">
        {!loading && !user ? "로그인" : `${user?.email}님`}
      </Button>
    </Link>
  );
};
