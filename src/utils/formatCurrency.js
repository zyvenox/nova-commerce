export function formatEuro(amount, language = "en") {
  const locale = language === "de" ? "de-DE" : "en-IE";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(Number(amount) || 0);
}
