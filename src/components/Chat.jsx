import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  const fetchChatDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });
      
      setMessages(res.data?.messages || []);

      // Find the user that is NOT the logged-in user
      const otherPerson = res.data?.participants?.find(
        (p) => p._id.toString() !== user?._id?.toString()
      );
      
      if (otherPerson) setTargetUser(otherPerson);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    if (targetUserId && user?._id) fetchChatDetails();
  }, [targetUserId, user?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMsg = { senderId: user._id, text: newMessage, createdAt: new Date() };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      await axios.post(`${BASE_URL}/chat/send`, 
        { targetUserId, text: tempMsg.text }, 
        { withCredentials: true }
      );
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto my-5 bg-base-300/20 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      
      <div className="p-5 border-b border-white/5 bg-base-300/50 flex items-center gap-4">
        <button onClick={() => navigate("/connections")} className="btn btn-ghost btn-sm btn-circle">✕</button>
        <div className="avatar online">
          <div className="w-12 rounded-full ring ring-secondary ring-offset-2">
            <img src={targetUser?.photoUrl || "https://geographyandyou.com/images/user-profile.png"} alt="avatar" />
          </div>
        </div>
        <div>
          {/* Using optional chaining and fallback text to prevent "undefined" */}
          <h2 className="font-black text-white text-xl">
            {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Loading User..."}
          </h2>
          <p className="text-[10px] text-secondary font-mono uppercase">Secure Connection</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => {
          const isMe = (msg.senderId?._id || msg.senderId) === user?._id;
          return (
            <div key={i} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
              <div className={`chat-bubble ${isMe ? "chat-bubble-secondary" : "bg-base-100"}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-base-300/80 border-t border-white/5 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message ${targetUser?.firstName || "..."}`}
          className="input input-bordered flex-1 bg-base-100/50 rounded-xl"
        />
        <button type="submit" className="btn btn-secondary btn-circle">➤</button>
      </form>
    </div>
  );
};

export default Chat;