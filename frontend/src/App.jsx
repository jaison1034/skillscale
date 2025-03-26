import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from '../src/pages/auth/login';
import Registration from './pages/auth/registration';
import Goal from './pages/employee/goalManagement';
import Home from './pages/employee/homepage';
import Feedback from './pages/employee/feedbackSelf';
import Review from './pages/employee/review';
import AdminDashboard from './pages/admin/admin'; // Changed to use AdminDashboard
import Appraisal from './pages/employee/appraisalDashborad';
import Analytics from './pages/employee/analyticsRep';
import GoalA from "./pages/manager/adminGoal";
import FeedbackA from "./pages/manager/feedbackAdmin";
import AdminR from "./pages/manager/adminReview";
import Manager from "./pages/manager/manager";
import AttendanceM from "./pages/manager/attendance_manager";
import EmpV from "./pages/admin/employee_view";
import MaR from "./pages/manager/manager_review";
import MeV from "./pages/manager/Manager_empV";
import Pro from "./pages/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from '../src/context/UserContext';
import AllEmployeeFeedback from "./pages/admin/allFeedback";

function App() {
  return (
   <>
   <ToastContainer />
   <UserProvider>
   <Router>
    <Routes>
    
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminDashboard />} /> {/* Admin route */}
      <Route path="/goal" element={<Goal />} />
      <Route path="/home" element={<Home />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/review" element={<Review />} />
      <Route path="/Appraisal" element={<Appraisal />} />
      
      <Route path="/goala" element={<GoalA />} />
     <Route path="/feedbacka" element={<FeedbackA />} />
     <Route path="/prof" element={<Pro />} />
     <Route path="/admin" element={<AdminDashboard />}>
          <Route path="goals" element={<GoalA />} />
          <Route path="empv" element={<EmpV />} />
          <Route path="adminr" element={<AdminR />} />   
          <Route path="adminf" element={<AllEmployeeFeedback />} />  
        </Route>
        <Route path="/manager" element={<Manager />}>
          <Route path="goals" element={<GoalA />} />
          <Route path="feedbacka" element={<FeedbackA />} />
          <Route path="marev" element={<MaR />}/>
          <Route path="attenm" element={<AttendanceM />}/>
          <Route path="mempv" element={<MeV />}/>
          <Route path="Analytics" element={<Analytics />} />
        </Route>
        <Route path="/manager" element={<Manager />}/>
    </Routes>
    

   </Router>
   </UserProvider>
   </>
  )
}

export default App;
