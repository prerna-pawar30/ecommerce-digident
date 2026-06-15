/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from "../api/ApiService";
import ProductDetails from '../components/productDetail/product-by-id/ProductDetails';
import ProductTabs from '../components/productDetail/product-tabs/ProductTabs';
import RelatedProducts from '../components/shopSection/RelatedProduct';
import SEOHead from '../components/ui/SEOHead';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        // Reset product to null when ID changes to ensure we show the loader
        setProduct(null); 
        
        const res = await fetchProductById(productId);
        
        if (res?.data) {
          setProduct(res.data);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) getProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!token) {
      navigate("/login", { state: { from: location } });
      return;
    }
  };

  const productStructuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.shortDescription || `Buy ${product.name} at Digident`,
    "sku": product.sku || productId,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.[0]?.name || "Digident"
    },
    "category": product.category?.name || "Dental Products",
    "offers": {
      "@type": "Offer",
      "url": `https://shop.digident.in/productpage/${productId}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": (product.productStock > 0 || product.variants?.some(v => v.variantStock > 0))
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "Digident" }
    },
    "aggregateRating": product.ratingAvg > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.ratingAvg,
      "ratingCount": product.ratingCount || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined
  } : null;

  return (
    <div className="py-16 min-h-screen flex flex-col bg-white">
      {product && (
        <SEOHead
          title={`${product.name} - ${product.category?.name || "Dental Product"}`}
          description={product.shortDescription || `Buy ${product.name} at Digident. Premium ${product.category?.name || "dental product"} for digital dentistry. Fast delivery across India.`}
          canonicalPath={`/productpage/${productId}`}
          image={product.images?.[0]}
          type="product"
          structuredData={productStructuredData}
        />
      )}

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="pt-4 text-sm text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#E68736] transition-colors">Home</Link> 
            <span>/</span>
            <Link to="/all-products" className="hover:text-[#E68736] transition-colors">All Products</Link> 
            <span>/</span>
            <span className="font-medium text-gray-700 truncate max-w-[200px] md:max-w-none">
              {loading ? "Loading..." : product?.name || "Product"}
            </span>
          </nav>

          {/* LOGIC: Show loader if loading is true OR if product is null.
              This prevents the "Not Found" UI from flashing during the API transition.
          */}
          {loading || !product ? (
            <div className="h-96 flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="w-12 h-12 border-4 border-[#E68736] border-t-transparent rounded-full animate-spin"></div>
              <p className="animate-pulse">Fetching product details...</p>
            </div>
          ) : (
            <>
              {/* Main Product Info Section */}
              <ProductDetails 
                productData={product} 
                onAddToCart={handleAddToCart} 
              />

              {/* Description, Specs, and Reviews Tabs */}
              <ProductTabs productData={product} />

              {/* Related Products Section */}
              <div className="mt-12 mb-20">
                <RelatedProducts 
                  brandId={product.brand?.[0]?._id || product.brand?.[0]} 
                  currentProductId={productId} 
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductPage;