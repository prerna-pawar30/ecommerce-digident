/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, AlertCircle, User, Mail, Calendar, ExternalLink } from 'lucide-react';
import { createProductReview } from '../../api/ApiService';
import { PRODUCT_QUESTIONS } from './reviewConfig'; 

const ReviewPage = ({ productData, orderId, userData }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [showHistoryBadge, setShowHistoryBadge] = useState(false);

  const [formData, setFormData] = useState({
    productType: productData?.category || "Scan Body",
    reviewerInfo: {
      name: userData?.name ,
      age: userData?.age ,
      email: userData?.email ,
    },
    ratings: [],
    overallSatisfaction: "",
    comments: ""
  });

  const scoreOptions = ["Excellent", "Good", "Average", "Dissatisfied"];

  // 1. Check for existing review (Flipkart-style persistence)
  useEffect(() => {
    const hasReviewed = localStorage.getItem(`reviewed_${formData.productType}`);
    if (hasReviewed) {
      setShowHistoryBadge(true);
    }
  }, [formData.productType]);

  // 2. Dynamically load questions based on category
  useEffect(() => {
    const questions = PRODUCT_QUESTIONS[formData.productType] || PRODUCT_QUESTIONS["Scan Body"];
    const initialRatings = questions.map(q => ({ question: q, score: "" }));
    setFormData(prev => ({ ...prev, ratings: initialRatings }));
  }, [formData.productType]);

  const handleRatingChange = (index, value) => {
    const updatedRatings = [...formData.ratings];
    updatedRatings[index].score = value;
    setFormData({ ...formData, ratings: updatedRatings });
  };

  const handleReviewerChange = (field, value) => {
    setFormData({
      ...formData,
      reviewerInfo: { ...formData.reviewerInfo, [field]: value }
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.ratings.some(r => !r.score)) {
    setError("Please provide a score for all technical questions.");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const payload = {
      ...formData,
      reviewerInfo: {
        ...formData.reviewerInfo,
        age: Number(formData.reviewerInfo.age)
      }
    };

    const response = await createProductReview(payload);
    
    if (response.success) {
      // PERSISTENCE: Save to local storage so the site remembers this user
      localStorage.setItem('has_reviewed_scan_body', 'true');
      setSubmitted(true);
    }
  } catch (err) {
    setError(err.response?.data?.message || "Validation failed.");
  } finally {
    setLoading(false);
  }
};

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 ">
        <div className="text-center bg-white p-10 rounded-2xl border border-gray-100 max-w-md">
          <CheckCircle size={60} stroke="#E68736" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black uppercase tracking-tighter">Feedback Received</h2>
          <p className="text-gray-500 mt-2">Thank you, {formData.reviewerInfo.name}. Your professional evaluation helps us maintain precision standards.</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-8 w-full bg-[#E68736] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 font-sans text-black relative">
      
      {/* Repeated Feedback Badge (Sticky) */}
      {showHistoryBadge && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-right duration-500">
          <div className="bg-black text-white px-4 py-3 rounded-xl border-l-4 border-[#E68736] shadow-2xl flex items-center gap-3">
            <div className="bg-[#E68736] p-1.5 rounded-lg">
              <CheckCircle size={14} color="white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-[#E68736]">Activity</p>
              <p className="text-[11px] font-bold">You previously reviewed this category</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.07)] border border-gray-100 overflow-hidden">
        
        {/* Brand Header */}
        <div className="bg-[#E68736] p-8 text-white flex justify-between items-center border-b-4 border-[#E68736]">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Professional Review</h1>
            <p className="text-white text-[10px] font-bold mt-1 tracking-[0.3em]">DIGIDENT INDIA • PRECISION SERIES</p>
          </div>
          <div className="text-right">
            <label className="text-[12px] font-bold uppercase text-white block mb-1">Select Component</label>
            <select 
              value={formData.productType}
              onChange={(e) => setFormData({...formData, productType: e.target.value})}
              className="bg-transparent border border-gray-100 rounded-xl px-4 py-2 text-white font-bold outline-none cursor-pointer text-sm uppercase tracking-tighter"
            >
              {Object.keys(PRODUCT_QUESTIONS).map(cat => <option key={cat} value={cat} className="text-black">{cat}</option>)}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border-l-4 border-red-600 text-sm font-bold animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Clinician Identity */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Clinician Name', icon: <User size={12}/>, value: formData.reviewerInfo.name, field: 'name', type: 'text' },
              { label: 'Age', icon: <Calendar size={12}/>, value: formData.reviewerInfo.age, field: 'age', type: 'number' },
              { label: 'Contact Email', icon: <Mail size={12}/>, value: formData.reviewerInfo.email, field: 'email', type: 'email' }
            ].map((item) => (
              <div key={item.field} className="relative">
                <label className="text-[9px] font-black text-black uppercase mb-1 flex items-center gap-1 transition-colors">
                  {item.icon} {item.label}
                </label>
                <input 
                  type={item.type}
                  value={item.value} 
                  onChange={(e) => handleReviewerChange(item.field, e.target.value)}
                  className="w-full bg-white border-b-2 border-gray-100 focus:border-[#E68736] outline-none text-sm font-bold py-2 transition-all hover:border-gray-300"
                />
              </div>
            ))}
          </section>

          {/* Dynamic Technical Matrix */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <h3 className="text-black font-black text-sm uppercase tracking-[0.2em]">Technical Matrix</h3>
              <div className="h-[2px] flex-1 bg-gray-100"></div>
            </div>
            
            {formData.ratings.map((item, index) => (
              <div key={index} className="space-y-5">
                <p className="text-black font-black text-xs uppercase tracking-wide flex gap-3">
                  <span className="text-[#E68736]">0{index + 1}</span> {item.question}
                </p>
                <div className="flex flex-wrap gap-3">
                  {scoreOptions.map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleRatingChange(index, score)}
                      className={`px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-[0.15em] border-2 transition-all ${
                        item.score === score 
                        ? 'bg-[#E68736] border-[#E68736] text-white scale-105 shadow-xl' 
                        : 'bg-white border-gray-100 text-gray-300 hover:border-[#E68736] hover:text-[#E68736]'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Overall Satisfaction */}
          <div className="pt-10 border-t-2 border-dashed border-gray-100">
            <label className="block text-black font-black uppercase text-[10px] tracking-[0.3em] mb-8 text-center">
              Executive Satisfaction Summary
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {scoreOptions.map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setFormData({...formData, overallSatisfaction: score})}
                  className={`py-4 rounded-xl border-2 text-[10px] font-black uppercase transition-all tracking-widest ${
                    formData.overallSatisfaction === score
                    ? 'bg-[#E68736] border-[#E68736] text-white shadow-2xl shadow-[#E68736]/20'
                    : 'border-gray-100 text-gray-400 bg-gray-50/50 hover:bg-white hover:border-black'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical Comments */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-2">
              Clinical Observations <span className="text-gray-300 font-normal italic">(Optional)</span>
            </label>
            <textarea
              className="w-full border-2 border-gray-100 rounded-xl p-6 outline-none focus:border-black transition-all text-sm min-h-[140px] bg-gray-50 focus:bg-white placeholder:text-gray-300"
              placeholder="Provide specific feedback on fit, tolerance, or scanning performance..."
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
            />
          </div>

          {/* Action Footer */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 rounded-xl text-white font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all active:scale-95 ${
                loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-black hover:bg-[#E68736] shadow-black/10'
              }`}
            >
              {loading ? "Transmitting Data..." : "Submit Professional Review"}
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;