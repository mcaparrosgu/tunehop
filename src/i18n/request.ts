import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messagesByLocale: Record<string, () => Promise<Record<string, unknown>>> = {
  es: () => import("../../messages/es.json").then((m) => m.default),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const loader = messagesByLocale[locale];
  const messages = loader ? await loader() : {};

  return {
    locale,
    messages,
  };
});
