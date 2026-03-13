import { describe, expect, it } from "vitest";
import { createLabelSet } from "../src/create-label-set.js";
import { defineSiteManifest } from "../src/define-site-manifest.js";

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
          key: "titleLabel",
          label: "Title",
          kind: "string",
          defaultValue: {
            en: "Welcome",
            es: "Bienvenidos",
          },
        },
        {
          key: "descriptionLabel",
          label: "Description",
          kind: "string",
          defaultValue: {
            en: "Default description",
            es: "Descripcion por defecto",
          },
        },
      ],
    },
    {
      id: "stickyNav",
      title: "Sticky Nav",
      enabledByDefault: true,
      labels: [
        {
          key: "navLabels",
          label: "Nav Labels",
          kind: "group",
          fields: [
            {
              key: "home",
              label: "Home",
              defaultValue: { en: "Home", es: "Inicio" },
            },
            {
              key: "gallery",
              label: "Gallery",
              defaultValue: { en: "Gallery", es: "Galeria" },
            },
          ],
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
          itemFields: [
            { key: "question", label: "Question", kind: "string" },
            { key: "answer", label: "Answer", kind: "string" },
          ],
          defaultItems: {
            en: [{ question: "Q1", answer: "A1" }],
          },
        },
      ],
    },
  ],
});

describe("createLabelSet", () => {
  it("resolves string defaults", () => {
    const labelSet = createLabelSet({
      manifest,
      locale: "en",
      labels: {},
    });

    expect(labelSet.value("hero", "titleLabel")).toBe("Welcome");
    expect(labelSet.value("hero", "descriptionLabel")).toBe("Default description");
  });

  it("applies string overrides and ignores blank overrides", () => {
    const labelSet = createLabelSet({
      manifest,
      locale: "en",
      labels: {
        en: {
          hero: {
            titleLabel: "Custom title",
            descriptionLabel: "",
          },
        },
      },
    });

    expect(labelSet.value("hero", "titleLabel")).toBe("Custom title");
    expect(labelSet.value("hero", "descriptionLabel")).toBe("Default description");
  });

  it("resolves groups with defaults and merged overrides", () => {
    const labelSet = createLabelSet({
      manifest,
      locale: "en",
      labels: {
        en: {
          stickyNav: {
            navLabels: {
              gallery: "Photos",
            },
          },
        },
      },
    });

    expect(labelSet.group("stickyNav", "navLabels")).toEqual({
      home: "Home",
      gallery: "Photos",
    });
  });

  it("returns repeater defaults and parses repeater overrides", () => {
    const labelSetWithDefaults = createLabelSet({
      manifest,
      locale: "en",
      labels: {},
    });

    expect(labelSetWithDefaults.items("faq", "faqItems")).toEqual([
      { question: "Q1", answer: "A1" },
    ]);

    const labelSetWithOverrides = createLabelSet({
      manifest,
      locale: "en",
      labels: {
        en: {
          faq: {
            faqItems: JSON.stringify([
              { question: "When?", answer: "At 4pm" },
            ]),
          },
        },
      },
    });

    expect(labelSetWithOverrides.items("faq", "faqItems")).toEqual([
      { question: "When?", answer: "At 4pm" },
    ]);
  });

  it("falls back cleanly for malformed repeater payloads", () => {
    const labelSet = createLabelSet({
      manifest,
      locale: "en",
      labels: {
        en: {
          faq: {
            faqItems: "{bad json",
          },
        },
      },
    });

    expect(labelSet.items("faq", "faqItems")).toEqual([
      { question: "Q1", answer: "A1" },
    ]);
  });

  it("accepts pre-parsed repeater arrays", () => {
    const labelSet = createLabelSet({
      manifest,
      locale: "en",
      labels: {
        en: {
          faq: {
            faqItems: [
              { question: "Parsed", answer: "Already an array" },
            ],
          },
        },
      },
    });

    expect(labelSet.items("faq", "faqItems")).toEqual([
      { question: "Parsed", answer: "Already an array" },
    ]);
  });

  it("resolves hidden state from serialized metadata", () => {
    const labelSet = createLabelSet({
      manifest,
      locale: "en",
      labels: {
        en: {
          hero: {
            _hidden: JSON.stringify({
              titleLabel: true,
            }),
          },
        },
      },
    });

    expect(labelSet.hidden("hero", "titleLabel")).toBe(true);
    expect(labelSet.hidden("hero", "descriptionLabel")).toBe(false);
  });

  it("accepts object hidden metadata and keeps unknown group keys safe", () => {
    const labelSet = createLabelSet({
      manifest,
      locale: "en",
      labels: {
        en: {
          hero: {
            _hidden: {
              descriptionLabel: true,
            },
          },
        },
      },
    });

    expect(labelSet.hidden("hero", "descriptionLabel")).toBe(true);
    expect(labelSet.group("hero", "missingGroup")).toEqual({});
  });

  it("returns safe empty values for unknown sections and keys", () => {
    const labelSet = createLabelSet({
      manifest,
      locale: "en",
      labels: {},
    });

    expect(labelSet.section("missing")).toEqual({});
    expect(labelSet.value("missing", "title")).toBe("");
    expect(labelSet.group("missing", "group")).toEqual({});
    expect(labelSet.items("missing", "items")).toEqual([]);
    expect(labelSet.hidden("missing", "hidden")).toBe(false);
  });
});
