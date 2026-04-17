/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Hero.css";

function Hero({ bannerData = [], loading }) {
  // Update: Handle the nested "banners" array from the new API structure
  // This checks if bannerData is the full "data" object or just the array
  const bannersArray = bannerData?.banners || (Array.isArray(bannerData) ? bannerData : []);
  
  useEffect(() => {
    const loadAOS = async () => {
      const AOS = (await import("aos")).default;
      await import("aos/dist/aos.css");
      AOS.init({ once: true });
    };
    loadAOS();
  }, []);

  const showLoading = loading || bannersArray.length === 0;

  return (
    <section className="py-2 md:py-10 bg-white w-full">
      <div className="px-4 w-full">
        {showLoading ? (
          <div className="w-full rounded-3xl h-[110px] sm:h-[240px] md:h-[290px] lg:h-[380px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-[#E68736] rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 3500 }}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: "#hero-prev",
              nextEl: "#hero-next"
            }}
            loop={bannersArray.length > 1}
            className="orange-pagination relative"
          >
            {bannersArray.map((banner, index) => (
              <SwiperSlide key={banner._id || index}>
                <Link to={`/all-products?bannerId=${banner.bannerId || banner._id}`}>
                  <div className="w-full rounded-3xl overflow-hidden h-[110px] sm:h-[240px] md:h-[290px] lg:h-[380px] bg-gray-100">
                    <img
                      src={banner.imageUrl}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}

            <button
              id="hero-prev"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white hover:text-[#E68736] cursor-pointer text-3xl hidden md:block"
            >
              ‹
            </button>
            <button
              id="hero-next"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white hover:text-[#E68736] cursor-pointer text-3xl hidden md:block"
            >
              ›
            </button>
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default Hero;