import { useState, useEffect, useRef } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  fetchCategories,
  fetchAllBrands,
  fetchBestSellingProducts,
  fetchBannersByStatus, 
  fetchActiveProducts
} from "../api/ApiService";

import Hero from "../components/shopSection/Hero";
import HotSelling from "../components/shopSection/HotSelling";
import Starbox from "../components/shopSection/Starbox";
import Menu from "../components/shopSection/Menu";
import Brand from "../components/shopSection/Brand";
import Categories from "../components/shopSection/Categories";
import RelatedProducts from "../components/shopSection/RelatedProduct";
import SEOHead from "../components/ui/SEOHead";

function Shop() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    categories: [],
    brands: [],
    hotSelling: [],
    banners: [],
    totalProducts: 0
  });

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [
          catRes,
          brandRes,
          bestRes,
          bannerRes,
          activeRes
        ] = await Promise.all([
          fetchCategories(),
          fetchAllBrands(),
          fetchBestSellingProducts(), // Returns direct array now: response.data?.data
          fetchBannersByStatus(true), 
          fetchActiveProducts({ limit: 10 })
        ]);

        setData({
          // Categories Array
          categories: catRes?.data?.categories || catRes?.data || [],
          
          // Brands Array
          brands: brandRes?.data?.brands || brandRes?.brands || [],
          
          // FIX: bestRes is already the parsed array from your updated ApiService layer
          hotSelling: Array.isArray(bestRes) ? bestRes : (bestRes?.data || []),
          
          // Banners Array
          banners: bannerRes?.data?.banners || [],
          
          // Total Count
          totalProducts: activeRes?.data?.pagination?.totalItems || 0, 
        });
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleFilterNavigation = (filters) => {
    navigate({
      pathname: "/all-products",
      search: `?${createSearchParams(filters)}`
    });
  };

  const shopStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Digident",
    "url": "https://shop.digident.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://shop.digident.in/all-products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <SEOHead
        title="Buy Digital Dental Products - CAD/CAM & Implant Components"
        description="Shop premium digital dental products at Digident. Explore CAD/CAM solutions, ScanBridge libraries, implant components, dental accessories online. Fast delivery across India."
        canonicalPath="/"
        structuredData={shopStructuredData}
      />

      <Menu
        categories={data.categories}
        brands={data.brands}
        loading={loading}
      />

      <Hero
        bannerData={data.banners}
        loading={loading}
      />

      <Starbox
        brandCount={data.brands.length}
        productCount={data.totalProducts}
        loading={loading}
      />

      <Categories
        categories={data.categories}
        loading={loading}
        onCategoryClick={(categoryId) =>
          handleFilterNavigation({
            category: categoryId
          })
        }
      />

      <Brand
        brands={data.brands}
        loading={loading}
        onBrandClick={(brandId) =>
          handleFilterNavigation({ brand: brandId })
        }
      />

      {/* This component will now correctly receive your products array fallback */}
      <HotSelling
        products={data.hotSelling}
        loading={loading}
      />
      
      <RelatedProducts 
        brandId={null} 
        currentProductId="general-shop" 
      />
    </div>
  );
}

export default Shop;