import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import useLocalStorage from "../hooks/useLocalStorage";
import { fetchProductById } from "../services/ProductService";
import { formatEuro } from "../utils/formatCurrency";
import LanguageSwitch from "../components/LanguageSwitch";

import "./ProductDetails.css";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [savedCart, setSavedCart] = useLocalStorage("nova-cart", []);
  const [savedWishlist, setSavedWishlist] = useLocalStorage(
    "nova-wishlist",
    [],
  );

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Natural");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");

  const validCart = Array.isArray(savedCart) ? savedCart : [];
  const validWishlist = Array.isArray(savedWishlist) ? savedWishlist : [];

  const isFavorite = product ? validWishlist.includes(product.id) : false;

  const cartCount = validCart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  const sizes =
    product?.category === "Accessories"
      ? ["One Size"]
      : ["XS", "S", "M", "L", "XL"];

  const colors = product
    ? [...new Set([product.color || "Natural", "Black", "Ivory"])]
    : [];

  const colorValues = {
    Natural: "#d4c0a5",
    Sand: "#d4c0a5",
    Ivory: "#eee9df",
    Chocolate: "#684633",
    Camel: "#b99974",
    Oatmeal: "#c7b9a4",
    Black: "#292927",
    Stone: "#a7a298",
    Olive: "#77785c",
    White: "#f8f6f0",
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setIsLoading(true);
      setLoadError("");
      setProduct(null);

      try {
        const result = await fetchProductById(productId, {
          signal: controller.signal,
        });

        setProduct(result);
      } catch (error) {
        if (error.name === "AbortError") return;

        setLoadError(t("productDetails.errorDescription"));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => controller.abort();
  }, [productId, retryCount, t]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!product) return;

    setSelectedSize(product.category === "Accessories" ? "One Size" : "M");
    setSelectedColor(product.color || "Natural");
    setQuantity(1);
  }, [product?.id]);

  function handleAddToCart() {
    if (product.stock <= 0) {
      setNotice(t("productDetails.unavailable"));
      return;
    }

    const cartItems = Array.isArray(savedCart) ? savedCart : [];
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;

    const existingItem = cartItems.find((item) => item.id === cartItemId);

    const currentQuantity = existingItem
      ? Number(existingItem.quantity) || 0
      : 0;

    if (product.stock > 0 && currentQuantity + quantity > product.stock) {
      setNotice(t("productDetails.unavailable"));
      return;
    }

    const updatedCart = existingItem
      ? cartItems.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: currentQuantity + quantity,
              }
            : item,
        )
      : [
          ...cartItems,
          {
            ...product,
            id: cartItemId,
            baseProductId: product.id,
            selectedSize,
            selectedColor,
            quantity,
          },
        ];

    setSavedCart(updatedCart);
    setNotice(t("productDetails.added", { name: product.name }));
  }

  function handleToggleFavorite() {
    if (!product) return;

    const alreadySaved = validWishlist.includes(product.id);

    setSavedWishlist(
      alreadySaved
        ? validWishlist.filter((id) => id !== product.id)
        : [...validWishlist, product.id],
    );

    setNotice(
      alreadySaved
        ? t("productDetails.favoriteRemoved")
        : t("productDetails.favoriteAdded"),
    );
  }

  if (isLoading) {
    return (
      <main className="product-not-found" role="status">
        <LanguageSwitch />
        <span className="section-eyebrow">NOVA ATELIER</span>
        <h1>{t("productDetails.loadingTitle")}</h1>
        <p>{t("productDetails.loadingDescription")}</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="product-not-found" role="alert">
        <LanguageSwitch />
        <span className="section-eyebrow">NOVA ATELIER</span>
        <h1>{t("productDetails.errorTitle")}</h1>
        <p>{loadError}</p>

        <button
          className="button-primary"
          type="button"
          onClick={() => setRetryCount((current) => current + 1)}
        >
          {t("common.tryAgain")}
          <ArrowRight size={16} />
        </button>

        <Link className="detail-continue-link" to="/">
          {t("common.returnToShop")}
        </Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-not-found">
        <LanguageSwitch />
        <span className="section-eyebrow">NOVA ATELIER</span>
        <h1>{t("productDetails.missingTitle")}</h1>
        <p>{t("productDetails.missingDescription")}</p>

        <Link className="button-primary" to="/">
          {t("common.returnToShop")}
        </Link>
      </main>
    );
  }

  return (
    <div className="product-detail-page">
      <header className="detail-header">
        <Link className="detail-back" to="/">
          <ArrowLeft size={17} />
          <span>{t("common.backToShop")}</span>
        </Link>

        <Link className="detail-brand" to="/" aria-label="NOVA Atelier home">
          <span className="detail-brand-mark">N</span>

          <span>
            <strong>NOVA</strong>
            <small>ATELIER</small>
          </span>
        </Link>

        <div className="detail-header-actions">
          <LanguageSwitch />

          <button
            className="detail-bag-button"
            type="button"
            onClick={() => navigate("/cart")}
            aria-label={`Bag (${cartCount})`}
          >
            <ShoppingBag size={19} />
            <span>
              {t("drawer.title")} ({cartCount})
            </span>
          </button>
        </div>
      </header>

      <main className="detail-main">
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">{t("common.home")}</Link>
          <span>/</span>
          <Link to="/">
            {t(`categories.${product.category.toLowerCase()}`)}
          </Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="detail-layout">
          <section className="detail-gallery" aria-label={product.name}>
            <div className="detail-image-frame">
              <img src={product.image} alt={product.name} />

              {product.badge && (
                <span className="detail-image-badge">
                  {product.badge === "SPECIAL PRICE"
                    ? t("productDetails.specialPrice")
                    : product.badge}
                </span>
              )}

              <span className="detail-image-index">
                N° {String(product.id).padStart(2, "0")}
              </span>
            </div>

            <div className="detail-image-caption">
              <span>THE NOVA SELECTION</span>
              <span>{t("productDetails.imageCaption")}</span>
            </div>
          </section>

          <section className="detail-information">
            <div className="detail-product-heading">
              <span className="section-eyebrow">
                {t("productDetails.categoryEyebrow", {
                  category: t(
                    `categories.${product.category.toLowerCase()}`,
                  ).toUpperCase(),
                })}
              </span>

              <button
                className={`detail-favorite ${isFavorite ? "is-favorite" : ""}`}
                type="button"
                aria-label={
                  isFavorite
                    ? t("productDetails.favoriteRemoved")
                    : t("productDetails.favoriteAdded")
                }
                aria-pressed={isFavorite}
                onClick={handleToggleFavorite}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            <h1>{product.name}</h1>

            <div className="detail-price">
              <strong>
                {formatEuro(product.price, i18n.resolvedLanguage)}
              </strong>

              {product.oldPrice && (
                <del>{formatEuro(product.oldPrice, i18n.resolvedLanguage)}</del>
              )}

              {product.oldPrice && (
                <span className="detail-sale-label">
                  {t("productDetails.specialPrice")}
                </span>
              )}
            </div>

            {product.rating > 0 && (
              <p className="detail-description">
                {t("productDetails.rating", {
                  rating: product.rating.toFixed(1),
                })}
                {product.brand ? ` · ${product.brand}` : ""}
              </p>
            )}

            <p className="detail-description">{product.description}</p>

            <div className="detail-divider" />

            <section className="detail-option">
              <div className="detail-option-heading">
                <span>{t("productDetails.color")}</span>
                <strong>{selectedColor}</strong>
              </div>

              <div className="detail-color-list">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`detail-color-swatch ${
                      selectedColor === color ? "is-selected" : ""
                    }`}
                    style={{
                      "--swatch-color": colorValues[color] || "#c5b8a3",
                    }}
                    type="button"
                    aria-label={`${t("productDetails.color")}: ${color}`}
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && <Check size={15} />}
                  </button>
                ))}
              </div>

              <p className="detail-stock-note">
                {product.stock > 0
                  ? t("productDetails.stockCount", {
                      count: product.stock,
                    })
                  : t("productDetails.unavailable")}
              </p>
            </section>

            <section className="detail-option">
              <div className="detail-option-heading">
                <span>{t("productDetails.size")}</span>

                {product.category !== "Accessories" && (
                  <button
                    className="size-guide-button"
                    type="button"
                    onClick={() =>
                      setNotice(t("productDetails.sizeGuideMessage"))
                    }
                  >
                    {t("productDetails.sizeGuide")}
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

              <div className="detail-size-list">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`detail-size-button ${
                      selectedSize === size ? "is-selected" : ""
                    }`}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            <section className="detail-option">
              <div className="detail-option-heading">
                <span>{t("common.quantity")}</span>
              </div>

              <div className="detail-purchase-row">
                <div className="detail-quantity">
                  <button
                    type="button"
                    aria-label={`${t("common.quantity")} -`}
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                  >
                    <Minus size={14} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    aria-label={`${t("common.quantity")} +`}
                    disabled={quantity >= Math.min(product.stock, 10)}
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(Math.min(product.stock, 10), current + 1),
                      )
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="detail-availability">
                  <span />
                  {product.stock > 0
                    ? t("productDetails.available")
                    : t("productDetails.unavailable")}
                </span>
              </div>
            </section>

            <button
              className="detail-add-button"
              type="button"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              <span>
                {product.stock > 0
                  ? t("productDetails.addToBag")
                  : t("productDetails.unavailable")}
              </span>
              <strong>
                {formatEuro(product.price * quantity, i18n.resolvedLanguage)}
              </strong>
            </button>

            <div className="detail-benefits">
              <div>
                <Truck size={19} />
                <span>
                  <strong>{t("productDetails.shippingTitle")}</strong>
                  <small>{t("productDetails.shippingDescription")}</small>
                </span>
              </div>

              <div>
                <RotateCcw size={19} />
                <span>
                  <strong>{t("productDetails.returnsTitle")}</strong>
                  <small>{t("productDetails.returnsDescription")}</small>
                </span>
              </div>

              <div>
                <ShieldCheck size={19} />
                <span>
                  <strong>{t("productDetails.qualityTitle")}</strong>
                  <small>{t("productDetails.qualityDescription")}</small>
                </span>
              </div>
            </div>

            <Link className="detail-continue-link" to="/">
              {t("productDetails.continueExploring")}
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>

      <footer className="detail-footer">
        <span>© 2026 NOVA ATELIER</span>
        <span>CONSIDERED STYLE. EVERYDAY, ELEVATED.</span>
      </footer>

      {notice && (
        <div className="toast-message" role="status" aria-live="polite">
          <Check size={17} />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
