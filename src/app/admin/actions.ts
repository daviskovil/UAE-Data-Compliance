"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/data";

const COOKIE = "admin_session";

/**
 * Deliberately minimal single-admin auth for the MVP (SRS 4.7). Set
 * ADMIN_PASSWORD in the environment; in dev it falls back to "admin".
 */
function expectedPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin";
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === expectedPassword();
}

export async function adminLogin(_prev: string | null, form: FormData) {
  const password = String(form.get("password") ?? "");
  if (password !== expectedPassword()) {
    return "Incorrect password.";
  }
  const store = await cookies();
  store.set(COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  revalidatePath("/admin");
  return null;
}

export async function adminLogout() {
  const store = await cookies();
  store.delete(COOKIE);
  revalidatePath("/admin");
}

export async function adminApprove(form: FormData) {
  if (!(await isAdmin())) return;
  await db.setSubmissionStatus(String(form.get("id")), "approved");
  revalidatePath("/admin");
}

export async function adminReject(form: FormData) {
  if (!(await isAdmin())) return;
  await db.setSubmissionStatus(String(form.get("id")), "rejected");
  revalidatePath("/admin");
}
