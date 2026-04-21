/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, User, Mail, 
  Building, MapPin, Loader2, Plus, X 
} from 'lucide-react';
import { createProductReview } from '../../api/ApiService';
import { PRODUCT_QUESTIONS } from './reviewConfig'; 

const ReviewPage = ({ productData, orderId, userData }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Default to the category passed in props, but allow multiple
  const [selectedCategories, setSelectedCategories] = useState(
    productData?.categories || [productData?.category || "Scan Body"]
  );

  const [formData, setFormData] = useState({
    reviewerInfo: {
      name: userData?.name || "",
      instituteName: userData?.instituteName || "",
      location: userData?.location || "",
      email: userData?.email || "",
    },
    // ratings will now be keyed by category: { "Scan Body": [...], "Analog": [...] }
    categoryRatings: {},
    overallSatisfaction: "",
    comments: ""
  });

  const scoreOptions = ["Excellent", "Good", "Average", "Dissatisfied"];

  // Toggle categories
  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Sync questions whenever selectedCategories changes
  useEffect(() => {
    const newCategoryRatings = { ...formData.categoryRatings };
    
    selectedCategories.forEach(cat => {
      if (!newCategoryRatings[cat]) {
        const questions = PRODUCT_QUESTIONS[cat] || PRODUCT_QUESTIONS["Scan Body"] || [];
        newCategoryRatings[cat] = questions.map(q => ({ question: q, score: "" }));
      }
    });

    // Clean up categories no longer selected
    Object.keys(newCategoryRatings).forEach(cat => {
      if (!selectedCategories.includes(cat)) {
        delete newCategoryRatings[cat];
      }
    });

    setFormData(prev => ({ ...prev, categoryRatings: newCategoryRatings }));
  }, [selectedCategories]);

  const handleRatingChange = (category, index, value) => {
    const updatedCategoryRatings = { ...formData.categoryRatings };
    updatedCategoryRatings[category][index].score = value;
    setFormData({ ...formData, categoryRatings: updatedCategoryRatings });
  };

  const handleReviewerChange = (field, value) => {
    setFormData({
      ...formData,
      reviewerInfo: { ...formData.reviewerInfo, [field]: value }
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation: Ensure every question in every active category has a score
    const allAnswered = selectedCategories.every(cat => 
      formData.categoryRatings[cat]?.every(r => r.score !== "")
    );

    if (!allAnswered || !formData.overallSatisfaction) {
      setError("Please complete all ratings and the overall satisfaction score.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 2. Transform the data
      // If your backend only accepts ONE category per request, we map over them:
      const promises = selectedCategories.map(async (cat) => {
        const payload = {
          productType: cat, // Mapping 'category' to backend's 'productType'
          reviewerInfo: {
            ...formData.reviewerInfo,
            age: 0, // Backend expected age in sample; adding default
          },
          // Flatten the questions for this specific category
          ratings: [
            ...formData.categoryRatings[cat],
            { question: "Overall satisfaction", score: formData.overallSatisfaction }
          ],
          overallSatisfaction: formData.overallSatisfaction,
          comments: formData.comments || "No additional comments."
        };
        
        return await createProductReview(payload);
      });

      const results = await Promise.all(promises);
      
      // 3. Check if all requests succeeded
      if (results.every(res => res.success)) {
        setSubmitted(true);
      } else {
        throw new Error("One or more submissions failed.");
      }

    } catch (err) {
      setError("Transmission failed. Please verify your connection.");
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <CheckCircle size={60} className="text-[#E68736] mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase">Submission Successful</h2>
          <p className="text-gray-500 mt-2">Thank you for your multi-category evaluation.</p>
          <button onClick={() => window.history.back()} className="mt-6 w-full bg-black text-white py-4 rounded-xl font-bold uppercase">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Selection Header */}
        <div className="bg-black p-8 text-white">
          <h1 className="text-2xl font-black uppercase tracking-tight">Professional Evaluation</h1>
          <p className="text-[#E68736] text-[10px] font-bold tracking-[0.3em] mb-6">SELECT ALL CATEGORIES PURCHASED</p>
          
          <div className="flex flex-wrap gap-3">
            {Object.keys(PRODUCT_QUESTIONS).map(cat => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2 ${
                    isSelected 
                    ? 'bg-[#E68736] border-[#E68736] text-white' 
                    : 'bg-transparent border-white/20 text-white/60 hover:border-white'
                  }`}
                >
                  {isSelected ? <X size={14} /> : <Plus size={14} />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          {/* Reviewer Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Name', icon: <User size={14}/>, field: 'name' },
              { label: 'Institute', icon: <Building size={14}/>, field: 'instituteName' },
              { label: 'Location', icon: <MapPin size={14}/>, field: 'location' },
              { label: 'Email', icon: <Mail size={14}/>, field: 'email' }
            ].map(item => (
              <div key={item.field} className="border-b-2 border-gray-100 focus-within:border-[#E68736] transition-all">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-2">
                  {item.icon} {item.label}
                </label>
                <input 
                  type="text"
                  value={formData.reviewerInfo[item.field]}
                  onChange={(e) => handleReviewerChange(item.field, e.target.value)}
                  className="w-full py-2 outline-none font-bold text-sm"
                  required
                />
              </div>
            ))}
          </section>

          {/* Dynamic Technical Sections per Category */}
          {selectedCategories.map((cat) => (
            <section key={cat} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4">
                <h3 className="text-[#E68736] font-black text-sm uppercase tracking-widest bg-[#E68736]/10 px-4 py-1 rounded-lg">
                  {cat} Matrix
                </h3>
                <div className="h-[1px] flex-1 bg-gray-100"></div>
              </div>

              {formData.categoryRatings[cat]?.map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <p className="text-sm font-bold text-gray-700">{idx + 1}. {item.question}</p>
                  <div className="flex flex-wrap gap-2">
                    {scoreOptions.map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => handleRatingChange(cat, idx, score)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter border-2 transition-all ${
                          item.score === score 
                          ? 'bg-black border-black text-white shadow-lg' 
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}

          {/* Global Satisfaction */}
          <section className="pt-8 border-t-2 border-dashed border-gray-100">
            <h3 className="text-center text-[10px] font-black uppercase tracking-[0.3em] mb-6">Overall Experience</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {scoreOptions.map(score => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setFormData({...formData, overallSatisfaction: score})}
                  className={`py-4 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${
                    formData.overallSatisfaction === score ? 'bg-black border-black text-white' : 'bg-gray-50 border-transparent text-gray-400'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 rounded-2xl bg-[#E68736] text-white font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Transmit Multi-Category Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;