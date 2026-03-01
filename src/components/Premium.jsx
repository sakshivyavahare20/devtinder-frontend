import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Dev Tinder",
        description: "Connect with top developers",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#7e22ce", // A sleek purple to match a modern vibe
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed to initialize", err);
    }
  };

  return isUserPremium ? (
    <div className="flex h-[70vh] items-center justify-center animate-fade-in">
      <div className="text-center p-10 bg-base-300 rounded-3xl shadow-2xl border border-primary/20">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
          Welcome to the Elite Club
        </h1>
        <p className="text-lg text-gray-400">You are already a premium user. Enjoy your unlimited perks!</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-[80vh] m-4 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4">Upgrade Your <span className="text-primary">Experience</span></h1>
        <p className="text-gray-400 text-lg">Choose the plan that fits your networking goals.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-center">
        {/* Silver Card */}
        <div className="card bg-base-300 w-full md:w-96 rounded-3xl p-8 border border-base-200 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-secondary/20">
          <h2 className="text-2xl font-bold text-secondary mb-2">Silver</h2>
          <p className="text-4xl font-extrabold mb-6">₹300<span className="text-sm font-normal text-gray-400"> / 3 months</span></p>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-2">✨ Chat with matches</li>
            <li className="flex items-center gap-2">🚀 100 connection requests/day</li>
            <li className="flex items-center gap-2">✅ Verified Blue Tick</li>
          </ul>
          {/* BUG FIXED: This previously said "gold" */}
          <button
            onClick={() => handleBuyClick("silver")}
            className="btn btn-outline btn-secondary w-full rounded-full hover:shadow-lg hover:shadow-secondary/40 transition-all"
          >
            Get Silver
          </button>
        </div>

        {/* Gold Card */}
        <div className="card bg-base-300 w-full md:w-96 rounded-3xl p-8 border border-primary shadow-2xl shadow-primary/10 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/30 transform md:scale-105">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            MOST POPULAR
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Gold</h2>
          <p className="text-4xl font-extrabold mb-6">₹700<span className="text-sm font-normal text-gray-400"> / 6 months</span></p>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-2 text-white">✨ Priority chat access</li>
            <li className="flex items-center gap-2 text-white">♾️ Infinite connection requests</li>
            <li className="flex items-center gap-2 text-white">✅ Premium Blue Tick</li>
          </ul>
          <button
            onClick={() => handleBuyClick("gold")}
            className="btn btn-primary w-full rounded-full shadow-lg shadow-primary/40 transition-all"
          >
            Get Gold
          </button>
        </div>
      </div>
    </div>
  );
};
export default Premium;