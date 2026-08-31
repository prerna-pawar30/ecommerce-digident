import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./product.css";

const ZOOM = 2.5;
const LENS_SIZE = 100 / ZOOM; // lens covers this % of the frame

/* Flipkart-style magnifier: hovering the main image shows a lens on the
   source and a large magnified preview in a panel to the right.
   Desktop only — touch devices use the swipeable gallery instead. */
const MagnifierStage = ({ src }) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 }); // cursor position over image, in %

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setPos({ x, y });
  };

  // Keep the lens box fully inside the frame
  const lensX = Math.max(0, Math.min(100 - LENS_SIZE, pos.x - LENS_SIZE / 2));
  const lensY = Math.max(0, Math.min(100 - LENS_SIZE, pos.y - LENS_SIZE / 2));

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full overflow-hidden rounded-xl cursor-crosshair"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onMouseMove={handleMove}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          className="w-full h-full object-contain select-none"
        />

        {show && (
          <div
            className="absolute border-2 border-[#E68736]/70 bg-[#E68736]/10 pointer-events-none"
            style={{
              width: `${LENS_SIZE}%`,
              height: `${LENS_SIZE}%`,
              left: `${lensX}%`,
              top: `${lensY}%`,
            }}
          />
        )}
      </div>

      {/* Magnified preview panel */}
      {show && (
        <div className="absolute top-0 left-[calc(100%+16px)] z-50 w-[400px] h-[400px] xl:w-[460px] xl:h-[460px] rounded-2xl border border-orange-200 bg-white shadow-2xl overflow-hidden">
          <img
            src={src}
            alt=""
            draggable={false}
            className="w-full h-full object-contain select-none"
            style={{
              transform: `scale(${ZOOM})`,
              transformOrigin: `${pos.x}% ${pos.y}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

const ProductGallery = ({ mediaGallery, activeIndex, handleThumbnailClick, swiperRef, setActiveIndex }) => {
  const mainSrc = mediaGallery[activeIndex] || mediaGallery[0];

  return (
    <div className="w-full lg:w-[40%]">
      {/* MOBILE / TOUCH — swipeable gallery */}
      <div className="lg:hidden p-2 border border-orange-200 rounded-2xl aspect-square relative w-full mx-auto overflow-hidden">
        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
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

      {/* DESKTOP — hover magnifier with side preview panel */}
      <div className="hidden lg:block p-2 border border-orange-200 rounded-2xl aspect-square relative w-full">
        <MagnifierStage src={mainSrc} />
      </div>

      {/* Thumbnails */}
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

      <p className="mt-2 text-center text-[11px] text-gray-400 hidden lg:block">
        Hover over the image to zoom
      </p>
    </div>
  );
};

export default ProductGallery;
