import axios from 'axios';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingButton from '../components/LoadingButton';
import { AppContext } from '../context/AppContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email }
      );

      if (data.success) {
        setSuccess(true);
        toast.success('Password reset email sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-6 m-auto items-center p-8 max-w-md border rounded-xl shadow-lg bg-white text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Check Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="flex gap-3 flex-col sm:flex-row">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/login"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl shadow-lg bg-white"
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          Forgot Password
        </h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <div className="w-full">
          <label className="text-gray-700 mb-1 block">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            className={`border rounded w-full p-2 transition-colors ${
              error
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-primary'
            }`}
            placeholder="Enter your email"
            disabled={loading}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <LoadingButton
          type="submit"
          loading={loading}
          className="w-full py-3 rounded-md text-base"
          disabled={loading || !email.trim()}
        >
          Send Reset Link
        </LoadingButton>

        <div className="w-full text-center">
          <Link to="/login" className="text-primary hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
