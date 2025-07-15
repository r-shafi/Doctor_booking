import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/reset-password/${token}`,
        { password }
      );

      if (data.success) {
        toast.success("Password reset successful. You can now log in.");
        navigate("/login");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || "Something went wrong. Try again.";
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <h2 className="text-xl font-bold">Reset Password</h2>
        <p>Enter your new password</p>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border rounded w-full p-2 ${
              errors.password ? "border-red-500" : "border-[#DADADA]"
            }`}
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`border rounded w-full p-2 ${
              errors.confirmPassword ? "border-red-500" : "border-[#DADADA]"
            }`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 mt-2 rounded-md text-base flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? <>Resetting...</> : "Reset Password"}
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
