import { defineSiteManifest } from "../define-site-manifest.js";

export const exampleManifest = defineSiteManifest({
  id: "example-site",
  locales: ["en"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      enabledByDefault: true,
      labels: [
        {
          key: "title",
          label: "Title",
          kind: "string",
          defaultValue: {
            en: "Welcome",
          },
        },
        {
          key: "image",
          label: "Image",
          kind: "image",
          withAlt: true,
          withCaption: true,
          defaultValue: {
            en: {
              url: "https://example.com/welcome.jpg",
              alt: "Welcome image",
              caption: "A sample hero image",
            },
          },
        },
      ],
    },
    {
      id: "navigation",
      title: "Navigation",
      enabledByDefault: true,
      labels: [
        {
          key: "links",
          label: "Links",
          kind: "group",
          fields: [
            {
              key: "home",
              label: "Home",
              defaultValue: { en: "Home" },
            },
            {
              key: "features",
              label: "Features",
              defaultValue: { en: "Features" },
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
          key: "items",
          label: "Items",
          kind: "repeater",
          itemFields: [
            { key: "question", label: "Question", kind: "string" },
            { key: "answer", label: "Answer", kind: "string" },
            { key: "image", label: "Image", kind: "image", withAlt: true },
          ],
          defaultItems: {
            en: [
              {
                question: "Question",
                answer: "Answer",
                image: {
                  url: "https://example.com/faq.jpg",
                  alt: "FAQ image",
                },
              },
            ],
          },
        },
      ],
    },
  ],
});
