/**
 * Compliance Checker matching logic (SRS 4.2).
 *
 * Pure, dependency-free rules that map questionnaire answers to the frameworks
 * that most likely apply. This is intentionally conservative and is NOT legal
 * advice - every result page carries the disclaimer.
 */

import type { CheckerAnswers, FrameworkSlug } from "@/data/types";

export interface CheckerMatch {
  framework: FrameworkSlug;
  reason: string;
}

export interface CheckerResult {
  matches: CheckerMatch[];
  /** Category slugs used to pull relevant vendors from the directory. */
  categorySlugs: string[];
  residencyFlag: boolean;
}

export const CHECKER_STEPS = 4;

export function evaluateChecker(answers: CheckerAnswers): CheckerResult {
  const matches = new Map<FrameworkSlug, string>();
  const categorySlugs = new Set<string>();

  const add = (framework: FrameworkSlug, reason: string) => {
    if (!matches.has(framework)) matches.set(framework, reason);
  };

  if (answers.handlesUaePersonalData) {
    add(
      "pdpl",
      "You handle personal data of people in the UAE, which brings the federal PDPL into scope.",
    );
    categorySlugs.add("pdpl-consultants");
    categorySlugs.add("grc-dpo-services");
  }

  if (answers.sector === "healthcare") {
    add(
      "mohap",
      "Healthcare providers and health-tech handling UAE patient data fall under the federal health data law and the emirate health authorities.",
    );
    categorySlugs.add("healthcare-data-compliance");
  }

  if (answers.sector === "finance") {
    add(
      "cbuae",
      "Financial institutions licensed in the UAE must meet CBUAE data, outsourcing and cloud expectations on top of the PDPL.",
    );
    categorySlugs.add("finance-cbuae-compliance");
  }

  if (answers.sector === "government" || answers.governmentContracts) {
    add(
      "nesa",
      "Working with government or critical infrastructure typically triggers the UAE Information Assurance (NESA) Standards.",
    );
    add(
      "desc",
      "Delivering to Dubai Government usually requires compliance with the DESC Information Security Regulation (ISR).",
    );
    categorySlugs.add("grc-dpo-services");
  }

  const residencyFlag =
    answers.hosting !== "uae" &&
    (answers.sector === "healthcare" ||
      answers.sector === "finance" ||
      answers.sector === "government" ||
      answers.governmentContracts);

  if (residencyFlag) {
    add(
      "tdra-ccrf",
      "Your data is hosted outside the UAE in a sector with residency expectations - the TDRA Cloud Computing Regulatory Framework and sector residency rules are relevant.",
    );
    categorySlugs.add("uae-data-centers");
  }

  // Everyone doing business in the UAE should at least look at the PDPL.
  if (matches.size === 0) {
    add(
      "pdpl",
      "Almost every business operating in the UAE has some obligations under the federal PDPL - start here.",
    );
    categorySlugs.add("pdpl-consultants");
  }

  const order: FrameworkSlug[] = [
    "pdpl",
    "cbuae",
    "mohap",
    "nesa",
    "desc",
    "tdra-ccrf",
  ];

  const sorted = [...matches.entries()].sort(
    ([a], [b]) => order.indexOf(a) - order.indexOf(b),
  );

  return {
    matches: sorted.map(([framework, reason]) => ({ framework, reason })),
    categorySlugs: [...categorySlugs],
    residencyFlag,
  };
}
