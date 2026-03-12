import { describe, expect, it } from "vitest";
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
                { key: "question", label: "Question", kind: "text" },
                { key: "answer", label: "Answer", kind: "textarea" },
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
});
