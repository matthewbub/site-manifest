import { describe, expect, it } from "vitest";
import { createLabelSet } from "../src/create-label-set.js";
import { weddingManifest } from "../src/examples/wedding-manifest.js";
import { validateManifest } from "../src/schema/validate-manifest.js";

describe("examples", () => {
  it("keeps the wedding example manifest valid", () => {
    expect(validateManifest(weddingManifest)).toEqual(weddingManifest);
  });

  it("supports the README-style resolver flow", () => {
    const labelSet = createLabelSet({
      manifest: weddingManifest,
      locale: "en",
      labels: {
        en: {
          faq: {
            titleLabel: "Questions",
            faqItems: JSON.stringify([
              {
                question: "Where should I park?",
                answer: "Use the north lot.",
              },
            ]),
          },
          stickyNav: {
            navLabels: {
              faq: "Questions",
            },
          },
        },
      },
    });

    expect(labelSet.value("faq", "titleLabel")).toBe("Questions");
    expect(labelSet.group("stickyNav", "navLabels")).toEqual({
      home: "Home",
      story: "Story",
      faq: "Questions",
    });
    expect(labelSet.items("faq", "faqItems")).toEqual([
      {
        question: "Where should I park?",
        answer: "Use the north lot.",
      },
    ]);
  });
});
