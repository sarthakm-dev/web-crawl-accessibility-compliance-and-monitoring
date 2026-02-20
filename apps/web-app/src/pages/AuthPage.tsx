import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {type Mode} from '../../../../packages/shared-types/auth.types'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!email) return setEmailError("");
    setError('');
    const regex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    setEmailError(regex.test(email) ? "" : "Invalid email format");
    setError('');
  }, [email]);

  useEffect(() => {
    if (!password) return setPasswordError("");
    setError('');
    setPasswordError(
      password.length < 6 ? "Password must be at least 6 characters" : ""
    );
  }, [password]);


  useEffect(() => {
    if (mode !== "signup" && mode !== "reset") return;
    if (!confirmPassword) return setConfirmError("");
    setConfirmError(
      password !== confirmPassword ? "Passwords do not match" : ""
    );
  }, [password, confirmPassword, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
   
      if (mode === "login") {
        await axios.post("http://localhost/api/auth/login", { email, password });
        navigate("/dashboard");
      }

    
      else if (mode === "signup") {
        if (password !== confirmPassword) return;
        await axios.post("http://localhost/api/auth/signup", { name, email, password });
        navigate("/dashboard");
      }

      else if (mode === "forgot") {
        await axios.post("http://localhost/api/auth/forgot-password", { email });
        setMessage("OTP sent to your email");
        setMode("otp");
      }

      else if (mode === "otp") {
        await axios.post("http://localhost/api/auth/verify-otp", { email, otp });
        setMessage("OTP verified");
        setMode("reset");
      }

    
      else if (mode === "reset") {
        if (password !== confirmPassword) return;
        await axios.post("http://localhost/api/auth/reset-password", {
          email,
          otp,
          newPassword: password,
        });
        setMessage("Password reset successful");
        setMode("login");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Something went wrong");
      } else {
        setError("Unexpected error occurred");
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
    (mode === "login" && !password) ||
    (mode === "signup" && (!name || !password || !confirmPassword)) ||
    (mode === "otp" && !otp) ||
    (mode === "reset" && (!password || !confirmPassword));

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-400">
      <div className="bg-white w-96 rounded-2xl shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "login" && "Sign In"}
          {mode === "signup" && "Sign Up"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "otp" && "Enter OTP"}
          {mode === "reset" && "Reset Password"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === "signup" && (
            <Input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {(mode !== "otp") && (
            <>
              <Input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </>
          )}

          {mode === "otp" && (
            <Input
              type="text"
              placeholder="Enter 6 digit OTP"
              className="w-full p-3 border rounded-xl"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}

          {(mode === "login" || mode === "signup" || mode === "reset") && (
            <>
              <Input
                type="password"
                placeholder={mode === "reset" ? "New Password" : "Password"}
                className="w-full p-3 border rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </>
          )}

          {(mode === "signup" || mode === "reset") && (
            <>
              <Input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded-xl"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmError && (
                <p className="text-red-500 text-sm">{confirmError}</p>
              )}
            </>
          )}

          {mode === "login" && (
            <p
              className="text-sm text-blue-600 cursor-pointer text-right"
              onClick={() => {
                setError('');
                setMode("forgot")
              }}
            >
              Forgot Password?
            </p>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading && "Please wait..."}
            {!loading && mode === "login" && "Sign In"}
            {!loading && mode === "signup" && "Sign Up"}
            {!loading && mode === "forgot" && "Send OTP"}
            {!loading && mode === "otp" && "Verify OTP"}
            {!loading && mode === "reset" && "Reset Password"}
          </Button>
        </form>

        {(mode === "login" || mode === "signup") && (
          <p className="text-sm text-center mt-6">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have one?"}
            <span
              className="text-blue-600 ml-1 cursor-pointer"
              onClick={() =>
                {
                  setError('');
                  setEmail('');
                  setPassword('');
                  setMode(mode === "login" ? "signup" : "login")
                }
              }
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </span>
          </p>
        )}

        {(mode === "forgot" || mode === "otp" || mode === "reset") && (
          <p className="text-sm text-center mt-6">
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setMode("login")}
            >
              Back to Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}