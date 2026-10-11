import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import resources from "./i18n/resource";
import commerceResources from "./i18n/commerceResources";

const mergedResources = {
  en: {
    translation: {
      ...resources.en.translation,
      ...commerceResources.en.translation,
    },
  },
  de: {
    translation: {
      ...resources.de.translation,
      ...commerceResources.de.translation,
    },
  },
};

function getInitialLanguage() {
  try {
    const stored = window.localStorage.getItem("nova-language");

    if (stored === "de" || stored === "en") {
      return stored;
    }
  } catch {
    // Storage may be unavailable in some browser environments.
  }

  return "en";
}

i18n.use(initReactI18next).init({
  resources: mergedResources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "de"],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
  }

  try {
    window.localStorage.setItem("nova-language", language);
  } catch {
    // The selected language still works for the current session.
  }
});

export default i18n;
