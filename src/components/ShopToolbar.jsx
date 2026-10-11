import { useRef } from "react";
import { Check, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import "./ShopToolbar.css";

function ShopToolbar({
  categories,
  activeCategory,
  onCategoryChange,
  showFavorites,
  sortBy,
  onSortChange,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onApplyPriceFilter,
  onResetPriceFilter,
  hasPriceFilter,
  priceFilterError,
  resultCount,
  shownCount,
  onLoadMore,
  hasMore,
}) {
  const { t } = useTranslation();
  const pricePanelRef = useRef(null);

  function handlePriceSubmit(event) {
    const success = onApplyPriceFilter(event);

    if (success && pricePanelRef.current) {
      pricePanelRef.current.open = false;
    }
  }

  function handlePriceReset() {
    onResetPriceFilter();

    if (pricePanelRef.current) {
      pricePanelRef.current.open = false;
    }
  }

  const countLabel =
    resultCount === 1 ? t("catalog.piece") : t("catalog.piecePlural");

  return (
    <div className="catalog-controls">
      <div className="catalog-toolbar">
        <div
          className="catalog-category-list"
          role="group"
          aria-label={t("nav.collections")}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`catalog-category-button ${
                activeCategory === category && !showFavorites ? "is-active" : ""
              }`}
              type="button"
              aria-pressed={activeCategory === category && !showFavorites}
              onClick={() => onCategoryChange(category)}
            >
              {t(`categories.${category.toLowerCase()}`)}
            </button>
          ))}
        </div>

        <div className="catalog-actions">
          <details className="catalog-price-dropdown" ref={pricePanelRef}>
            <summary
              className={`catalog-price-summary ${
                hasPriceFilter ? "has-filter" : ""
              }`}
            >
              <SlidersHorizontal size={15} />
              <span>{t("catalog.price")}</span>

              {hasPriceFilter && <span className="catalog-price-active-dot" />}
            </summary>

            <form
              className="catalog-price-popover"
              onSubmit={handlePriceSubmit}
            >
              <div className="catalog-popover-heading">
                <strong>{t("catalog.rangeTitle")}</strong>
                <span>{t("catalog.currency")}</span>
              </div>

              <p>{t("catalog.rangeDescription")}</p>

              <div className="catalog-price-fields">
                <label className="catalog-price-input">
                  <span>{t("catalog.minimum")}</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0"
                    value={priceMin}
                    onChange={(event) => onPriceMinChange(event.target.value)}
                  />
                </label>

                <span className="catalog-price-separator">—</span>

                <label className="catalog-price-input">
                  <span>{t("catalog.maximum")}</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="Any"
                    value={priceMax}
                    onChange={(event) => onPriceMaxChange(event.target.value)}
                  />
                </label>
              </div>

              {priceFilterError && (
                <p className="catalog-price-error" role="alert">
                  {priceFilterError}
                </p>
              )}

              <div className="catalog-price-actions">
                <button
                  className="catalog-reset-button"
                  type="button"
                  onClick={handlePriceReset}
                >
                  {t("catalog.reset")}
                </button>

                <button className="catalog-apply-button" type="submit">
                  {t("catalog.apply")}
                </button>
              </div>
            </form>
          </details>

          <label className="catalog-sort-field">
            <span>{t("catalog.sortBy")}</span>

            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value)}
              aria-label={t("catalog.sortBy")}
            >
              <option value="featured">{t("catalog.featured")}</option>
              <option value="price-low">{t("catalog.priceLow")}</option>
              <option value="price-high">{t("catalog.priceHigh")}</option>
              <option value="rating">{t("catalog.rating")}</option>
              <option value="name">{t("catalog.name")}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="catalog-status-row">
        <div className="catalog-results-summary">
          {showFavorites && (
            <span className="catalog-wishlist-tag">
              <Check size={13} />
              {t("catalog.wishlist")}
            </span>
          )}

          {hasPriceFilter && (
            <span className="catalog-active-filter">
              {t("catalog.priceApplied")}
            </span>
          )}

          <span>
            {t("catalog.showing", {
              shown: shownCount,
              total: resultCount,
              countLabel,
            })}
          </span>
        </div>

        {hasMore && (
          <button
            className="catalog-load-more"
            type="button"
            onClick={onLoadMore}
          >
            {t("catalog.loadMore")}
          </button>
        )}
      </div>
    </div>
  );
}

export default ShopToolbar;
