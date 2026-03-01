import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", emailId: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post(BASE_URL + "/signup", formData, { withCredentials: true });
      dispatch(addUser(res.data.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "System Error: Deployment Failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] py-10 bg-base-100">
      <div className="card w-[26rem] bg-base-300 border border-white/5 shadow-2xl relative overflow-hidden animate-in slide-in-from-right-10 duration-700">
        {/* Top Decorative bar */}
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-accent"></div>
        
        <div className="card-body">
          <h2 className="text-3xl font-extrabold text-white mb-2">Initialize <span className="text-secondary">Identity</span></h2>
          <p className="text-gray-400 text-sm mb-6">Create your profile to start matching with world-class engineers.</p>
          
          <div className="grid grid-cols-2 gap-3">
             <input
              type="text"
              placeholder="First Name"
              className="input input-bordered w-full focus:input-secondary transition-all"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input input-bordered w-full focus:input-secondary transition-all"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>

          <div className="space-y-4 mt-4">
            <input
              type="email"
              placeholder="Primary Email Address"
              className="input input-bordered w-full focus:input-secondary transition-all"
              onChange={(e) => setFormData({...formData, emailId: e.target.value})}
            />
            <input
              type="password"
              placeholder="Root Password (Secure)"
              className="input input-bordered w-full focus:input-secondary transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />

            {error && <p className="text-error text-xs font-mono">{`> ${error}`}</p>}

            <button 
              className="btn btn-secondary w-full mt-6 shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all text-white font-bold tracking-widest"
              onClick={handleSignup}
            >
              DEPLOY ACCOUNT
            </button>
            
            <div className="text-center mt-4">
               <Link to="/login" className="text-xs text-gray-500 uppercase tracking-tighter hover:text-white transition-all">
                 Already have an instance? <span className="text-primary font-bold">Log In</span>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;