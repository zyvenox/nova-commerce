import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import useLocalStorage from "../hooks/useLocalStorage";
import LanguageSwitch from "../components/LanguageSwitch";
import { formatEuro } from "../utils/formatCurrency";

import "./CartPage.css";

function CartPage() {
  const { t, i18n } = useTranslation();
  const [savedCart, setSavedCart] = useLocalStorage("nova-cart", []);

  const items = Array.isArray(savedCart) ? savedCart : [];

  const itemCount = items.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );

  const shipping = subtotal === 0 || subtotal >= 120 ? 0 : 6.9;
  const total = subtotal + shipping;

  function updateQuantity(productId, change) {
    setSavedCart((current) => {
      if (!Array.isArray(current)) return [];

      return current.flatMap((item) => {
        if (item.id !== productId) return [item];

        const quantity = (Number(item.quantity) || 1) + change;

        return quantity > 0 ? [{ ...item, quantity }] : [];
      });
    });
  }

  function removeItem(productId) {
    setSavedCart((current) =>
      Array.isArray(current)
        ? current.filter((item) => item.id !== productId)
        : [],
    );
  }

  const header = (
    <header className="store-page-header">
      <Link className="store-page-brand" to="/" aria-label="NOVA Atelier home">
        <span className="store-page-brand-mark">N</span>

        <span className="store-page-brand-copy">
          <strong>NOVA</strong>
          <small>ATELIER</small>
        </span>
      </Link>

      <div className="cart-page-header-note">
        <LanguageSwitch />

        {items.length > 0 && (
          <>
            <ShoppingBag size={17} />
            <span>
              {t("cartPage.headerItems", {
                count: itemCount,
              })}
            </span>
          </>
        )}
      </div>
    </header>
  );

  const footer = (
    <footer className="cart-page-footer">
      <span>{t("cartPage.copyright")}</span>
      <span>{t("cartPage.footerTagline")}</span>
    </footer>
  );

  if (items.length === 0) {
    return (
      <main className="cart-page">
        {header}

        <section className="cart-empty-page">
          <div className="cart-empty-page-icon">
            <ShoppingBag size={29} />
          </div>

          <span className="section-eyebrow">{t("cartPage.pageEyebrow")}</span>

          <h1>
            {t("cartPage.emptyTitleFirst")}{" "}
            <em>{t("cartPage.emptyTitleEmphasis")}</em>
          </h1>

          <p>{t("cartPage.emptyDescription")}</p>

          <Link className="button-primary" to="/">
            {t("common.continueShopping")}
            <ArrowRight size={16} />
          </Link>
        </section>

        {footer}
      </main>
    );
  }

  return (
    <main className="cart-page">
      {header}

      <div className="cart-page-main">
        <div className="cart-page-intro">
          <Link className="cart-back-link" to="/">
            <ArrowLeft size={15} />
            {t("common.continueShopping")}
          </Link>

          <span className="section-eyebrow">{t("cartPage.pageEyebrow")}</span>

          <h1>
            {t("cartPage.titleFirst")} <em>{t("cartPage.titleEmphasis")}</em>
          </h1>

          <p>{t("cartPage.description")}</p>
        </div>

        <div className="cart-page-layout">
          <section
            className="cart-page-items"
            aria-label={t("cartPage.productColumn")}
          >
            <div className="cart-list-heading">
              <span>{t("cartPage.productColumn")}</span>
              <span>{t("cartPage.subtotalColumn")}</span>
            </div>

            {items.map((item) => (
              <article className="cart-page-item" key={item.id}>
                <Link
                  className="cart-page-item-image"
                  to={`/product/${item.baseProductId ?? item.id}`}
                  aria-label={item.name}
                >
                  <img src={item.image} alt={item.name} />
                </Link>

                <div className="cart-page-item-info">
                  <span className="cart-page-item-category">
                    {t(`categories.${String(item.category).toLowerCase()}`, {
                      defaultValue: item.category,
                    })}
                  </span>

                  <Link
                    className="cart-page-item-title"
                    to={`/product/${item.baseProductId ?? item.id}`}
                  >
                    {item.name}
                  </Link>

                  <span className="cart-page-item-option">
                    {t("cartPage.color", {
                      color: item.selectedColor || item.color || "Standard",
                    })}

                    {item.selectedSize &&
                      item.selectedSize !== "One Size" &&
                      ` · ${t("cartPage.size", {
                        size: item.selectedSize,
                      })}`}
                  </span>

                  <strong className="cart-page-item-price">
                    {formatEuro(item.price, i18n.resolvedLanguage)}
                  </strong>

                  <div className="cart-page-item-actions">
                    <div className="cart-page-quantity">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        aria-label={`${t("common.quantity")} -`}
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus size={13} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label={`${t("common.quantity")} +`}
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      className="cart-page-remove"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={14} />
                      {t("cartPage.remove")}
                    </button>
                  </div>
                </div>

                <strong className="cart-page-line-total">
                  {formatEuro(
                    Number(item.price) * Number(item.quantity),
                    i18n.resolvedLanguage,
                  )}
                </strong>
              </article>
            ))}

            <Link className="cart-keep-shopping" to="/">
              <ArrowLeft size={15} />
              {t("common.keepExploring")}
            </Link>
          </section>

          <aside className="cart-summary">
            <span className="section-eyebrow">
              {t("cartPage.summaryEyebrow")}
            </span>

            <h2>{t("cartPage.summaryTitle")}</h2>

            <div className="cart-summary-line">
              <span>{t("common.subtotal")}</span>
              <strong>{formatEuro(subtotal, i18n.resolvedLanguage)}</strong>
            </div>

            <div className="cart-summary-line">
              <span>{t("cartPage.shippingEstimated")}</span>

              <strong>
                {shipping === 0
                  ? t("cartPage.shippingFree")
                  : formatEuro(shipping, i18n.resolvedLanguage)}
              </strong>
            </div>

            {shipping > 0 && (
              <p className="shipping-hint">
                {t("cartPage.shippingRemaining", {
                  amount: formatEuro(120 - subtotal, i18n.resolvedLanguage),
                })}
              </p>
            )}

            <div className="cart-summary-total">
              <span>{t("common.total")}</span>
              <strong>{formatEuro(total, i18n.resolvedLanguage)}</strong>
            </div>

            <p className="cart-summary-disclaimer">
              {t("cartPage.shippingDisclaimer")}
            </p>

            <Link className="button-primary cart-checkout-link" to="/checkout">
              {t("cartPage.checkout")}
              <ArrowRight size={16} />
            </Link>

            <div className="cart-trust-note">
              <span>
                <ShoppingBag size={16} />
                {t("cartPage.trustedSelection")}
              </span>

              <span>
                <ArrowRight size={16} />
                {t("cartPage.trustedShopping")}
              </span>
            </div>
          </aside>
        </div>
      </div>

      {footer}
    </main>
  );
}

export default CartPage;
