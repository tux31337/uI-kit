import type { Preview } from "@storybook/react";
import { cn } from "../src/app/lib/utils";
import { baseFonts } from "../src/app/lib/fonts";
import React from "react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story: any) => {
      return (
        <section className={cn(baseFonts.variable, "font-sans")}>
          <Story />
        </section>
      );
    },
  ],
};

export default preview;
