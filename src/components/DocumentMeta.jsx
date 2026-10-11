
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function DocumentMeta() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const language = i18n.resolvedLanguage?.startsWith("de")
    ? "de"
    : "en";

  const path = location.pathname;

  let title =
    language === "de"
      ? "NOVA Atelier — Bewusster Stil und Essentials"
      : "NOVA Atelier — Considered Style & Everyday Essentials";

  if (path.startsWith("/collections/")) {
    const slug = path.split("/")[2];

    const categoryMap = {
      women: "women",
      men: "men",
      accessories: "accessories",
    };

    const categoryKey = categoryMap[slug];

    if (categoryKey) {
      title = `${t(`categories.${categoryKey}`)} | NOVA Atelier`;
    }
  } else if (path.startsWith("/product/")) {
    title =
      language === "de"
        ? "Produktdetails | NOVA Atelier"
        : "Product Details | NOVA Atelier";
  } else if (path === "/cart") {
    title =
      language === "de"
        ? "Warenkorb | NOVA Atelier"
        : "Shopping Bag | NOVA Atelier";
  } else if (path === "/checkout") {
    title =
      language === "de"
        ? "Kasse | NOVA Atelier"
        : "Checkout | NOVA Atelier";
  }

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    document.title = title;
  }, [language, title]);

  return null;
}

export default DocumentMeta;
