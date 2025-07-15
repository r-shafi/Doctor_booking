import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { backendUrl } = useContext(AppContext);

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email }
      );
      if (data.success) {
        toast.success("Reset link sent to your email.");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
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
        <h2 className="text-xl font-bold">Forgot Password</h2>
        <p>Enter your email to receive a reset link</p>

        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border rounded w-full p-2 ${
              error ? "border-red-500" : "border-[#DADADA]"
            }`}
          />
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 mt-2 rounded-md text-base flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? <>Sending...</> : "Send Reset Link"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
