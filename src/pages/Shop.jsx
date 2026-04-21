import { useState, useEffect, useRef } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  fetchCategories,
  fetchAllBrands,
  fetchBestSellingProducts,
  fetchBannersByStatus, // Updated import
  fetchActiveProducts
} from "../api/ApiService";

import Hero from "../components/shopSection/Hero";
import HotSelling from "../components/shopSection/HotSelling";
import Starbox from "../components/shopSection/Starbox";
import Menu from "../components/shopSection/Menu";
import Brand from "../components/shopSection/Brand";
import Categories from "../components/shopSection/Categories";
import RelatedProducts from "../components/shopSection/RelatedProduct";

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
          fetchBestSellingProducts(),
          fetchBannersByStatus(true), // Updated API call
          fetchActiveProducts({ limit: 10 })
        ]);

        setData({
          // Categories Array
          categories: catRes?.data?.categories || catRes?.data || [],
          
          // Brands Array
          brands: brandRes?.data?.brands || brandRes?.brands || [],
          
          // Best Selling / Hot Selling Array
          hotSelling: bestRes?.data || [],
          
          // Banners Array: Extracting from data.banners per your new response
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

  return (
    <div className="bg-white min-h-screen">
      <Menu
        categories={data.categories}
        brands={data.brands}
        loading={loading}
      />

      {/* Passing the extracted banners array */}
      <Hero
        bannerData={data.banners}
        loading={loading}
      />

      <Starbox
        brandCount={data.brands.length}
        productCount={data.totalProducts}
        loading={loading}
      />

      <Brand
        brands={data.brands}
        loading={loading}
        onBrandClick={(brandId) =>
          handleFilterNavigation({ brand: brandId })
        }
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