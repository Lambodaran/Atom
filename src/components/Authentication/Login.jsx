import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthImage from '../../assets/auth.jpg';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('username'); // 'username' or 'mobile'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (loginMethod === 'username') {
      try {
        const response = await fetch(`${apiBaseUrl}/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || Object.values(data).join(', ') || 'Login failed');
        }

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        navigate('/dashboard');
      } catch (err) {
        setError(err.message || 'An error occurred during login');
      }
    } else {
      setError('Mobile OTP login is not supported yet.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Login Method Toggle */}
          <div className="flex mb-6 rounded-lg bg-blue-50 p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('username')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'username' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Username Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('mobile')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Mobile OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === 'username' ? (
              <>
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Keep me logged in
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Mobile OTP login is coming soon</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <div 
          className="h-full w-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${AuthImage})` }}
        ></div>
      </div>
    </div>
  );
};

export default LoginPage;