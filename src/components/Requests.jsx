import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="text-6xl opacity-20 mb-4">📩</div>
        <h1 className="text-2xl font-bold text-gray-500 italic">Inbox Zero</h1>
        <p className="text-gray-600">No pending invitations. You're all caught up!</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto my-10 px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Pending <span className="text-primary">Requests</span></h1>
        <div className="badge badge-primary font-bold">{requests.length}</div>
      </div>

      <div className="grid gap-6">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, about } = request.fromUserId;

          return (
            <div
              key={request._id}
              className="group flex flex-col md:flex-row justify-between items-center p-6 rounded-3xl bg-base-300/50 backdrop-blur-md border border-white/5 hover:border-primary/30 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center gap-5 w-full">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 transform transition-transform group-hover:scale-105">
                    <img src={photoUrl || "https://geographyandyou.com/images/user-profile.png"} alt="profile" />
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-2xl text-white group-hover:text-primary transition-colors">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-1 italic mt-1 max-w-xs">"{about}"</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 md:mt-0 w-full md:w-auto">
                <button
                  className="btn btn-ghost btn-sm rounded-xl flex-1 md:flex-none text-error hover:bg-error/10"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Ignore
                </button>
                <button
                  className="btn btn-primary btn-sm rounded-xl px-8 flex-1 md:flex-none shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Requests;