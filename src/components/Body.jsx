import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      // FIX: Check err.response.status instead of err.status
      // The optional chaining (?.) prevents crashes if err.response is undefined
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        // It's a good fallback to send them to login if fetching the profile fails for any other reason
        navigate("/login");
      }
      console.error("Profile fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <NavBar />
      {/* Outlet renders the Login component if navigate("/login") is triggered */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;