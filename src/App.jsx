import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import ShopToolbar from "./components/ShopToolbar";

import useLocalStorage from "./hooks/useLocalStorage";
import useProducts from "./hooks/useProducts";

import "./App.css";

const categories = [
  {
    name: "Women",
    number: "01",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Men",
    number: "02",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Accessories",
    number: "03",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
  },
];

const categorySlugs = {
  Women: "women",
  Men: "men",
  Accessories: "accessories",
};

const slugCategories = {
  women: "Women",
  men: "Men",
  accessories: "Accessories",
};

const filters = ["All", "Women", "Men", "Accessories"];
const PAGE_SIZE = 8;

const validSortOptions = [
  "featured",
  "price-low",
  "price-high",
  "rating",
  "name",
];

function parsePriceParameter(value) {
  if (value === null || value.trim() === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number;
}

function App() {
  const { t } = useTranslation();

  const { products, isLoading, error, retry } = useProducts();

  const [cart, setCart] = useLocalStorage("nova-cart", []);
  const [wishlist, setWishlist] = useLocalStorage("nova-wishlist", []);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isCollectionPage = location.pathname.startsWith("/collections/");

  const currentSlug = isCollectionPage ? location.pathname.split("/")[2] : "";

  const activeCategory = slugCategories[currentSlug] || "All";

  const showFavorites = searchParams.get("view") === "wishlist";

  const query = searchParams.get("q") || "";

  const requestedSort = searchParams.get("sort");

  const sortBy = validSortOptions.includes(requestedSort)
    ? requestedSort
    : "featured";

  const rawMinParam = searchParams.get("min") ?? "";
  const rawMaxParam = searchParams.get("max") ?? "";

  const minPrice = parsePriceParameter(searchParams.get("min"));

  const maxPrice = parsePriceParameter(searchParams.get("max"));

  const requestedPage = Number(searchParams.get("page") || 1);

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage >= 1
      ? Math.min(requestedPage, 999)
      : 1;

  const [priceMinDraft, setPriceMinDraft] = useState(rawMinParam);

  const [priceMaxDraft, setPriceMaxDraft] = useState(rawMaxParam);

  const [priceFilterError, setPriceFilterError] = useState("");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  const validCart = Array.isArray(cart) ? cart : [];
  const validWishlist = Array.isArray(wishlist) ? wishlist : [];

  const cartCount = validCart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  const collectionInfo =
    categories.find((category) => category.name === activeCategory) ||
    categories[0];

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setPriceMinDraft(rawMinParam);
    setPriceMaxDraft(rawMaxParam);
    setPriceFilterError("");
  }, [rawMinParam, rawMaxParam]);

  useEffect(() => {
    if (!location.hash) return undefined;

    const sectionId = location.hash.slice(1);

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  function updateSearchParams(updates, options = {}) {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    const serialized = nextParams.toString();

    navigate(
      {
        pathname: location.pathname,
        search: serialized ? `?${serialized}` : "",
        hash: location.hash,
      },
      {
        replace: Boolean(options.replace),
      },
    );
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch = [
        product.name,
        product.category,
        product.color,
        product.brand,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

      const matchesWishlist =
        !showFavorites || validWishlist.includes(product.id);

      const matchesMinPrice = minPrice === null || product.price >= minPrice;

      const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesWishlist &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result.sort((a, b) => b.rating - a.rating || a.price - b.price);
        break;

      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "featured":
      default:
        break;
    }

    return result;
  }, [
    products,
    activeCategory,
    query,
    showFavorites,
    validWishlist,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const displayProducts = filteredProducts.slice(0, currentPage * PAGE_SIZE);

  const hasMore = displayProducts.length < filteredProducts.length;

  const hasPriceFilter = minPrice !== null || maxPrice !== null;

  function showToast(message) {
    setToast(message);
  }

  function selectCategory(category) {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("view");
    nextParams.delete("page");

    const slug = categorySlugs[category];
    const pathname = slug ? `/collections/${slug}` : "/";

    const serialized = nextParams.toString();

    setPriceFilterError("");

    navigate({
      pathname,
      search: serialized ? `?${serialized}` : "",
      hash: "#shop",
    });
  }

  function handleShowFavorites() {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("view", "wishlist");
    nextParams.delete("page");

    const serialized = nextParams.toString();

    navigate({
      pathname: "/",
      search: `?${serialized}`,
      hash: "#shop",
    });
  }

  function handleShopClick() {
    setPriceMinDraft("");
    setPriceMaxDraft("");
    setPriceFilterError("");

    navigate({
      pathname: "/",
      hash: "#shop",
    });
  }

  function handleQueryChange(value) {
    updateSearchParams(
      {
        q: value.trim() ? value : null,
        page: null,
      },
      { replace: true },
    );
  }

  function handleSortChange(value) {
    updateSearchParams({
      sort: value === "featured" ? null : value,
      page: null,
    });
  }

  function handleApplyPriceFilter(event) {
    event.preventDefault();
    setPriceFilterError("");

    const minText = priceMinDraft.trim();
    const maxText = priceMaxDraft.trim();

    const min = minText === "" ? null : Number(minText);
    const max = maxText === "" ? null : Number(maxText);

    if (min !== null && (!Number.isFinite(min) || min < 0)) {
      setPriceFilterError(t("catalog.invalidMinimum"));
      return false;
    }

    if (max !== null && (!Number.isFinite(max) || max < 0)) {
      setPriceFilterError(t("catalog.invalidMaximum"));
      return false;
    }

    if (min !== null && max !== null && min > max) {
      setPriceFilterError(t("catalog.invalidRange"));
      return false;
    }

    updateSearchParams({
      min: min === null ? null : min,
      max: max === null ? null : max,
      page: null,
    });

    return true;
  }

  function handleResetPriceFilter() {
    setPriceMinDraft("");
    setPriceMaxDraft("");
    setPriceFilterError("");

    updateSearchParams({
      min: null,
      max: null,
      page: null,
    });
  }

  function handleClearAllFilters() {
    setPriceMinDraft("");
    setPriceMaxDraft("");
    setPriceFilterError("");

    navigate({
      pathname: "/",
      hash: "#shop",
    });
  }

  function handleLoadMore() {
    updateSearchParams({
      page: String(currentPage + 1),
    });
  }

  function handleAddToCart(product) {
    setCart((currentCart) => {
      const items = Array.isArray(currentCart) ? currentCart : [];

      const existingItem = items.find((item) => item.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [...items, { ...product, quantity: 1 }];
    });

    showToast(
      t("status.addedToBag", {
        name: product.name,
      }),
    );
  }

  function handleToggleFavorite(product) {
    const alreadySaved = validWishlist.includes(product.id);

    setWishlist((currentWishlist) => {
      const items = Array.isArray(currentWishlist) ? currentWishlist : [];

      return alreadySaved
        ? items.filter((id) => id !== product.id)
        : [...items, product.id];
    });

    showToast(
      alreadySaved
        ? t("status.removedFromWishlist")
        : t("status.savedToWishlist"),
    );
  }

  function handleUpdateQuantity(productId, change) {
    setCart((currentCart) =>
      (Array.isArray(currentCart) ? currentCart : []).flatMap((item) => {
        if (item.id !== productId) return [item];

        const nextQuantity = (Number(item.quantity) || 1) + change;

        if (nextQuantity <= 0) return [];

        return [
          {
            ...item,
            quantity: nextQuantity,
          },
        ];
      }),
    );
  }

  function handleRemoveFromCart(productId) {
    setCart((currentCart) =>
      (Array.isArray(currentCart) ? currentCart : []).filter(
        (item) => item.id !== productId,
      ),
    );

    showToast(t("status.removedFromBag"));
  }

  function handleSubscribe(event) {
    event.preventDefault();

    showToast(t("status.subscribed"));
    event.currentTarget.reset();
  }

  function getCollectionTitle() {
    if (activeCategory === "Women") {
      return [t("collectionHero.womenLead"), t("collectionHero.womenEmphasis")];
    }

    if (activeCategory === "Men") {
      return [t("collectionHero.menLead"), t("collectionHero.menEmphasis")];
    }

    return [
      t("collectionHero.accessoriesLead"),
      t("collectionHero.accessoriesEmphasis"),
    ];
  }

  function getCollectionDescription() {
    if (activeCategory === "Women") {
      return t("collectionHero.womenDescription");
    }

    if (activeCategory === "Men") {
      return t("collectionHero.menDescription");
    }

    return t("collectionHero.accessoriesDescription");
  }

  const [collectionLead, collectionEmphasis] = getCollectionTitle();

  return (
    <div className="app-shell">
      <Navbar
        cartCount={cartCount}
        wishlistCount={validWishlist.length}
        query={query}
        onQueryChange={handleQueryChange}
        onOpenCart={() => setIsCartOpen(true)}
        onShowFavorites={handleShowFavorites}
        onNotice={showToast}
        isCollectionPage={isCollectionPage}
      />

      <main>
        {!isCollectionPage && <Hero onShopClick={handleShopClick} />}

        {!isCollectionPage && (
          <section className="category-section page-container" id="categories">
            <div className="section-heading category-heading">
              <div>
                <span className="section-eyebrow">
                  {t("home.categoryEyebrow")}
                </span>

                <h2>
                  {t("home.categoryTitle")}{" "}
                  <em>{t("home.categoryEmphasis")}</em>
                </h2>
              </div>

              <p>{t("home.categoryDescription")}</p>
            </div>

            <div className="category-grid">
              {categories.map((category) => (
                <button
                  className="category-card"
                  key={category.name}
                  type="button"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(20, 19, 16, 0.02) 20%, rgba(20, 19, 16, 0.55) 100%), url("${category.image}")`,
                  }}
                  onClick={() => selectCategory(category.name)}
                >
                  <span className="category-number">
                    COLLECTION / {category.number}
                  </span>

                  <span className="category-bottom">
                    <span>
                      <strong>
                        {t(`categories.${category.name.toLowerCase()}`)}
                      </strong>

                      <small>
                        {t(`home.${category.name.toLowerCase()}Description`)}
                      </small>
                    </span>

                    <span className="category-arrow">
                      <ArrowUpRight size={19} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {isCollectionPage && (
          <section
            className="collection-route-hero"
            style={{
              "--collection-image": `linear-gradient(90deg, rgba(24, 23, 20, 0.68), rgba(24, 23, 20, 0.1)), url("${collectionInfo.image}")`,
            }}
          >
            <div className="collection-route-hero-copy">
              <span className="collection-route-kicker">
                {t("home.collectionEyebrow")} / {collectionInfo.number}
              </span>

              <h1>
                {collectionLead} <em>{collectionEmphasis}</em>
              </h1>

              <p>{getCollectionDescription()}</p>

              <Link className="collection-route-link" to="/">
                {t("collectionHero.exploreAll")}
                <ArrowRight size={16} />
              </Link>
            </div>

            <span className="collection-route-number">
              {t("collectionHero.number", {
                number: collectionInfo.number,
              })}
            </span>
          </section>
        )}

        <section
          className={`shop-section ${
            isCollectionPage ? "collection-route-shop" : ""
          }`}
          id="shop"
        >
          <div className="page-container">
            <div className="section-heading shop-heading">
              <div>
                <span className="section-eyebrow">
                  {isCollectionPage
                    ? `${t(`categories.${activeCategory.toLowerCase()}`)} / ${t("home.collectionEyebrow")}`
                    : t("home.selectionEyebrow")}
                </span>

                <h2>
                  {isCollectionPage ? (
                    <>
                      {t("home.collectionTitle")}{" "}
                      <em>{t("home.collectionEmphasis")}</em>
                    </>
                  ) : (
                    <>
                      {t("home.shopTitle")} <em>{t("home.shopEmphasis")}</em>
                    </>
                  )}
                </h2>
              </div>

              <span className="product-count">
                {isLoading
                  ? t("catalog.loading")
                  : error
                    ? t("catalog.unavailable")
                    : `${String(filteredProducts.length).padStart(2, "0")} ${t("catalog.pieces")}`}
              </span>
            </div>

            {!isLoading && !error && (
              <ShopToolbar
                categories={filters}
                activeCategory={activeCategory}
                onCategoryChange={selectCategory}
                showFavorites={showFavorites}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                priceMin={priceMinDraft}
                priceMax={priceMaxDraft}
                onPriceMinChange={(value) => {
                  setPriceMinDraft(value);
                  setPriceFilterError("");
                }}
                onPriceMaxChange={(value) => {
                  setPriceMaxDraft(value);
                  setPriceFilterError("");
                }}
                onApplyPriceFilter={handleApplyPriceFilter}
                onResetPriceFilter={handleResetPriceFilter}
                hasPriceFilter={hasPriceFilter}
                priceFilterError={priceFilterError}
                resultCount={filteredProducts.length}
                shownCount={displayProducts.length}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              />
            )}

            {isLoading ? (
              <div className="empty-products" role="status">
                <span className="empty-products-symbol">N.</span>

                <h3>{t("status.loadingTitle")}</h3>

                <p>{t("status.loadingDescription")}</p>
              </div>
            ) : error ? (
              <div className="empty-products" role="alert">
                <span className="empty-products-symbol">N.</span>

                <h3>{t("status.errorTitle")}</h3>

                <p>{error}</p>

                <button
                  className="button-primary"
                  type="button"
                  onClick={retry}
                >
                  {t("status.retry")}
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="product-grid">
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={validWishlist.includes(product.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-products">
                <span className="empty-products-symbol">N.</span>

                <h3>
                  {showFavorites
                    ? t("catalog.noFavorites")
                    : t("catalog.noResults")}
                </h3>

                <p>
                  {showFavorites
                    ? t("catalog.emptyFavorites")
                    : t("catalog.emptyResults")}
                </p>

                <button
                  className="button-primary"
                  type="button"
                  onClick={handleClearAllFilters}
                >
                  {t("catalog.viewAll")}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            <div className="shop-bottom">
              <p>Fewer pieces. More possibilities.</p>

              <a href="#top">
                {t("home.backToTop")}
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {!isCollectionPage && (
          <>
            <section className="brand-story" id="story">
              <div className="story-image">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1300&q=85"
                  alt={t("footer.collection")}
                  loading="lazy"
                />

                <span className="story-image-label">
                  {t("footer.philosophy")}
                </span>
              </div>

              <div className="story-copy">
                <span className="section-eyebrow">
                  {t("home.storyEyebrow")}
                </span>

                <h2>
                  {t("home.storyLine1")}
                  <br />
                  {t("home.storyLine2")}
                  <br />
                  <em>{t("home.storyLine3")}</em>
                </h2>

                <p>{t("home.storyDescription")}</p>

                <a className="story-link" href="#shop">
                  {t("home.storyLink")}
                  <ArrowRight size={16} />
                </a>

                <span className="story-monogram">N.</span>
              </div>
            </section>

            <section className="newsletter-section">
              <div className="newsletter-inner">
                <span className="section-eyebrow">
                  {t("home.newsletterEyebrow")}
                </span>

                <h2>
                  {t("home.newsletterTitle")}{" "}
                  <em>{t("home.newsletterEmphasis")}</em>
                </h2>

                <p>{t("home.newsletterDescription")}</p>

                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <label className="visually-hidden" htmlFor="newsletter-email">
                    {t("home.newsletterPlaceholder")}
                  </label>

                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder={t("home.newsletterPlaceholder")}
                    required
                  />

                  <button
                    type="submit"
                    aria-label={t("home.newsletterSubscribe")}
                  >
                    <ArrowRight size={19} />
                  </button>
                </form>

                <small className="newsletter-note">
                  {t("home.newsletterNote")}
                </small>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-main page-container">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">N</span>

            <span className="brand-copy">
              <strong>NOVA</strong>
              <small>ATELIER</small>
            </span>
          </Link>

          <p>
            {t("home.footerLine1")}
            <br />
            {t("home.footerLine2")}
          </p>

          <div className="footer-links">
            <Link to="/#shop">{t("home.footerShop")}</Link>
            <Link to="/#categories">{t("home.footerCollections")}</Link>
            <Link to="/#story">{t("home.footerStory")}</Link>
          </div>

          <a
            className="back-to-top"
            href={isCollectionPage ? "/#top" : "#top"}
            aria-label={t("home.backToTop")}
            onClick={(event) => {
              if (isCollectionPage) {
                event.preventDefault();

                navigate({
                  pathname: "/",
                  hash: "#top",
                });
              }
            }}
          >
            <ArrowUpRight size={19} />
          </a>
        </div>

        <div className="footer-bottom page-container">
          <span>{t("home.footerCopyright")}</span>
          <span>{t("home.footerIndependent")}</span>
          <span>{t("home.footerMade")}</span>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        items={validCart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />

      {toast && (
        <div className="toast-message" role="status" aria-live="polite">
          <Check size={17} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
