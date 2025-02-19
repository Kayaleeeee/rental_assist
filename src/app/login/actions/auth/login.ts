"use server";

import { CustomError } from "@/app/class/CustomError";
import { serverSupabase } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: { email: string; password: string }) {
  const supabase = await serverSupabase;
  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: {
  email: string;
  password: string;
}): Promise<void> {
  const supabase = await serverSupabase;
  const { error } = await supabase.auth.signUp(formData);

  if (error) {
    throw new CustomError(error.message);
  } else {
    revalidatePath("/", "layout");
    redirect("/");
  }
}
