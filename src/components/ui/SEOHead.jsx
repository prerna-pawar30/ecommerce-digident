import { Helmet } from "react-helmet-async";

const BASE_URL = "https://shop.digident.in";
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const DEFAULT_TITLE = "Digident | Buy Digital Dental Products, CAD/CAM & Implant Components";
const DEFAULT_DESC = "Shop premium digital dental products at Digident. Explore CAD/CAM solutions, ScanBridge libraries, implant components, dental accessories, and advanced digital dentistry products.";

function SEOHead({
  title,
  description,
  canonicalPath = "",
  image,
  type = "website",
  structuredData,
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | Digident` : DEFAULT_TITLE;
  const metaDesc = description || DEFAULT_DESC;
  const metaImage = image || DEFAULT_IMAGE;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="Digident" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default SEOHead;
