import localFont from "next/font/local";
export const baseFonts = localFont({
  src: [
    {
      path: "../../../public/fonts/Mulish-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Mulish-ExtraLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../../public/fonts/Mulish-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Mulish-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../../public/fonts/Mulish-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Mulish-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--my-font-",
});
