"use client";

import { useActionState } from "react";
import { submitContact, type ActionResult } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Field, TextArea, TextInput } from "./fields";
import { FormStatus } from "./FormStatus";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(submitContact, null);

  if (state?.ok) return <FormStatus state={state} />;

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Your email" htmlFor="c-email" required>
        <TextInput
          id="c-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Message" htmlFor="c-message" required>
        <TextArea id="c-message" name="message" required />
      </Field>
      <FormStatus state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
