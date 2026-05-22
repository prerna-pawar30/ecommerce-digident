/* eslint-disable no-unused-vars */
// src/pages/ResetPassword.jsx
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/slices/AuthSlice"; 
import Swal from "sweetalert2";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); 
  const dispatch = useDispatch();
  
  const { loading: isSubmitting } = useSelector(state => state.auth); 
  
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // 1. Structural Password Validation Rules
  const validationRules = useMemo(() => {
    const password = passwords.newPassword;
    return [
      { id: "length", text: "At least 8 characters long", passed: password.length >= 8 },
      { id: "uppercase", text: "At least one uppercase letter (A-Z)", passed: /[A-Z]/.test(password) },
      { id: "lowercase", text: "At least one lowercase letter (a-z)", passed: /[a-z]/.test(password) },
      { id: "number", text: "At least one number (0-9)", passed: /[0-9]/.test(password) },
      { id: "special", text: "At least one special character (@$!%*?&)", passed: /[@$!%*?&]/.test(password) },
    ];
  }, [passwords.newPassword]);

  // Check if all core strength requirements are met using native .every()
  const isPasswordStrong = useMemo(() => {
    return validationRules.every(rule => rule.passed);
  }, [validationRules]);

  // Determine if confirmation field matches the new password
  const isMatching = useMemo(() => {
    if (!passwords.confirmNewPassword) return false;
    return passwords.newPassword === passwords.confirmNewPassword;
  }, [passwords.newPassword, passwords.confirmNewPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Link",
        text: "The password reset token is missing or expired.",
        confirmButtonColor: "#E68736",
      });
    }
    
    const trimmedNewPassword = passwords.newPassword.trim();
    const trimmedConfirmPassword = passwords.confirmNewPassword.trim();

    // Final Guardrail Validations on Submit
    if (!isPasswordStrong) {
      return Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Please fulfill all password criteria requirements before proceeding.",
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
        const errorMessage = resultAction.payload || "Failed to reset password.";
        Swal.fire({
          icon: "error",
          title: "Reset Failed",
          text: errorMessage,
          confirmButtonColor: "#E68736",
        });
      }

    } catch (err) {
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

        <h2 className="text-3xl font-bold text-center mb-2 text-[#E68736]">
          Set New Password
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Enter and confirm your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* New Password Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
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

            {/* Real-Time Requirement Checklist */}
            {passwords.newPassword.length > 0 && (
              <ul className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-1 text-xs">
                {validationRules.map((rule) => (
                  <li 
                    key={rule.id} 
                    className={`flex items-center gap-1.5 transition-colors duration-200 ${
                      rule.passed ? "text-green-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    <span>{rule.passed ? "✓" : "•"}</span>
                    <span>{rule.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={passwords.confirmNewPassword}
                onChange={handleChange}
                required
                disabled={!isPasswordStrong} // Block input until password rules are satisfied
                className="w-full px-4 py-2 border border-[#E68736] rounded-lg focus:ring-2 focus:ring-[#E68736] outline-none pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled={!isPasswordStrong}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E68736] disabled:opacity-30"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            {/* Live match indicator status */}
            {passwords.confirmNewPassword.length > 0 && (
              <p className={`text-xs mt-1 font-medium ${isMatching ? "text-green-600" : "text-red-500"}`}>
                {isMatching ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Form Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isPasswordStrong || !isMatching}
            className={`w-full bg-[#E68736] text-white font-semibold py-2 rounded-lg transition-all border border-[#E68736]
              ${(isSubmitting || !isPasswordStrong || !isMatching)
                ? "opacity-50 cursor-not-allowed bg-gray-400 border-gray-400" 
                : "hover:bg-white hover:text-[#E68736]"}`}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}