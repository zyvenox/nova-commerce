
const API_URL = "https://dummyjson.com/products";

const FASHION_CATEGORIES = new Set([
  "tops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "sunglasses",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
]);

function getStoreCategory(category) {
  if (["tops", "womens-dresses", "womens-shoes"].includes(category)) {
    return "Women";
  }

  if (["mens-shirts", "mens-shoes"].includes(category)) {
    return "Men";
  }

  return "Accessories";
}

function normalizeProduct(raw) {
  const price = Number(raw.price) || 0;
  const discount = Number(raw.discountPercentage) || 0;

  const oldPrice =
    discount > 0 && discount < 100
      ? Number((price / (1 - discount / 100)).toFixed(2))
      : null;

  return {
    id: raw.id,
    name: raw.title,
    description: raw.description || "A considered NOVA essential.",
    category: getStoreCategory(raw.category),
    apiCategory: raw.category,
    price,
    oldPrice,
    badge: discount >= 10 ? "SPECIAL PRICE" : null,
    color: raw.color || "Natural",
    image: raw.images?.[0] || raw.thumbnail || "",
    images: Array.isArray(raw.images) ? raw.images : [],
    brand: raw.brand || "NOVA Atelier",
    rating: Number(raw.rating) || 0,
    stock: Number(raw.stock) || 0,
    discountPercentage: discount,
  };
}

async function requestJson(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Product service returned an error (${response.status}).`);
  }

  return response.json();
}

export async function fetchProducts({ signal } = {}) {
  const fields = [
    "id",
    "title",
    "description",
    "category",
    "price",
    "discountPercentage",
    "rating",
    "stock",
    "brand",
    "thumbnail",
    "images",
  ].join(",");

  const data = await requestJson(
    `${API_URL}?limit=0&select=${fields}`,
    signal
  );

  if (!Array.isArray(data.products)) {
    throw new Error("The product list has an unexpected format.");
  }

  return data.products
    .filter((product) => FASHION_CATEGORIES.has(product.category))
    .map(normalizeProduct);
}

export async function fetchProductById(id, { signal } = {}) {
  const data = await requestJson(
    `${API_URL}/${encodeURIComponent(id)}`,
    signal
  );

  if (!FASHION_CATEGORIES.has(data.category)) {
    return null;
  }

  return normalizeProduct(data);
}
