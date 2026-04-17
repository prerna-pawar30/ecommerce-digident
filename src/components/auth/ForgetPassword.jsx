/* eslint-disable no-unused-vars */
// src/pages/ForgetPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/slices/AuthSlice"; 
import Swal from "sweetalert2";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  
  const { loading: isSubmitting, error } = useSelector(state => state.auth); 

  const handleChange = (e) => {
    setEmail(e.target.value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
        Swal.fire({
            icon: "warning",
            title: "Invalid Email",
            text: "Please enter a valid email address.",
            confirmButtonColor: "#E68736",
        });
        return;
    }

    try {
      const resultAction = await dispatch(forgotPassword(email));
      
      if (forgotPassword.fulfilled.match(resultAction)) {
        Swal.fire({
          icon: "success",
          title: "Check Your Email",
          text: resultAction.payload, // Success message from backend
          confirmButtonColor: "#E68736",
        });
      } else {
        // Handle rejection case where payload contains the error message
        const errorMessage = resultAction.payload || error || "Failed to send reset link.";
        Swal.fire({
          icon: "error",
          title: "Request Failed",
          text: errorMessage,
          confirmButtonColor: "#E68736",
        });
      }
    } catch (err) {
       Swal.fire({
        icon: "error",
        title: "System Error",
        text: "Could not process the request.",
        confirmButtonColor: "#E68736",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg border border-[#E68736] rounded-2xl p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 text-[#E68736]">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Registered Email"
              value={email}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-[#E68736] rounded-lg focus:ring-2 focus:ring-[#E68736] outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#E68736] text-white font-semibold py-2 rounded-lg transition-all 
              ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white hover:text-[#E68736] border border-[#E68736]"
              }`}
          >
            {isSubmitting ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-gray-700 mt-5">
          <Link
            to="/login"
            className="text-[#E68736] font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}