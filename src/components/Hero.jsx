import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

function Hero({ onShopClick }) {
  const { t } = useTranslation();

  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          {t("hero.eyebrow")}
        </div>

        <h1>
          {t("hero.titleFirst")}
          <br />
          <em>{t("hero.titleSecond")}</em>
        </h1>

        <p className="hero-description">{t("hero.description")}</p>

        <div className="hero-buttons">
          <button
            className="button-primary"
            type="button"
            onClick={onShopClick}
          >
            {t("hero.explore")}
            <ArrowRight size={16} />
          </button>

          <a className="button-text-link" href="#story">
            {t("hero.philosophy")}
            <ArrowDownRight size={15} />
          </a>
        </div>

        <div className="hero-bottom">
          <div className="hero-avatars" aria-hidden="true">
            <span>A</span>
            <span>M</span>
            <span>L</span>
          </div>

          <p>
            <strong>{t("hero.socialTitle")}</strong>
            <br />
            {t("hero.socialText")}
          </p>
        </div>

        <span className="hero-index">01 / 03</span>
      </div>

      <div className="hero-visual">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=90"
          alt={t("hero.collection")}
        />

        <div className="hero-image-label">
          <span>{t("hero.collection")}</span>
          <span>{t("hero.edition")}</span>
        </div>

        <div className="hero-floating-card">
          <span className="floating-card-kicker">{t("hero.noteTitle")}</span>

          <p>{t("hero.note")}</p>

          <span className="floating-card-line" />
        </div>

        <div className="hero-side-note">{t("hero.sideNote")}</div>
      </div>
    </section>
  );
}

export default Hero;
