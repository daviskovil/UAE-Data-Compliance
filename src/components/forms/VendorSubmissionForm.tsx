"use client";

import { useActionState } from "react";
import {
  submitVendorApplication,
  type ActionResult,
} from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { CheckboxPills, Field, TextArea, TextInput } from "./fields";
import { FormStatus } from "./FormStatus";

export function VendorSubmissionForm({
  frameworkOptions,
  sectorOptions,
}: {
  frameworkOptions: { value: string; label: string }[];
  sectorOptions: { value: string; label: string }[];
}) {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(submitVendorApplication, null);

  if (state?.ok) {
    return (
      <div className="space-y-3">
        <FormStatus state={state} />
        <p className="text-sm text-muted">
          You can close this page. Nothing is published until an admin approves
          it.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Company name" htmlFor="v-name" required>
        <TextInput id="v-name" name="name" required placeholder="Acme Advisory" />
      </Field>
      <Field label="Website" htmlFor="v-website" required>
        <TextInput
          id="v-website"
          name="websiteUrl"
          type="url"
          required
          placeholder="https://acme.ae"
        />
      </Field>
      <Field
        label="Short description"
        htmlFor="v-desc"
        hint="One or two sentences on what you do and who you serve."
        required
      >
        <TextArea id="v-desc" name="description" required />
      </Field>
      <Field label="Frameworks you cover" hint="Select all that apply">
        <CheckboxPills name="frameworks" options={frameworkOptions} />
      </Field>
      <Field label="Sectors you serve" hint="Select all that apply">
        <CheckboxPills name="sectors" options={sectorOptions} />
      </Field>
      <Field label="Contact email" htmlFor="v-email" required>
        <TextInput
          id="v-email"
          name="contactEmail"
          type="email"
          required
          placeholder="hello@acme.ae"
        />
      </Field>
      <p className="text-xs text-muted">
        Logo upload will be added with file storage. For now, send your logo by
        email after submitting.
      </p>
      <FormStatus state={state} />
      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {pending ? "Submitting..." : "Submit for review"}
      </Button>
    </form>
  );
}
