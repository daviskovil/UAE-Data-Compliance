"use client";

import { useActionState } from "react";
import { submitLead, type ActionResult } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import type { CheckerAnswers } from "@/data/types";

export function CheckerLeadForm({
  frameworks,
  vendorIds,
  answers,
}: {
  frameworks: string[];
  vendorIds: string[];
  answers: CheckerAnswers;
}) {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(submitLead, null);

  if (state?.ok) return <FormStatus state={state} />;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="source" value="compliance_checker" />
      <input type="hidden" name="checkerAnswers" value={JSON.stringify(answers)} />
      {frameworks.map((slug) => (
        <input key={slug} type="hidden" name="framework" value={slug} />
      ))}
      {vendorIds.map((id) => (
        <input key={id} type="hidden" name="vendorId" value={id} />
      ))}
      <Field
        label="Want a direct introduction?"
        htmlFor="checker-email"
        hint="Optional. We'll pass your result and email to the matched vendors above."
      >
        <TextInput
          id="checker-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.ae"
        />
      </Field>
      <FormStatus state={state} />
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Sending..." : "Request intros"}
      </Button>
    </form>
  );
}
