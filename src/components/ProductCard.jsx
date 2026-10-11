import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Plus, ArrowUpRight } from "lucide-react";

import { formatEuro } from "../utils/formatCurrency";
import "./ProductCard.css";

function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  function openDetails() {
    navigate(`/product/${product.id}`);
  }

  const categoryLabel = t(
    `categories.${String(product.category).toLowerCase()}`,
    { defaultValue: product.category },
  );

  const badgeLabel =
    product.badge === "SPECIAL PRICE"
      ? t("product.specialPrice")
      : product.badge;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        {product.badge && <span className="product-badge">{badgeLabel}</span>}

        <button
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          type="button"
          aria-label={
            isFavorite
              ? t("status.removedFromWishlist")
              : t("status.savedToWishlist")
          }
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(product)}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <button
          className="quick-add-button"
          type="button"
          onClick={() => onAddToCart(product)}
        >
          <Plus size={16} />
          <span>{t("product.addToBag")}</span>
        </button>
      </div>

      <div className="product-info">
        <div className="product-meta">
          <span>{categoryLabel}</span>
          <span>{product.color}</span>
        </div>

        <button
          className="product-title-link"
          type="button"
          onClick={openDetails}
          aria-label={t("product.viewDetails", {
            name: product.name,
          })}
        >
          <span>{product.name}</span>
          <ArrowUpRight size={16} />
        </button>

        <div className="product-price">
          <span>{formatEuro(product.price, i18n.resolvedLanguage)}</span>

          {product.oldPrice && (
            <del>{formatEuro(product.oldPrice, i18n.resolvedLanguage)}</del>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
