"use client";

import { useActionState } from "react";
import { adminLogin } from "./actions";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/forms/fields";

export function AdminLogin() {
  const [error, formAction, pending] = useActionState<string | null, FormData>(
    adminLogin,
    null,
  );

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <Field label="Admin password" htmlFor="admin-password" required>
        <TextInput
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      {error ? (
        <p className="text-sm text-accent-600">{error}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Checking..." : "Sign in"}
      </Button>
      <p className="text-xs text-muted">
        MVP single-user gate. Set <code>ADMIN_PASSWORD</code> in the environment
        (defaults to <code>admin</code> in development).
      </p>
    </form>
  );
}
