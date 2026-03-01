import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    // Only fetch if feed is empty
    if (feed && feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      // Important: Support both res.data and res.data.data
      dispatch(addFeed(res.data.data || res.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Loading State
  if (!feed) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Empty State (No more users)
  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in px-4 text-center">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="text-3xl font-bold text-white">You've seen everyone!</h1>
        <p className="text-gray-500 mt-2 max-w-sm">
          There are no more developers in your area right now. Check back soon for fresh talent.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary btn-outline mt-6 rounded-full px-8"
        >
          Refresh Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-[80vh]">
      <div className="mb-10 text-center animate-fade-in">
         <h2 className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-1">Discovery</h2>
         <p className="text-gray-500 text-sm">Find your perfect technical match</p>
      </div>
      
      <div className="relative">
        {/* We use feed[0]._id as the KEY so React re-renders a fresh card every time */}
        <UserCard user={feed[0]} key={feed[0]._id} />
        
        {/* Background Stack Decoration */}
        {feed.length > 1 && (
          <div className="absolute -z-10 top-2 left-2 w-full h-full bg-base-300 rounded-2xl opacity-40 border border-white/5"></div>
        )}
      </div>
    </div>
  );
};

export default Feed;