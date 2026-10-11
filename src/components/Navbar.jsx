import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Heart, ShoppingBag, Menu, X, UserRound } from "lucide-react";

import "./Navbar.css";

function Navbar({
  cartCount,
  wishlistCount,
  query,
  onQueryChange,
  onOpenCart,
  onShowFavorites,
  onNotice,
  isCollectionPage = false,
}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLanguage = i18n.resolvedLanguage?.startsWith("de") ? "de" : "en";

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function toggleLanguage() {
    const nextLanguage = currentLanguage === "en" ? "de" : "en";
    i18n.changeLanguage(nextLanguage);
  }

  function handleSectionNavigation(event, section) {
    closeMobileMenu();

    if (!isCollectionPage) return;

    event.preventDefault();

    navigate({
      pathname: "/",
      hash: `#${section}`,
    });
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    document.getElementById("shop")?.scrollIntoView({
      behavior: "smooth",
    });

    setSearchOpen(false);
    setMobileOpen(false);
  }

  return (
    <>
      <div className="announcement-bar">
        <p>
          {t("announcement.tagline")}
          <span>{t("announcement.shipping")}</span>
        </p>
      </div>

      <header className="site-header">
        <div className="navbar-shell">
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            className="brand"
            to={isCollectionPage ? "/" : "#top"}
            aria-label="NOVA Atelier home"
            onClick={closeMobileMenu}
          >
            <span className="brand-mark">N</span>

            <span className="brand-copy">
              <strong>NOVA</strong>
              <small>ATELIER</small>
            </span>
          </Link>

          <nav
            className={`main-nav ${mobileOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a
              href={isCollectionPage ? "/#shop" : "#shop"}
              onClick={(event) => handleSectionNavigation(event, "shop")}
            >
              {t("nav.shop")}
            </a>

            <a
              href={isCollectionPage ? "/#categories" : "#categories"}
              onClick={(event) => handleSectionNavigation(event, "categories")}
            >
              {t("nav.collections")}
            </a>

            <a
              href={isCollectionPage ? "/#story" : "#story"}
              onClick={(event) => handleSectionNavigation(event, "story")}
            >
              {t("nav.story")}
            </a>
          </nav>

          <div className="nav-actions">
            <button
              className={`nav-icon-button ${searchOpen ? "is-active" : ""}`}
              type="button"
              aria-label={searchOpen ? "Close search" : t("nav.search")}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <button
              className="nav-icon-button account-button"
              type="button"
              aria-label={t("nav.account")}
              onClick={() => onNotice(t("nav.accountComingSoon"))}
            >
              <UserRound size={20} />
            </button>

            <button
              className="nav-icon-button wishlist-nav-button"
              type="button"
              aria-label={t("nav.wishlist")}
              onClick={onShowFavorites}
            >
              <Heart size={20} />

              {wishlistCount > 0 && (
                <span className="nav-count">{wishlistCount}</span>
              )}
            </button>

            <button
              className="nav-icon-button bag-nav-button"
              type="button"
              aria-label={t("nav.bag", { count: cartCount })}
              onClick={onOpenCart}
            >
              <ShoppingBag size={20} />

              {cartCount > 0 && <span className="nav-count">{cartCount}</span>}
            </button>

            <button
              className="nav-icon-button language-switch-button"
              type="button"
              aria-label={
                currentLanguage === "en"
                  ? t("language.switchToGerman")
                  : t("language.switchToEnglish")
              }
              title={
                currentLanguage === "en"
                  ? t("language.switchToGerman")
                  : t("language.switchToEnglish")
              }
              onClick={toggleLanguage}
            >
              {currentLanguage === "en" ? "DE" : "EN"}
            </button>
          </div>
        </div>

        <form
          className={`search-panel ${searchOpen ? "is-open" : ""}`}
          onSubmit={handleSearchSubmit}
        >
          <Search size={19} />

          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t("nav.searchPlaceholder")}
            aria-label={t("nav.search")}
          />

          <button type="submit">{t("nav.searchButton")}</button>
        </form>
      </header>
    </>
  );
}

export default Navbar;
