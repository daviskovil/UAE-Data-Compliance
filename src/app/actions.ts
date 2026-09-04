"use server";

import { db } from "@/data";
import type { CheckerAnswers, LeadSource } from "@/data/types";

export interface ActionResult {
  ok: boolean;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function list(form: FormData, key: string): string[] {
  return form
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

/** Lead capture from a vendor profile or the checker result page (SRS 4.2). */
export async function submitLead(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const email = str(form, "email");
  const source = (str(form, "source") || "vendor_profile") as LeadSource;

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  let checkerAnswers: CheckerAnswers | undefined;
  const rawAnswers = str(form, "checkerAnswers");
  if (rawAnswers) {
    try {
      checkerAnswers = JSON.parse(rawAnswers) as CheckerAnswers;
    } catch {
      checkerAnswers = undefined;
    }
  }

  await db.createLead({
    source,
    visitorEmail: email,
    message: str(form, "message") || undefined,
    matchedVendorIds: list(form, "vendorId"),
    matchedFrameworks: list(form, "framework"),
    checkerAnswers,
  });

  return {
    ok: true,
    message:
      "Thanks - your request has been logged. In the live site this routes to the selected vendor(s).",
  };
}

/** Public vendor submission form (SRS 4.6). */
export async function submitVendorApplication(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const name = str(form, "name");
  const websiteUrl = str(form, "websiteUrl");
  const description = str(form, "description");
  const contactEmail = str(form, "contactEmail");
  const frameworks = list(form, "frameworks");
  const sectors = list(form, "sectors");

  if (name.length < 2) return { ok: false, message: "Company name is required." };
  if (!/^https?:\/\//i.test(websiteUrl))
    return { ok: false, message: "Enter a full website URL (https://...)." };
  if (description.length < 20)
    return {
      ok: false,
      message: "Add a short description (at least 20 characters).",
    };
  if (!EMAIL_RE.test(contactEmail))
    return { ok: false, message: "Enter a valid contact email address." };

  await db.createVendorSubmission({
    name,
    websiteUrl,
    description,
    contactEmail,
    frameworks,
    sectors,
  });

  return {
    ok: true,
    message:
      "Submitted for review. You'll get a confirmation email once notifications are wired up; an admin approves listings before they go live.",
  };
}

/** Contact form (SRS 4.9). */
export async function submitContact(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const email = str(form, "email");
  const message = str(form, "message");
  if (!EMAIL_RE.test(email))
    return { ok: false, message: "Enter a valid email address." };
  if (message.length < 10)
    return { ok: false, message: "Add a bit more detail to your message." };

  await db.createLead({
    source: "contact_form",
    visitorEmail: email,
    message,
  });

  return { ok: true, message: "Thanks - we'll get back to you by email." };
}
