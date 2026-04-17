import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./product.css";
const ProductGallery = ({ mediaGallery, activeIndex, handleThumbnailClick, swiperRef, setActiveIndex }) => {
  return (
    <div className="w-full lg:w-[40%]">
      <div className="p-2 border border-orange-200 rounded-2xl aspect-square relative w-full mx-auto overflow-hidden">
       <Swiper 
          onSwiper={(s) => (swiperRef.current = s)} 
          modules={[Autoplay, Pagination]} 
          autoplay={{ delay: 3000 }} 
          pagination={{ clickable: true }} 
          onSlideChange={(s) => setActiveIndex(s.activeIndex)} 
          className="h-full w-full orange-pagination"
        >
          {mediaGallery.map((item, index) => (
            <SwiperSlide key={index}>
              <img src={item} loading="lazy" className="w-full h-full object-contain" alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
        {mediaGallery.map((img, i) => (
          <button 
            key={`${i}-${img}`} 
            onClick={() => handleThumbnailClick(i)} 
            className={`flex-shrink-0 border-2 rounded-xl w-[70px] h-[70px] md:w-[85px] md:h-[85px] transition-all duration-200 bg-white overflow-hidden ${activeIndex === i ? "border-[#E68736] shadow-sm" : "border-orange-200 hover:border-orange-200"}`}
          >
            <img src={img} loading="lazy" className="h-full w-full object-contain pointer-events-none" alt={`Thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;