"use client";

import { useActionState } from "react";
import { submitLead, type ActionResult } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Field, TextArea, TextInput } from "./fields";
import { FormStatus } from "./FormStatus";

export function VendorInquiryForm({
  vendorId,
  vendorName,
}: {
  vendorId: string;
  vendorName: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    submitLead,
    null,
  );

  if (state?.ok) {
    return <FormStatus state={state} />;
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="source" value="vendor_profile" />
      <input type="hidden" name="vendorId" value={vendorId} />
      <Field label="Your work email" htmlFor="inq-email" required>
        <TextInput
          id="inq-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.ae"
        />
      </Field>
      <Field label={`What do you need help with?`} htmlFor="inq-message">
        <TextArea
          id="inq-message"
          name="message"
          placeholder={`A line or two of context for ${vendorName}.`}
        />
      </Field>
      <FormStatus state={state} />
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Sending..." : "Request an introduction"}
      </Button>
      <p className="text-xs text-muted">
        We pass your message and email to {vendorName}. See our{" "}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
