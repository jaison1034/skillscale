import { useUser } from "../context/UserContext"; // Adjust the import path
import { User, Mail, Briefcase, Building } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useUser(); // Get the logged-in user from UserContext

  // If no user is logged in, display a message
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">No user is logged in.</p>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-blue-100 via-white to-blue-50 blur-xl opacity-50"
      ></motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-6 relative z-10"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Employee Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32">
            <img
              src={user.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 shadow-md"
            />
          </div>
        </div>

        {/* Employee Details */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
            <User className="text-gray-600 w-5 h-5 mr-2" />
            <span className="text-gray-700">{user.name}</span>
          </div>

          {/* Email */}
          <div className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
            <Mail className="text-gray-600 w-5 h-5 mr-2" />
            <span className="text-gray-700">{user.email}</span>
          </div>

          {/* Role */}
          <div className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
            <Briefcase className="text-gray-600 w-5 h-5 mr-2" />
            <span className="text-gray-700">{user.role}</span>
          </div>

          {/* Department */}
          <div className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
            <Building className="text-gray-600 w-5 h-5 mr-2" />
            <span className="text-gray-700">{user.department}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;