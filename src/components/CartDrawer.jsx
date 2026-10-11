import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { formatEuro } from "../utils/formatCurrency";
import "./CartDrawer.css";

function CartDrawer({ isOpen, items, onClose, onUpdateQuantity, onRemove }) {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const validItems = Array.isArray(items) ? items : [];

  const itemCount = validItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  const subtotal = validItems.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );

  return (
    <div className="cart-layer">
      <button
        className="cart-backdrop"
        type="button"
        aria-label="Close shopping bag"
        onClick={onClose}
      />

      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="cart-header">
          <div>
            <span className="cart-kicker">{t("drawer.kicker")}</span>

            <h2 id="cart-title">
              {t("drawer.title")} <span>({itemCount})</span>
            </h2>
          </div>

          <button
            className="cart-close-button"
            type="button"
            aria-label="Close shopping bag"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        {validItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={26} />
            </div>

            <h3>{t("drawer.emptyTitle")}</h3>

            <p>{t("drawer.emptyDescription")}</p>

            <button
              className="button-primary cart-continue-button"
              type="button"
              onClick={onClose}
            >
              {t("drawer.explore")}
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {validItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-details">
                    <span className="cart-item-category">
                      {item.category} · {item.selectedColor || item.color}
                      {item.selectedSize &&
                        item.selectedSize !== "One Size" &&
                        ` · ${t("common.size")} ${item.selectedSize}`}
                    </span>

                    <h3>{item.name}</h3>

                    <strong>
                      {formatEuro(item.price, i18n.resolvedLanguage)}
                    </strong>

                    <div className="cart-item-bottom">
                      <div
                        className="quantity-control"
                        aria-label={`${t("common.quantity")}: ${item.quantity}`}
                      >
                        <button
                          type="button"
                          aria-label={t("drawer.decrease", {
                            name: item.name,
                          })}
                          disabled={item.quantity <= 1}
                          onClick={() => onUpdateQuantity(item.id, -1)}
                        >
                          <Minus size={13} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={t("drawer.increase", {
                            name: item.name,
                          })}
                          onClick={() => onUpdateQuantity(item.id, 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        className="remove-item-button"
                        type="button"
                        aria-label={t("drawer.remove", {
                          name: item.name,
                        })}
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>{t("common.subtotal")}</span>
                <strong>{formatEuro(subtotal, i18n.resolvedLanguage)}</strong>
              </div>

              <p>{t("drawer.shippingNote")}</p>

              <Link className="cart-full-bag-link" to="/cart" onClick={onClose}>
                {t("drawer.viewFullBag")}
              </Link>

              <Link
                className="button-primary cart-continue-button"
                to="/checkout"
                onClick={onClose}
              >
                {t("drawer.checkout")}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
