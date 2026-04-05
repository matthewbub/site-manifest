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
          id: "story",
          title: "Story",
          enabledByDefault: true,
          labels: [
            {
              key: "heroImage",
              label: "Hero Image",
              kind: "image",
              withAlt: true,
              withCaption: true,
              defaultValue: {
                en: {
                  url: "https://example.com/story.jpg",
                  alt: "Story photo",
                },
              },
            },
          ],
        },
        {
          id: "faq",
          title: "FAQ",
          enabledByDefault: true,
          labels: [
            {
              key: "faqItems",
              label: "FAQ Items",
              kind: "repeater",
              maxItems: 8,
              itemFields: [
                { key: "question", label: "Question", kind: "string" },
                { key: "answer", label: "Answer", kind: "string", multiline: true },
                { key: "image", label: "Image", kind: "image", withAlt: true },
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

  it("rejects removed string input metadata", () => {
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
              kind: "string",
              input: "text",
            },
          ],
        },
      ],
    };

    expect(isValidManifest(manifest)).toBe(false);
    expect(getManifestValidationErrors(manifest).some((issue) => issue.includes("must NOT have additional properties"))).toBe(true);
  });

  it("accepts multiline strings and repeater item limits as editor hints", () => {
    const manifest = {
      id: "site",
      locales: ["en"],
      sections: [
        {
          id: "story",
          title: "Story",
          enabledByDefault: true,
          labels: [
            {
              key: "body",
              label: "Body",
              kind: "string",
              multiline: true,
              defaultValue: {
                en: "Long-form copy",
              },
            },
            {
              key: "gallery",
              label: "Gallery",
              kind: "repeater",
              minItems: 0,
              maxItems: 8,
              itemFields: [
                {
                  key: "caption",
                  label: "Caption",
                  kind: "string",
                  multiline: true,
                },
              ],
            },
          ],
        },
      ],
    };

    expect(isValidManifest(manifest)).toBe(true);
  });

  it("rejects invalid repeater item limits", () => {
    const manifest = {
      id: "site",
      locales: ["en"],
      sections: [
        {
          id: "gallery",
          title: "Gallery",
          enabledByDefault: true,
          labels: [
            {
              key: "items",
              label: "Items",
              kind: "repeater",
              maxItems: -1,
              itemFields: [
                { key: "caption", label: "Caption", kind: "string" },
              ],
            },
          ],
        },
      ],
    };

    expect(isValidManifest(manifest)).toBe(false);
    expect(
      getManifestValidationErrors(manifest).some((issue) =>
        issue.includes("must be >= 0"),
      ),
    ).toBe(true);
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
