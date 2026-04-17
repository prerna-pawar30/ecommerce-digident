import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { IoStar } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux"; 
import { addItemToCart } from "../../../store/slices/CartSlice";
import Swal from "sweetalert2";

// Imported Parts
import ProductGallery from "./ProductGallery";
import ProductSelectors from "./ProductSelectors";
import QuantitySelector from "./QuantitySelector";

const ProductDetails = ({ productData }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(productData);
  const [variants, setVariants] = useState(productData.variants || []);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(productData.brand?.[0] || null);
  const [variantStartIndex, setVariantStartIndex] = useState(0);
  const [loadingType, setLoadingType] = useState(null);

  const swiperRef = useRef(null);

  useEffect(() => {
    if (productData) {
      setProduct(productData);
      setVariants(productData.variants || []);
      if (productData.brand?.length > 0) setSelectedBrand(productData.brand[0]);
    }
  }, [productData]);

  const currentVariant = variants[selectedVariantIndex];
  const currentStock = product?.stockType === "PRODUCT" ? product?.productStock ?? 0 : currentVariant?.variantStock ?? 0;
  const isAvailable = currentStock > 0;

  useEffect(() => {
    if (quantity > currentStock && isAvailable) setQuantity(currentStock);
  }, [selectedVariantIndex, currentStock]);

  const mediaGallery = currentVariant?.imageType === "VARIANT" && currentVariant.variantImages?.length > 0
      ? currentVariant.variantImages : product?.images || [];

  const displayPrice = currentVariant?.priceType === "VARIANT" ? currentVariant.variantPrice : product?.price;

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index);
  };

  const handleAddToCart = async (isBuyNow = false) => {
    if (!token) {
      Swal.fire({ icon: "info", title: "Login Required", text: "Please login to add items to your cart.", confirmButtonColor: "#E68736" })
        .then(() => navigate("/login", { state: { from: location } }));
      return;
    }
    if (loadingType) return; 

    const variantId = currentVariant?._id || currentVariant?.variantId;
    const brandId = selectedBrand?._id || selectedBrand?.id;
    const categoryId = product?.category?._id || product?.category?.id;

    if (!variantId || !brandId || !categoryId) {
      Swal.fire({ icon: "warning", title: "Selection Required", text: "Please select brand and variant" });
      return;
    }

    setLoadingType(isBuyNow ? "buyNow" : "cart");

    try {
      const itemData = { productId, variantId, brandId, categoryId, quantity, name: product.name, price: displayPrice, image: mediaGallery[0] };
     console.time("cart");
      await dispatch(addItemToCart(itemData)).unwrap();
      console.timeEnd("cart");
      navigate("/cart", isBuyNow ? { state: { buyNowItem: itemData, isBuyNow: true } } : {});
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error?.message || "Failed to add to cart" });
    } finally {
      setLoadingType(null);
    }
  };

  if (!product || variants.length === 0) return null;

  return (
    <section className="py-17 max-w-7xl mx-auto p-4 md:p-6 bg-white font-sans text-[#333]">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <ProductGallery 
          mediaGallery={mediaGallery} 
          activeIndex={activeIndex} 
          handleThumbnailClick={handleThumbnailClick} 
          swiperRef={swiperRef} 
          setActiveIndex={setActiveIndex} 
        />

        <div className="w-full lg:w-[55%] flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-[25px] md:text-3xl font-bold text-[#1a2b3c]">{product.name} Compatible {product.category?.name}</h1>
            <div className="flex items-center gap-1 text-[#f1c40f] text-[22px]"><IoStar /> <span className="ml-1 text-gray-400 font-bold text-[18px] md:text-base">{product.ratingAvg}</span></div>
          </div>
          
          <p className="text-gray-600 text-[18px] md:text-[16px] mb-4">{product.shortDescription || "No description available."}</p>
          
          <div className="mt-1 mb-4 text-[20px] md:text-sm font-bold flex items-center gap-1">
            Status: {isAvailable ? <span className="text-green-600 flex items-center"><HiCheckCircle className="mr-1" /> Available</span> : <span className="text-red-600 flex items-center"><HiXCircle className="mr-1" /> Out of Stock</span>}
          </div>

          <ProductSelectors 
            product={product} 
            selectedBrand={selectedBrand} 
            setSelectedBrand={setSelectedBrand} 
            currentVariant={currentVariant} 
            variantStartIndex={variantStartIndex} 
            setVariantStartIndex={setVariantStartIndex} 
            variants={variants} 
            selectedVariantIndex={selectedVariantIndex} 
            setSelectedVariantIndex={setSelectedVariantIndex} 
          />

          <div className="text-[25px] md:text-2xl font-bold mb-6 text-gray-900">₹ {displayPrice}</div>

          <div className="flex flex-col md:flex-row items-center gap-4 mt-auto pt-4">
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} maxStock={currentStock} />
            <div className="flex flex-1 gap-3 w-full">
              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                // Only disable this button if it is actually loading OR if stock is out
                disabled={!isAvailable || loadingType === "cart"} 
                className={`flex-1 font-bold py-4 md:py-3 rounded-lg transition-all
                ${!isAvailable || loadingType === "cart" 
                  ? "bg-gray-400 text-white cursor-not-allowed" 
                  : "bg-[#E68736] text-white cursor-pointer hover:bg-[#cf7529]"}`}
              >
                {loadingType === "cart" ? "Adding..." : "Add to Cart"}
              </button>

              {/* Buy Now Button */}
              <button 
                type="button"
                onClick={() => handleAddToCart(true)} 
                // Only disable this button if it is actually loading OR if stock is out
                disabled={!isAvailable || loadingType === "buyNow"} 
                className={`flex-1 font-bold py-4 md:py-3 rounded-lg flex cursor-pointer items-center justify-center gap-1 text-[18px] md:text-sm transition-all 
                ${!isAvailable || loadingType === "buyNow" 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-[#E68736] text-white hover:bg-[#cf7529]'}`}
              >
                {loadingType === "buyNow" ? "Redirecting..." : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;