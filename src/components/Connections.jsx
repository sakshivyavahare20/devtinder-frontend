import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections || connections.length === 0) {
    return <h1 className="flex justify-center my-10">No Connections Found!</h1>;
  }

  return (
    <div className="flex flex-col items-center my-10">
      <h1 className="text-bold text-white text-3xl mb-10">Your Network</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, about } = connection;

          return (
            <div key={_id} className="flex bg-base-300 w-96 p-5 rounded-lg shadow-xl border border-white/5">
              <div className="flex-none">
                <img
                  src={photoUrl || "https://geographyandyou.com/images/user-profile.png"}
                  alt="photo"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="flex-grow ml-5">
                <h2 className="text-xl font-bold text-white">{firstName + " " + lastName}</h2>
                <p className="text-sm text-gray-400 italic mb-4">{about || "This is a default about of the user!"}</p>
                
                {/* THIS IS THE FIX: This button navigates to the Chat route */}
                <button 
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => navigate("/chat/" + _id)}
                >
                  Send Message
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;