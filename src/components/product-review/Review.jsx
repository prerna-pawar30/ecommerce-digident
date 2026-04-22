/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, AlertCircle, User, Mail, 
  Building, MapPin, Loader2, Plus, X,
  MessageSquare
} from 'lucide-react';
import { createProductReview } from '../../api/ApiService';
import { PRODUCT_QUESTIONS } from './reviewConfig'; 

const ReviewPage = ({ productData, orderId, userData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState(
    productData?.categories || [productData?.category || "Scan Body"]
  );

  const [formData, setFormData] = useState({
    reviewerInfo: {
      name: userData?.name || "",
      instituteName: userData?.instituteName || "",
      location: userData?.location || "",
      email: userData?.email || "",
      age: 24, 
    },
    categoryRatings: {}, // This will now hold ratings, satisfaction, AND comments per category
  });

  const scoreOptions = ["Excellent", "Good", "Average", "Dissatisfied"];

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Sync questions and specific category data
  useEffect(() => {
    const newCategoryRatings = { ...formData.categoryRatings };
    
    selectedCategories.forEach(cat => {
      if (!newCategoryRatings[cat]) {
        const questions = PRODUCT_QUESTIONS[cat] || PRODUCT_QUESTIONS["Scan Body"] || [];
        newCategoryRatings[cat] = {
          ratings: questions.map(q => ({ question: q, score: "" })),
          overallSatisfaction: "", // Category-specific
          comments: ""             // Category-specific
        };
      }
    });

    Object.keys(newCategoryRatings).forEach(cat => {
      if (!selectedCategories.includes(cat)) {
        delete newCategoryRatings[cat];
      }
    });

    setFormData(prev => ({ ...prev, categoryRatings: newCategoryRatings }));
  }, [selectedCategories]);

  // Handle score changes for technical questions
  const handleRatingChange = (category, index, value) => {
    const updated = { ...formData.categoryRatings };
    updated[category].ratings[index].score = value;
    setFormData({ ...formData, categoryRatings: updated });
  };

  // Handle individual satisfaction and comments per category
  const handleCategoryFieldChange = (category, field, value) => {
    const updated = { ...formData.categoryRatings };
    updated[category][field] = value;
    setFormData({ ...formData, categoryRatings: updated });
  };

  const handleReviewerChange = (field, value) => {
    setFormData({
      ...formData,
      reviewerInfo: { ...formData.reviewerInfo, [field]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if every selected category has all ratings and a satisfaction score
    const allValidated = selectedCategories.every((cat) => {
      const catData = formData.categoryRatings[cat];
      return catData?.ratings.every(r => r.score !== "") && catData?.overallSatisfaction !== "";
    });

    if (!allValidated) {
      setError("Please complete all ratings and satisfaction scores for each category.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        reviewerInfo: formData.reviewerInfo,
        categoryReviews: selectedCategories.map((cat) => ({
          productType: cat,
          ratings: formData.categoryRatings[cat].ratings,
          overallSatisfaction: formData.categoryRatings[cat].overallSatisfaction,
          comments: formData.categoryRatings[cat].comments || "No specific comments.",
        })),
      };

      const response = await createProductReview(payload);

      if (response.success) {
        setSubmitted(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.message || "Submission failed.");
      }
    } catch (err) {
      setError("Transmission failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <CheckCircle size={60} className="text-[#E68736] mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-black uppercase">Submission Successful</h2>
          <p className="text-gray-500 mt-2">Thank you for your evaluation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-black p-8 text-white">
          <h1 className="text-2xl font-black uppercase tracking-tight">Professional Evaluation</h1>
          <p className="text-[#E68736] text-[10px] font-bold tracking-[0.3em] mb-6">SELECT ALL CATEGORIES PURCHASED</p>
          <div className="flex flex-wrap gap-3">
            {Object.keys(PRODUCT_QUESTIONS).map(cat => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat} type="button" onClick={() => toggleCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase border-2 flex items-center gap-2 ${
                    isSelected ? 'bg-[#E68736] border-[#E68736] text-white' : 'bg-transparent border-white/20 text-white/60'
                  }`}
                >
                  {isSelected ? <X size={14} /> : <Plus size={14} />} {cat}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          {/* Reviewer Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{ label: 'Name', field: 'name' }, { label: 'Institute', field: 'instituteName' }, { label: 'Location', field: 'location' }, { label: 'Email', field: 'email' }].map(item => (
              <div key={item.field} className="border-b-2 border-gray-100 focus-within:border-[#E68736] transition-all">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1">{item.label}</label>
                <input type="text" value={formData.reviewerInfo[item.field]} onChange={(e) => handleReviewerChange(item.field, e.target.value)} className="w-full py-2 outline-none font-bold text-sm" required />
              </div>
            ))}
          </section>

          {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold flex items-center gap-3"><AlertCircle size={18}/>{error}</div>}

          {/* Dynamic Technical Sections per Category */}
          {selectedCategories.map((cat) => (
            <section key={cat} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-8">
              <h3 className="text-[#E68736] font-black text-sm uppercase tracking-widest bg-[#E68736]/10 px-4 py-1 rounded-lg w-fit">
                {cat} Assessment
              </h3>

              {formData.categoryRatings[cat]?.ratings.map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <p className="text-sm font-bold text-gray-700">{idx + 1}. {item.question}</p>
                  <div className="flex flex-wrap gap-2">
                    {scoreOptions.map(score => (
                      <button
                        key={score} type="button"
                        onClick={() => handleRatingChange(cat, idx, score)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase border-2 transition-all ${
                          item.score === score ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'
                        }`}
                      >{score}</button>
                    ))}
                  </div>
                </div>
              ))}

              {/* INDIVIDUAL SATISFACTION FOR THIS CATEGORY */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <label className="text-[10px] font-black text-[#E68736] uppercase tracking-widest">Overall {cat} Satisfaction</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {scoreOptions.map(score => (
                    <button
                      key={score} type="button"
                      onClick={() => handleCategoryFieldChange(cat, 'overallSatisfaction', score)}
                      className={`py-3 rounded-xl border-2 text-[9px] font-black uppercase transition-all ${
                        formData.categoryRatings[cat]?.overallSatisfaction === score ? 'bg-[#E68736] border-[#E68736] text-white' : 'bg-white border-gray-100 text-gray-400'
                      }`}
                    >{score}</button>
                  ))}
                </div>
              </div>

              {/* INDIVIDUAL COMMENTS FOR THIS CATEGORY */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
                  <MessageSquare size={14} /> {cat} Specific Feedback
                </label>
                <textarea 
                  value={formData.categoryRatings[cat]?.comments || ""}
                  onChange={(e) => handleCategoryFieldChange(cat, 'comments', e.target.value)}
                  placeholder={`Technical notes about ${cat}...`}
                  className="w-full min-h-[80px] p-4 bg-white border-2 border-gray-100 rounded-xl focus:border-[#E68736] outline-none font-medium text-sm transition-all"
                />
              </div>
            </section>
          ))}

          <button
            type="submit" disabled={loading}
            className="w-full py-6 rounded-2xl bg-[#E68736] text-white font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Transmit Evaluation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;