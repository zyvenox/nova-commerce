import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

import useLocalStorage from "../hooks/useLocalStorage";
import LanguageSwitch from "../components/LanguageSwitch";
import { formatEuro } from "../utils/formatCurrency";

import "./CheckoutPage.css";

function CheckoutPage() {
  const { t, i18n } = useTranslation();

  const [savedCart, setSavedCart] = useLocalStorage("nova-cart", []);

  const items = Array.isArray(savedCart) ? savedCart : [];

  const [orderNumber, setOrderNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      country: "Germany",
      payment: "card-demo",
      terms: false,
    },
  });

  const subtotal = items.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );

  const shipping = subtotal === 0 || subtotal >= 120 ? 0 : 6.9;
  const total = subtotal + shipping;

  function submitOrder(formData) {
    if (items.length === 0) return;

    // Demo only: no contact data is sent or stored on a server.
    const reference = `NOVA-${Date.now().toString().slice(-6)}`;

    console.info("NOVA demo checkout completed", {
      reference,
      itemCount: items.length,
      total,
      paymentMethod: formData.payment,
    });

    setOrderNumber(reference);
    setSavedCart([]);
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

      <div className="checkout-secure-note">
        <LanguageSwitch />
        <LockKeyhole size={15} />
        <span>{t("checkout.secure")}</span>
      </div>
    </header>
  );

  const footer = (
    <footer className="cart-page-footer">
      <span>{t("cartPage.copyright")}</span>
      <span>{t("checkout.noPaymentFooter")}</span>
    </footer>
  );

  if (orderNumber) {
    return (
      <main className="checkout-page">
        {header}

        <section className="checkout-success">
          <div className="checkout-success-icon">
            <Check size={30} />
          </div>

          <span className="section-eyebrow">
            {t("checkout.successEyebrow")}
          </span>

          <h1>
            {t("checkout.successTitleFirst")}{" "}
            <em>{t("checkout.successTitleEmphasis")}</em>
          </h1>

          <p>{t("checkout.successDescription")}</p>

          <div className="checkout-reference">
            <span>{t("checkout.referenceLabel")}</span>
            <strong>{orderNumber}</strong>
          </div>

          <Link className="button-primary" to="/">
            {t("common.returnToShop")}
            <ArrowRight size={16} />
          </Link>
        </section>

        {footer}
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        {header}

        <section className="checkout-empty">
          <ShoppingBag size={30} />

          <h1>{t("checkout.emptyTitle")}</h1>

          <p>{t("checkout.emptyDescription")}</p>

          <Link className="button-primary" to="/">
            {t("hero.explore")}
            <ArrowRight size={16} />
          </Link>
        </section>

        {footer}
      </main>
    );
  }

  return (
    <main className="checkout-page">
      {header}

      <div className="checkout-main">
        <Link className="checkout-back-link" to="/cart">
          <ArrowLeft size={15} />
          {t("checkout.backToBag")}
        </Link>

        <div className="checkout-heading">
          <span className="section-eyebrow">{t("checkout.eyebrow")}</span>

          <h1>
            {t("checkout.titleFirst")} <em>{t("checkout.titleEmphasis")}</em>
          </h1>

          <p>{t("checkout.description")}</p>
        </div>

        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={handleSubmit(submitOrder)}
            noValidate
          >
            <section className="checkout-form-section">
              <div className="checkout-section-heading">
                <span className="checkout-section-number">01</span>

                <div>
                  <h2>{t("checkout.contactTitle")}</h2>
                  <p>{t("checkout.contactDescription")}</p>
                </div>
              </div>

              <div className="checkout-field-grid">
                <label className="checkout-field full-width">
                  <span>{t("checkout.email")}</span>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email", {
                      required: t("checkout.errors.emailRequired"),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("checkout.errors.emailInvalid"),
                      },
                    })}
                  />

                  {errors.email && (
                    <small className="checkout-error">
                      {errors.email.message}
                    </small>
                  )}
                </label>

                <label className="checkout-field">
                  <span>{t("checkout.firstName")}</span>

                  <input
                    type="text"
                    placeholder={t("checkout.firstName")}
                    autoComplete="given-name"
                    aria-invalid={Boolean(errors.firstName)}
                    {...register("firstName", {
                      required: t("checkout.errors.firstNameRequired"),
                      minLength: {
                        value: 2,
                        message: t("checkout.errors.firstNameShort"),
                      },
                    })}
                  />

                  {errors.firstName && (
                    <small className="checkout-error">
                      {errors.firstName.message}
                    </small>
                  )}
                </label>

                <label className="checkout-field">
                  <span>{t("checkout.lastName")}</span>

                  <input
                    type="text"
                    placeholder={t("checkout.lastName")}
                    autoComplete="family-name"
                    aria-invalid={Boolean(errors.lastName)}
                    {...register("lastName", {
                      required: t("checkout.errors.lastNameRequired"),
                      minLength: {
                        value: 2,
                        message: t("checkout.errors.lastNameShort"),
                      },
                    })}
                  />

                  {errors.lastName && (
                    <small className="checkout-error">
                      {errors.lastName.message}
                    </small>
                  )}
                </label>

                <label className="checkout-field full-width">
                  <span>
                    {t("checkout.phone")} <small>{t("common.optional")}</small>
                  </span>

                  <input
                    type="tel"
                    placeholder="+49 000 000000"
                    autoComplete="tel"
                    {...register("phone", {
                      maxLength: {
                        value: 25,
                        message: t("checkout.errors.phoneLong"),
                      },
                    })}
                  />

                  {errors.phone && (
                    <small className="checkout-error">
                      {errors.phone.message}
                    </small>
                  )}
                </label>
              </div>
            </section>

            <section className="checkout-form-section">
              <div className="checkout-section-heading">
                <span className="checkout-section-number">02</span>

                <div>
                  <h2>{t("checkout.addressTitle")}</h2>
                  <p>{t("checkout.addressDescription")}</p>
                </div>
              </div>

              <div className="checkout-field-grid">
                <label className="checkout-field full-width">
                  <span>{t("checkout.street")}</span>

                  <input
                    type="text"
                    placeholder={t("checkout.street")}
                    autoComplete="street-address"
                    aria-invalid={Boolean(errors.address)}
                    {...register("address", {
                      required: t("checkout.errors.addressRequired"),
                      minLength: {
                        value: 5,
                        message: t("checkout.errors.addressShort"),
                      },
                    })}
                  />

                  {errors.address && (
                    <small className="checkout-error">
                      {errors.address.message}
                    </small>
                  )}
                </label>

                <label className="checkout-field">
                  <span>{t("checkout.postalCode")}</span>

                  <input
                    type="text"
                    placeholder="10115"
                    autoComplete="postal-code"
                    aria-invalid={Boolean(errors.postalCode)}
                    {...register("postalCode", {
                      required: t("checkout.errors.postalRequired"),
                      minLength: {
                        value: 3,
                        message: t("checkout.errors.postalShort"),
                      },
                    })}
                  />

                  {errors.postalCode && (
                    <small className="checkout-error">
                      {errors.postalCode.message}
                    </small>
                  )}
                </label>

                <label className="checkout-field">
                  <span>{t("checkout.city")}</span>

                  <input
                    type="text"
                    placeholder={t("checkout.city")}
                    autoComplete="address-level2"
                    aria-invalid={Boolean(errors.city)}
                    {...register("city", {
                      required: t("checkout.errors.cityRequired"),
                      minLength: {
                        value: 2,
                        message: t("checkout.errors.cityShort"),
                      },
                    })}
                  />

                  {errors.city && (
                    <small className="checkout-error">
                      {errors.city.message}
                    </small>
                  )}
                </label>

                <label className="checkout-field full-width">
                  <span>{t("checkout.country")}</span>

                  <select
                    autoComplete="country-name"
                    aria-invalid={Boolean(errors.country)}
                    {...register("country", {
                      required: t("checkout.errors.countryRequired"),
                    })}
                  >
                    <option value="Germany">
                      {t("checkout.countryGermany")}
                    </option>

                    <option value="Austria">
                      {t("checkout.countryAustria")}
                    </option>

                    <option value="Switzerland">
                      {t("checkout.countrySwitzerland")}
                    </option>

                    <option value="Netherlands">
                      {t("checkout.countryNetherlands")}
                    </option>

                    <option value="France">
                      {t("checkout.countryFrance")}
                    </option>

                    <option value="Belgium">
                      {t("checkout.countryBelgium")}
                    </option>

                    <option value="Other">{t("checkout.countryOther")}</option>
                  </select>

                  {errors.country && (
                    <small className="checkout-error">
                      {errors.country.message}
                    </small>
                  )}
                </label>
              </div>
            </section>

            <section className="checkout-form-section">
              <div className="checkout-section-heading">
                <span className="checkout-section-number">03</span>

                <div>
                  <h2>{t("checkout.paymentTitle")}</h2>
                  <p>{t("checkout.paymentDescription")}</p>
                </div>
              </div>

              <div className="checkout-payment-options">
                <label className="checkout-payment-option">
                  <input
                    type="radio"
                    value="card-demo"
                    {...register("payment", {
                      required: t("checkout.errors.paymentRequired"),
                    })}
                  />

                  <span className="checkout-radio-mark" />

                  <span className="checkout-payment-copy">
                    <strong>{t("checkout.creditCard")}</strong>
                    <small>{t("checkout.cardNote")}</small>
                  </span>

                  <span className="payment-card-symbols">VISA · MC</span>
                </label>

                <label className="checkout-payment-option">
                  <input
                    type="radio"
                    value="paypal-demo"
                    {...register("payment", {
                      required: t("checkout.errors.paymentRequired"),
                    })}
                  />

                  <span className="checkout-radio-mark" />

                  <span className="checkout-payment-copy">
                    <strong>{t("checkout.paypal")}</strong>
                    <small>{t("checkout.paypalNote")}</small>
                  </span>
                </label>
              </div>

              {errors.payment && (
                <small className="checkout-error">
                  {errors.payment.message}
                </small>
              )}
            </section>

            <label className="checkout-terms">
              <input
                type="checkbox"
                {...register("terms", {
                  required: t("checkout.errors.termsRequired"),
                })}
              />

              <span>{t("checkout.acceptTerms")}</span>
            </label>

            {errors.terms && (
              <small className="checkout-error checkout-terms-error">
                {errors.terms.message}
              </small>
            )}

            <button
              className="button-primary checkout-submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              <LockKeyhole size={16} />
              {t("checkout.submit")}
              <ArrowRight size={16} />
            </button>

            <p className="checkout-demo-disclaimer">
              {t("checkout.disclaimer")}
            </p>
          </form>

          <aside className="checkout-summary">
            <span className="section-eyebrow">
              {t("checkout.summaryEyebrow")}
            </span>

            <h2>{t("checkout.summaryTitle")}</h2>

            <div className="checkout-summary-items">
              {items.map((item) => (
                <div className="checkout-summary-item" key={item.id}>
                  <div className="checkout-summary-image">
                    <img src={item.image} alt={item.name} />
                    <span>{item.quantity}</span>
                  </div>

                  <div className="checkout-summary-item-info">
                    <strong>{item.name}</strong>

                    <span>
                      {item.selectedColor || item.color}
                      {item.selectedSize &&
                        item.selectedSize !== "One Size" &&
                        ` · ${item.selectedSize}`}
                    </span>
                  </div>

                  <strong className="checkout-summary-item-price">
                    {formatEuro(
                      Number(item.price) * Number(item.quantity),
                      i18n.resolvedLanguage,
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary-line">
              <span>{t("common.subtotal")}</span>

              <strong>{formatEuro(subtotal, i18n.resolvedLanguage)}</strong>
            </div>

            <div className="checkout-summary-line">
              <span>{t("common.shipping")}</span>

              <strong>
                {shipping === 0
                  ? t("cartPage.shippingFree")
                  : formatEuro(shipping, i18n.resolvedLanguage)}
              </strong>
            </div>

            <div className="checkout-summary-total">
              <span>{t("common.total")}</span>

              <strong>{formatEuro(total, i18n.resolvedLanguage)}</strong>
            </div>

            <p className="checkout-summary-note">{t("checkout.demoPrices")}</p>
          </aside>
        </div>
      </div>

      {footer}
    </main>
  );
}

export default CheckoutPage;
