import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/login", { emailId, password }, { withCredentials: true });
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] px-4 bg-gradient-to-b from-base-100 to-base-300">
      <div className="card w-full max-w-md bg-opacity-60 backdrop-blur-xl bg-base-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/5 animate-in fade-in zoom-in duration-700">
        <div className="card-body p-10">
          <header className="text-center mb-8">
            <h2 className="text-5xl font-black bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent tracking-tighter animate-pulse">
              DEV TINDER
            </h2>
            <p className="text-gray-400 font-medium mt-2">Code. Connect. Collaborate.</p>
          </header>

          <div className="space-y-5">
            <div className="form-control group">
              <span className="label-text mb-2 font-bold text-xs uppercase tracking-widest text-primary">Developer Email</span>
              <input
                type="text"
                value={emailId}
                className="input input-bordered bg-base-300/50 border-white/10 focus:input-primary transition-all duration-300 rounded-xl"
                placeholder="git-push@success.com"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>

            <div className="form-control">
              <span className="label-text mb-2 font-bold text-xs uppercase tracking-widest text-primary">Access Key</span>
              <input
                type="password"
                value={password}
                className="input input-bordered bg-base-300/50 border-white/10 focus:input-primary transition-all duration-300 rounded-xl"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="alert alert-error bg-error/10 border-none text-xs font-bold py-2 animate-shake">
                ⚠️ {error}
              </div>
            )}

            <button 
              className="btn btn-primary w-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 text-lg rounded-xl"
              onClick={handleLogin}
            >
              Sign In to Terminal
            </button>
            
            <p className="text-center text-sm text-gray-500">
              New to the stack? <Link to="/signup" className="text-secondary font-bold hover:text-white transition-colors">Initialize Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;