// import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };



  return (
    <div className="min-h-screen bg-[#05010E] text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard 🚀</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-pink-600 rounded-lg font-semibold hover:opacity-90"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
