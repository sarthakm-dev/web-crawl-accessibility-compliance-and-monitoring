import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { type Mode } from '@packages/shared-types/auth.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import authApi from '@/utils/auth-api';
import { useAuthStore } from '@/store/auth-store';

export default function AuthPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const [mode, setMode] = useState<Mode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) return setEmailError('');
    const regex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    setEmailError(regex.test(email) ? '' : 'Invalid email format');
  }, [email]);

  useEffect(() => {
    if (!password) return setPasswordError('');
    setPasswordError(
      password.length < 6 ? 'Password must be at least 6 characters' : ''
    );
  }, [password]);

  useEffect(() => {
    if (mode !== 'signup' && mode !== 'reset') return;
    if (!confirmPassword) return setConfirmError('');
    setConfirmError(
      password !== confirmPassword ? 'Passwords do not match' : ''
    );
  }, [password, confirmPassword, mode]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const resetForm = () => {
    setName('');
    setEmail('');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
  };

  const changeMode = (newMode: Mode) => {
    resetForm();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await authApi.post('/api/auth/login', { email, password });
        setUser(res.data.user || res.data);
        toast.success('Login Successful');
        navigate('/dashboard');
      } else if (mode === 'signup') {
        await authApi.post('/api/auth/signup', { name, email, password });

        toast.success('Account Created');

        navigate('/');
      } else if (mode === 'forgot') {
        await authApi.post('/api/auth/forgot-password', { email });

        toast.success('OTP Sent');

        setMode('otp');
      } else if (mode === 'otp') {
        await authApi.post('/api/auth/verify-otp', { email, otp });

        toast.success('OTP Verified');

        setMode('reset');
      } else if (mode === 'reset') {
        await authApi.post('/api/auth/reset-password', {
          email,
          otp,
          newPassword: password,
        });

        toast.success('Password Reset Successful');

        changeMode('login');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          `${err.response?.data.error || err.response?.data.message || 'Something went wrong'}`
        );
      } else {
        toast.error('Unexpected Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !!emailError ||
    !!passwordError ||
    !!confirmError ||
    !email ||
    (mode === 'login' && !password) ||
    (mode === 'signup' && (!name || !password || !confirmPassword)) ||
    (mode === 'otp' && !otp) ||
    (mode === 'reset' && (!password || !confirmPassword));

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-400">
      <div className="bg-white w-96 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' && 'Sign In'}
          {mode === 'signup' && 'Sign Up'}
          {mode === 'forgot' && 'Forgot Password'}
          {mode === 'otp' && 'Enter OTP'}
          {mode === 'reset' && 'Reset Password'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}

          {mode !== 'otp' && (
            <>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </>
          )}

          {mode === 'otp' && (
            <Input
              type="text"
              placeholder="Enter 6 digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
            <>
              <Input
                type="password"
                placeholder={mode === 'reset' ? 'New Password' : 'Password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </>
          )}

          {(mode === 'signup' || mode === 'reset') && (
            <>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {confirmError && (
                <p className="text-red-500 text-sm">{confirmError}</p>
              )}
            </>
          )}

          {mode === 'login' && (
            <p
              className="text-sm text-blue-600 cursor-pointer text-right"
              onClick={() => changeMode('forgot')}
            >
              Forgot Password?
            </p>
          )}

          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign In'
                : mode === 'signup'
                  ? 'Sign Up'
                  : mode === 'forgot'
                    ? 'Send OTP'
                    : mode === 'otp'
                      ? 'Verify OTP'
                      : 'Reset Password'}
          </Button>
        </form>

        {(mode === 'login' || mode === 'signup') && (
          <p className="text-sm text-center mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have one?'}
            <span
              className="text-blue-600 ml-1 cursor-pointer"
              onClick={() => changeMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        )}

        {(mode === 'forgot' || mode === 'otp' || mode === 'reset') && (
          <p className="text-sm text-center mt-6">
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => changeMode('login')}
            >
              Back to Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
