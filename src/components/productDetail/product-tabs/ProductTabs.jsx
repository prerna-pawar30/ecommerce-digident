/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchRatings, addRating } from "../../../api/ApiService";

import DescriptionTab from "./DescriptionTab";
import SpecificationsTab from "./SpecificationsTab";
import ReviewsTab from "./ReviewsTab";

const ProductTabs = ({ productData }) => {
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState("description");
  const [reviewsData, setReviewsData] = useState({ ratingAvg: 0, ratingCount: 0, reviews: [] });
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRatingsData = async () => {
    const res = await fetchRatings(productId);
    if (res?.success) setReviewsData(res.data);
  };

  useEffect(() => {
    if (activeTab === "reviews" && productId) getRatingsData();
  }, [activeTab, productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      return Swal.fire({ icon: 'warning', title: 'Rating Required', text: 'Please select a star rating.', confirmButtonColor: '#E68736' });
    }

    try {
      setIsSubmitting(true);
      const res = await addRating(productId, { rating: String(reviewForm.rating), comment: reviewForm.comment });
      if (res?.success) {
        Swal.fire({ icon: 'success', title: 'Review Submitted', timer: 1500, showConfirmButton: false });
        setReviewForm({ rating: 0, comment: "" });
        getRatingsData();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not post review' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productData) return null;

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: "Reviews" }
  ];

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tab Headers */}
        <div className="flex border-b border-orange-100 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          {tabs.map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`pb-4 px-6 text-sm md:text-base font-bold capitalize transition-all relative cursor-pointer ${activeTab === tab.id ? "text-[#002147]" : "text-[#5E6D77] hover:text-gray-700"}`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E68736]" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "description" && <DescriptionTab product={productData} />}
          {activeTab === "specifications" && <SpecificationsTab product={productData} />}
          {activeTab === "reviews" && (
            <ReviewsTab 
              reviewsData={reviewsData} 
              reviewForm={reviewForm} 
              setReviewForm={setReviewForm} 
              handleReviewSubmit={handleReviewSubmit} 
              isSubmitting={isSubmitting} 
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;