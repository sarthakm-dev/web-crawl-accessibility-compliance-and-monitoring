import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const url = isLogin
        ? 'http://localhost:4000/auth/login'
        : 'http://localhost:4000/auth/signup';

      console.log({ email, password });

      const res = await axios.post(url, { email, password });

      localStorage.setItem('token', res.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Something went wrong';
        setError(message);
      } else {
        setError('Unexpected error occured');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-400">
      <div className="bg-white w-105 rounded-2xl shadow-2xl p-10 relative overflow-hidden">

        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>

          <p className="text-gray-500 mb-6">
            {isLogin
              ? 'Welcome back! Please enter your details'
              : 'Create your account to get started'}
          </p>


          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type='submit'
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold bg-linear-to-r from-blue-500 to-blue-700 hover:opacity-90 transition-all duration-300"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <span
              className="text-blue-600 font-medium ml-1 cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
