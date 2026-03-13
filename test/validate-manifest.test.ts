import { describe, expect, it } from "vitest";
import manifestSchema from "../src/schema/site-manifest.schema.json" with { type: "json" };
import {
  ManifestValidationError,
  getManifestValidationErrors,
  isValidManifest,
  validateManifest,
} from "../src/schema/validate-manifest.js";

describe("validateManifest", () => {
  it("accepts a valid manifest", () => {
    const manifest = {
      id: "wedding",
      locales: ["en", "es"],
      sections: [
        {
          id: "faq",
          title: "FAQ",
          enabledByDefault: true,
          labels: [
            {
              key: "faqItems",
              label: "FAQ Items",
              kind: "repeater",
              itemFields: [
                { key: "question", label: "Question", kind: "string", input: "text" },
                { key: "answer", label: "Answer", kind: "string", input: "textarea" },
              ],
            },
          ],
        },
      ],
    };

    expect(isValidManifest(manifest)).toBe(true);
    expect(validateManifest(manifest)).toEqual(manifest);
  });

  it("returns useful errors for invalid manifests", () => {
    const manifest = {
      id: "wedding",
      locales: ["en"],
      sections: [
        {
          id: "faq",
          title: "FAQ",
          enabledByDefault: true,
          labels: [
            {
              key: "faqItems",
              label: "FAQ Items",
              kind: "repeater",
            },
          ],
        },
      ],
    };

    const issues = getManifestValidationErrors(manifest);

    expect(issues.length).toBeGreaterThan(0);
    expect(() => validateManifest(manifest)).toThrow(ManifestValidationError);
  });

  it("fails when a group omits fields", () => {
    const manifest = {
      id: "site",
      locales: ["en"],
      sections: [
        {
          id: "nav",
          title: "Nav",
          enabledByDefault: true,
          labels: [
            {
              key: "navLabels",
              label: "Nav Labels",
              kind: "group",
            },
          ],
        },
      ],
    };

    const issues = getManifestValidationErrors(manifest);

    expect(issues.some((issue) => issue.includes("must have required property 'fields'"))).toBe(true);
  });

  it("fails when a repeater omits itemFields", () => {
    const manifest = {
      id: "site",
      locales: ["en"],
      sections: [
        {
          id: "faq",
          title: "FAQ",
          enabledByDefault: true,
          labels: [
            {
              key: "faqItems",
              label: "FAQ Items",
              kind: "repeater",
            },
          ],
        },
      ],
    };

    const issues = getManifestValidationErrors(manifest);

    expect(issues.some((issue) => issue.includes("must have required property 'itemFields'"))).toBe(true);
  });

  it("fails when a field kind is invalid", () => {
    const manifest = {
      id: "site",
      locales: ["en"],
      sections: [
        {
          id: "hero",
          title: "Hero",
          enabledByDefault: true,
          labels: [
            {
              key: "titleLabel",
              label: "Title",
              kind: "markdown",
            },
          ],
        },
      ],
    };

    expect(isValidManifest(manifest)).toBe(false);
  });

  it("rejects legacy text and textarea field kinds", () => {
    const textManifest = {
      id: "site",
      locales: ["en"],
      sections: [
        {
          id: "hero",
          title: "Hero",
          enabledByDefault: true,
          labels: [
            {
              key: "titleLabel",
              label: "Title",
              kind: "text",
            },
          ],
        },
      ],
    };
    const textareaManifest = {
      id: "site",
      locales: ["en"],
      sections: [
        {
          id: "hero",
          title: "Hero",
          enabledByDefault: true,
          labels: [
            {
              key: "descriptionLabel",
              label: "Description",
              kind: "textarea",
            },
          ],
        },
      ],
    };

    expect(isValidManifest(textManifest)).toBe(false);
    expect(isValidManifest(textareaManifest)).toBe(false);
  });

  it("publishes a draft 2020-12 schema id", () => {
    expect(manifestSchema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
    expect(manifestSchema.$defs.section.type).toBe("object");
  });
});
