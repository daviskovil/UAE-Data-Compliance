"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CheckerAnswers } from "@/data/types";

type StepId = keyof CheckerAnswers;

interface Choice {
  value: string;
  label: string;
  hint?: string;
}

interface Step {
  id: StepId;
  question: string;
  choices: Choice[];
}

const STEPS: Step[] = [
  {
    id: "sector",
    question: "What sector is your business in?",
    choices: [
      { value: "healthcare", label: "Healthcare", hint: "Providers, insurers, health-tech" },
      { value: "finance", label: "Finance", hint: "Banks, insurers, fintech, payments" },
      {
        value: "government",
        label: "Government-adjacent",
        hint: "You serve or contract with government",
      },
      { value: "general-sme", label: "General SME", hint: "None of the above" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "hosting",
    question: "Where is your data currently hosted?",
    choices: [
      { value: "uae", label: "In the UAE" },
      { value: "gcc", label: "Elsewhere in the GCC" },
      { value: "international", label: "Internationally (EU, US, etc.)" },
    ],
  },
  {
    id: "handlesUaePersonalData",
    question: "Do you handle personal data of people in the UAE?",
    choices: [
      { value: "true", label: "Yes", hint: "Customers, employees, users, patients" },
      { value: "false", label: "No" },
    ],
  },
  {
    id: "governmentContracts",
    question: "Do you work with UAE government contracts?",
    choices: [
      { value: "true", label: "Yes, or we plan to" },
      { value: "false", label: "No" },
    ],
  },
  {
    id: "sizeBand",
    question: "How many people work at your company?",
    choices: [
      { value: "1-10", label: "1 - 10" },
      { value: "11-50", label: "11 - 50" },
      { value: "51-200", label: "51 - 200" },
      { value: "200+", label: "200+" },
    ],
  },
];

export function CheckerWizard() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = STEPS[index];
  const progress = useMemo(
    () => Math.round((index / STEPS.length) * 100),
    [index],
  );

  const pick = (value: string) => {
    const next = { ...answers, [step.id]: value };
    setAnswers(next);

    if (index < STEPS.length - 1) {
      setIndex(index + 1);
      return;
    }

    const payload: CheckerAnswers = {
      sector: next.sector as CheckerAnswers["sector"],
      hosting: next.hosting as CheckerAnswers["hosting"],
      handlesUaePersonalData: next.handlesUaePersonalData === "true",
      governmentContracts: next.governmentContracts === "true",
      sizeBand: next.sizeBand as CheckerAnswers["sizeBand"],
    };
    const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
    router.push(`/checker/result?a=${encoded}`);
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span>
          Step {index + 1} of {STEPS.length}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${Math.max(progress, 6)}%` }}
        />
      </div>

      <h2 className="mt-6 text-xl font-bold text-ink">{step.question}</h2>

      <div className="mt-4 grid gap-2">
        {step.choices.map((choice) => {
          const selected = answers[step.id] === choice.value;
          return (
            <button
              key={choice.value}
              type="button"
              onClick={() => pick(choice.value)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-brand-400 bg-brand-50"
                  : "border-line bg-surface hover:border-brand-200 hover:bg-canvas"
              }`}
            >
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {choice.label}
                </span>
                {choice.hint ? (
                  <span className="block text-xs text-muted">{choice.hint}</span>
                ) : null}
              </span>
              <span className="text-muted">&rarr;</span>
            </button>
          );
        })}
      </div>

      {index > 0 ? (
        <div className="mt-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIndex(index - 1)}
          >
            &larr; Back
          </Button>
        </div>
      ) : null}
    </div>
  );
}
