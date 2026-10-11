
import { useTranslation } from "react-i18next";
import "./LanguageSwitch.css";

function LanguageSwitch() {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage?.startsWith("de")
    ? "de"
    : "en";

  const nextLanguage = currentLanguage === "de" ? "en" : "de";

  return (
    <button
      className="standalone-language-switch"
      type="button"
      onClick={() => i18n.changeLanguage(nextLanguage)}
      aria-label={
        nextLanguage === "de"
          ? t("language.switchToGerman")
          : t("language.switchToEnglish")
      }
      title={
        nextLanguage === "de"
          ? t("language.switchToGerman")
          : t("language.switchToEnglish")
      }
    >
      {nextLanguage.toUpperCase()}
    </button>
  );
}

export default LanguageSwitch;
