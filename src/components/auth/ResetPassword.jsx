/* eslint-disable no-unused-vars */
// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/slices/AuthSlice"; 
import Swal from "sweetalert2";
import { HiEye, HiEyeOff } from "react-icons/hi";
export default function ResetPassword() {
  const navigate = useNavigate();
  // Get the token from the URL parameters (e.g., /reset-password/aBcDeF12345)
  const { token } = useParams(); 
  const dispatch = useDispatch();
  
  const { loading: isSubmitting } = useSelector(state => state.auth); 
  
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
// 2. Add state for visibility toggle
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
        return Swal.fire({
            icon: "error",
            title: "Invalid Link",
            text: "The password reset token is missing.",
            confirmButtonColor: "#E68736",
        });
    }
    
    // Trim values only for submission/validation to ensure no extra spaces are sent
    const trimmedNewPassword = passwords.newPassword.trim();
    const trimmedConfirmPassword = passwords.confirmNewPassword.trim();


    if (trimmedNewPassword.length < 8) {
        return Swal.fire({
            icon: "warning",
            title: "Password Too Short",
            text: "New password must be at least 8 characters long.",
            confirmButtonColor: "#E68736",
        });
    }

    if (trimmedNewPassword !== trimmedConfirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Mismatch",
        text: "New Password and Confirm Password do not match.",
        confirmButtonColor: "#E68736",
      });
    }

    try {
      // Dispatch the action with the trimmed passwords
   // Inside ResetPassword.jsx handleSubmit
const resultAction = await dispatch(resetPassword({ 
    token, 
    newPassword: trimmedNewPassword,
    confirmNewPassword: trimmedConfirmPassword 
}));
      
      if (resetPassword.fulfilled.match(resultAction)) {
        await Swal.fire({
          icon: "success",
          title: "Password Reset Successful!",
          text: resultAction.payload || "Your password has been updated. Please log in.",
          confirmButtonColor: "#E68736",
        });
        
        navigate("/login");
      } else {
        // This handles successful API calls that return an error payload (e.g., 400 Bad Request)
        const errorMessage = resultAction.payload || "Failed to reset password.";
        Swal.fire({
          icon: "error",
          title: "Reset Failed",
          text: errorMessage,
          confirmButtonColor: "#E68736",
        });
      }

    } catch (err) {
       // This handles network errors or unexpected system crashes
       Swal.fire({
        icon: "error",
        title: "System Error",
        text: "Could not process the reset request.",
        confirmButtonColor: "#E68736",
      });
    }
  };

return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg border border-[#E68736] rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-center mb-6 text-[#E68736]">
          Set New Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
            Enter and confirm your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"} // 3. Toggle Type
                name="newPassword"
                placeholder="Enter New Password"
                value={passwords.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E68736] rounded-lg focus:ring-2 focus:ring-[#E68736] outline-none pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E68736]"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} // 3. Toggle Type
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={passwords.confirmNewPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E68736] rounded-lg focus:ring-2 focus:ring-[#E68736] outline-none pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E68736]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#E68736] text-white font-semibold py-2 rounded-lg transition-all 
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:text-[#E68736] border border-[#E68736]"}`}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}