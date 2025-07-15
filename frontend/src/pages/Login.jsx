import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingButton from '../components/LoadingButton';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (state === 'Sign Up') {
      if (!name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          toast.success('Account created successfully!');
          // Auto-login after successful registration
          const loginRes = await axios.post(`${backendUrl}/api/user/login`, {
            email,
            password,
          });

          if (loginRes.data.success) {
            localStorage.setItem('token', loginRes.data.token);
            setToken(loginRes.data.token);
            toast.success('Welcome! You are now logged in.');
          } else {
            setState('Login');
            toast.info('Please log in with your new account');
          }
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Login successful!');
        } else {
          toast.error(data.message || 'Invalid email or password');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const getFieldError = (field) => {
    return touched[field] && errors[field] ? errors[field] : '';
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-gray-800">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p className="text-gray-600">
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book
          appointment
        </p>

        {state === 'Sign Up' && (
          <div className="w-full">
            <p className="text-gray-700 mb-1">Full Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur('name')}
              value={name}
              className={`border rounded w-full p-2 transition-colors ${
                getFieldError('name')
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#DADADA] focus:border-primary'
              }`}
              type="text"
              placeholder="Enter your full name"
              disabled={loading}
            />
            {getFieldError('name') && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError('name')}
              </p>
            )}
          </div>
        )}

        <div className="w-full">
          <p className="text-gray-700 mb-1">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            value={email}
            className={`border rounded w-full p-2 transition-colors ${
              getFieldError('email')
                ? 'border-red-500 focus:border-red-500'
                : 'border-[#DADADA] focus:border-primary'
            }`}
            type="email"
            placeholder="Enter your email"
            disabled={loading}
          />
          {getFieldError('email') && (
            <p className="text-red-500 text-xs mt-1">
              {getFieldError('email')}
            </p>
          )}
        </div>

        <div className="w-full">
          <p className="text-gray-700 mb-1">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            value={password}
            className={`border rounded w-full p-2 transition-colors ${
              getFieldError('password')
                ? 'border-red-500 focus:border-red-500'
                : 'border-[#DADADA] focus:border-primary'
            }`}
            type="password"
            placeholder="Enter your password"
            disabled={loading}
          />
          {getFieldError('password') && (
            <p className="text-red-500 text-xs mt-1">
              {getFieldError('password')}
            </p>
          )}
          {state === 'Login' && (
            <div className="text-right w-full mt-2">
              <Link
                to="/forgot-password"
                className="text-primary text-xs hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}
        </div>

        <LoadingButton
          type="submit"
          loading={loading}
          className="w-full py-3 my-2 rounded-md text-base"
          disabled={loading}
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </LoadingButton>

        {state === 'Sign Up' ? (
          <p className="text-center w-full">
            Already have an account?{' '}
            <span
              onClick={() => !loading && setState('Login')}
              className={`text-primary underline ${
                loading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:text-primary/80'
              }`}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-center w-full">
            Create a new account?{' '}
            <span
              onClick={() => !loading && setState('Sign Up')}
              className={`text-primary underline ${
                loading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:text-primary/80'
              }`}
            >
              Sign up here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
