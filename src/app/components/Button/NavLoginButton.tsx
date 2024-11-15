"use client";

import Link from "next/link";
import { Button } from ".";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useEffect } from "react";

export const NavLoginButton = () => {
  const { user, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!user && loading) return null;

  return (
    <Link href={"/login"}>
      <Button variant="outlined" size="Medium">
        {!loading && !user ? "로그인" : "로그아웃"}
      </Button>
    </Link>
  );
};
