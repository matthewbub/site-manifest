import { describe, expect, it } from "vitest";
import { defineSiteManifest } from "../src/define-site-manifest.js";

describe("defineSiteManifest", () => {
  it("returns the manifest unchanged", () => {
    const manifest = defineSiteManifest({
      id: "wedding",
      locales: ["en", "es"],
      sections: [
        {
          id: "hero",
          title: "Hero",
          enabledByDefault: true,
          labels: [
            {
              key: "subtitleLabel",
              label: "Subtitle",
              kind: "string",
              input: "text",
              defaultValue: {
                en: "We're getting married",
              },
            },
          ],
        },
      ],
    });

    expect(manifest.sections[0]?.labels[0]?.kind).toBe("string");
    expect(manifest.sections[0]?.labels[0]).toMatchObject({
      input: "text",
    });
    expect(manifest.id).toBe("wedding");
  });
});
