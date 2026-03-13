import { describe, expect, it } from "vitest";
import { createLabelSet } from "../src/create-label-set.js";
import { exampleManifest } from "../src/examples/example-manifest.js";
import { validateManifest } from "../src/schema/validate-manifest.js";

describe("examples", () => {
  it("keeps the internal example manifest valid", () => {
    expect(validateManifest(exampleManifest)).toEqual(exampleManifest);
  });

  it("supports the README-style resolver flow", () => {
    const labelSet = createLabelSet({
      manifest: exampleManifest,
      locale: "en",
      labels: {
        en: {
          hero: {
            title: "Hello",
          },
          faq: {
            items: JSON.stringify([
              {
                question: "Support?",
                answer: "Email us.",
              },
            ]),
          },
          navigation: {
            links: {
              features: "Product",
            },
          },
        },
      },
    });

    expect(labelSet.value("hero", "title")).toBe("Hello");
    expect(labelSet.group("navigation", "links")).toEqual({
      home: "Home",
      features: "Product",
    });
    expect(labelSet.items("faq", "items")).toEqual([
      {
        question: "Support?",
        answer: "Email us.",
      },
    ]);
  });
});
