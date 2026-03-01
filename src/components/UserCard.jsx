import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";

const UserCard = ({ user }) => {
  // Safety check: if user is missing, return nothing to prevent crash
  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleSendRequest = async (status, userId) => {
    // 1. Trigger Animation
    setSwipeDirection(status === "interested" ? "right" : "left");

    try {
      // 2. Call API
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      
      // 3. Wait for animation to finish then remove from Redux
      setTimeout(() => {
        dispatch(removeUserFromFeed(userId));
        setSwipeDirection(null); // Reset for next user
      }, 400);
    } catch (err) {
      setSwipeDirection(null);
      console.error("Request failed", err);
    }
  };

  return (
    <div 
      className={`card bg-base-300 w-96 shadow-2xl transition-all duration-500 ease-in-out transform 
        ${swipeDirection === "right" ? "translate-x-[200%] rotate-12 opacity-0" : ""}
        ${swipeDirection === "left" ? "-translate-x-[200%] -rotate-12 opacity-0" : ""}
        hover:scale-[1.01] border border-white/5 overflow-hidden`}
    >
      <figure className="relative h-[400px]">
        <img 
          src={photoUrl || "https://geographyandyou.com/images/user-profile.png"} 
          alt="developer" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-300 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {firstName} {lastName}
          </h2>
          <div className="flex gap-2 mt-1">
             <span className="badge badge-primary font-bold">{gender}</span>
             {age && <span className="badge badge-outline text-white">{age} Years</span>}
          </div>
        </div>
      </figure>

      <div className="card-body bg-base-300">
        <p className="text-gray-400 text-sm italic line-clamp-3">
          {about || "No bio provided."}
        </p>
        
        <div className="card-actions justify-center mt-4 gap-8">
          <button
            className="btn btn-circle btn-outline btn-error hover:scale-110 transition-transform w-14 h-14"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <button
            className="btn btn-circle btn-primary shadow-lg shadow-primary/30 hover:scale-110 transition-transform w-14 h-14"
            onClick={() => handleSendRequest("interested", _id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;