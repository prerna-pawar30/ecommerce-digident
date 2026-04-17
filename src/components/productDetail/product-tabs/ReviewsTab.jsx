import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg md:text-xl ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
    ))}
  </div>
);

const ReviewsTab = ({ reviewsData, reviewForm, setReviewForm, handleReviewSubmit, isSubmitting }) => {
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="border border-orange-200 rounded-[20px] md:rounded-[30px] p-5 md:p-12 min-h-[300px] md:min-h-[350px] bg-white ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        {/* Review List */}
        <div className="order-2 lg:order-1 space-y-8">
          <h3 className="text-[#1A202C] text-lg font-bold">Customer Reviews</h3>
          {reviewsData.reviews?.map((rev, i) => (
            <div key={i} className="space-y-3 pb-4 border-b border-gray-50 last:border-0">
              <StarRating rating={rev.rating} />
              <p className="text-[#5E6D77] text-[14px] md:text-[15px] leading-relaxed">{rev.comment}</p>
              <div className="pt-1"><span className="text-xs text-gray-400 italic font-medium">— {rev.user?.firstName || 'Anonymous'}</span></div>
            </div>
          ))}
          {reviewsData.reviews?.length === 0 && <p className="text-gray-400">No reviews yet.</p>}
        </div>

        {/* Review Form */}
        <div className="order-1 lg:order-2">
          <h3 className="text-[#1A202C] text-lg font-bold mb-6">Write Your Review</h3>
          {auth.token ? (
            <form onSubmit={handleReviewSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#5E6D77] mb-2">Rating :</label>
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <button 
                      key={num} 
                      type="button" 
                      onMouseEnter={() => setHoverRating(num)} 
                      onClick={() => setReviewForm({ ...reviewForm, rating: num })} 
                      className={`text-3xl transition-colors cursor-pointer ${num <= (hoverRating || reviewForm.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                    >★</button>
                  ))}
                </div>
              </div>
              <textarea 
                className="w-full border border-orange-200 rounded-lg p-3 h-32 focus:ring-1 focus:ring-[#E68736] outline-none" 
                placeholder="Share your thoughts..." 
                value={reviewForm.comment} 
                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} 
                required 
              />
              <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-[#E68736] text-white px-10 py-3 rounded-lg font-bold disabled:bg-gray-400">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl text-center">
              <button onClick={() => navigate('/login')} className="text-[#E68736] font-bold underline">Login to write a review</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;