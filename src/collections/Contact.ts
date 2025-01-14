import type { CollectionConfig } from "payload";

export const Contact: CollectionConfig = {
  slug: "contact",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
  ],
};
