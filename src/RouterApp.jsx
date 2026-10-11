import { Link, Route, Routes } from "react-router-dom";

import App from "./App.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import DocumentMeta from "./components/DocumentMeta.jsx";

function NotFound() {
  return (
    <main className="product-not-found">
      <span className="section-eyebrow">NOVA ATELIER</span>

      <h1>Somewhere beyond the collection.</h1>

      <p>The page you're looking for isn't available.</p>

      <Link className="button-primary" to="/">
        Return to the shop
      </Link>
    </main>
  );
}

export default function RouterApp() {
  return (
    <>
      <DocumentMeta />

      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/collections/women" element={<App />} />
        <Route path="/collections/men" element={<App />} />
        <Route path="/collections/accessories" element={<App />} />

        <Route path="/product/:productId" element={<ProductDetails />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/collections/*" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
