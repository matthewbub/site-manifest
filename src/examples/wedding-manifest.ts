import { defineSiteManifest } from "../define-site-manifest.js";

export const weddingManifest = defineSiteManifest({
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
            en: "We're Getting Married",
            es: "¡Nos Casamos!",
          },
        },
        {
          key: "titleLabel",
          label: "Title",
          kind: "string",
          input: "textarea",
          defaultValue: {
            en: "Celebrate with us",
            es: "Celebra con nosotros",
          },
        },
      ],
    },
    {
      id: "stickyNav",
      title: "Sticky Navigation",
      enabledByDefault: true,
      labels: [
        {
          key: "navLabels",
          label: "Navigation Labels",
          kind: "group",
          fields: [
            {
              key: "home",
              label: "Home",
              defaultValue: { en: "Home", es: "Inicio" },
            },
            {
              key: "story",
              label: "Story",
              defaultValue: { en: "Story", es: "Historia" },
            },
            {
              key: "faq",
              label: "FAQ",
              defaultValue: { en: "FAQ", es: "Preguntas" },
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
          key: "titleLabel",
          label: "Title",
          kind: "string",
          input: "text",
          defaultValue: {
            en: "FAQ",
            es: "Preguntas",
          },
        },
        {
          key: "faqItems",
          label: "FAQ Items",
          kind: "repeater",
          itemFields: [
            { key: "question", label: "Question", kind: "string", input: "text" },
            { key: "answer", label: "Answer", kind: "string", input: "textarea" },
          ],
          defaultItems: {
            en: [
              {
                question: "When should I arrive?",
                answer: "Please arrive by 4pm.",
              },
            ],
            es: [
              {
                question: "¿Cuándo debo llegar?",
                answer: "Por favor llega a las 4pm.",
              },
            ],
          },
        },
      ],
    },
  ],
});
