import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Error from "../pages/Error";
import RegistrationForm from "../pages/RegistrationForm";
import EmployeeList from "../pages/EmployeeList";
import AttendanceAdd from "../pages/AttendanceAdd";
import GlobalSetting from "../pages/GlobalSetting";
import LocalSetting from "../pages/LocalSetting";
import Position from "../pages/Position";
import UserAtAGlance from "../pages/UserAtAGlance";
import DownloadAllEmployeeAttendanceData from "../pages/DownloadAllEmployeeAttendanceData";
import UpdateAttendanceAdd from "../pages/UpdateAttendanceAdd";
import Summary from "../pages/Summary";
import ProtectedRoute from "../pages/ProtectedRoute"; // Import ProtectedRoute
import Component from "../Developer/Component";
import Menu from "../Developer/Menu";
import Page from "../Developer/Page";
import Role from "../Owner/Role";
import Permission from "../Owner/Permission";
import AssignPermission from "../Owner/AssignPermission";
import UpdatePermission from "../Owner/UpdatePermission";
import { RoleProvider } from "../context/RoleContext";  // Import RoleProvider
import QuizNotice from "../pages/QuizNotice";
import QuizClasses from "../pages/QuizClasses";
import QuizResult from "../pages/QuizResult";
import Quizlink from "../pages/Quizlink";
import QuizSingleNotice from "../pages/QuizSingleNotice";
import QuizSingleResult from "../pages/QuizSingleResult";
import QuizSinglelink from "../pages/QuizSinglelink";
import QuizSingleAttendance from "../pages/QuizSingleAttendance";
import QuizSingleFeedback from "../pages/QuizSingleFeedback";
import TestPage from "../pages/TestPage";
import QuizAttendance from "../pages/QuizAttendance";
import { ThemeProvider } from "../context/ThemeContext"; // Import ThemeProvider
import Pabna from "../pages/Pabna";
import QuizFeedback from "../pages/QuizFeedback";
function App() {
  return (
  
    <Router>
     <ThemeProvider> {/* Wrap the app with ThemeProvider */}
        <RoleProvider> 
        <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/error" element={<ProtectedRoute><Error /></ProtectedRoute>} />
        <Route path="/reg" element={<ProtectedRoute><RegistrationForm /></ProtectedRoute>} />
        <Route path="/EmployeeList" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        <Route path="/AttendanceAdd" element={<ProtectedRoute><AttendanceAdd /></ProtectedRoute>} />
        <Route path="/GlobalSetting" element={<ProtectedRoute><GlobalSetting /></ProtectedRoute>} />
        <Route path="/LocalSetting" element={<ProtectedRoute><LocalSetting /></ProtectedRoute>} />
        <Route path="/Position" element={<ProtectedRoute><Position /></ProtectedRoute>} />
        <Route path="/UserAtAGlance" element={<ProtectedRoute><UserAtAGlance /></ProtectedRoute>} />
        <Route path="/DownloadAllEmployeeAttendanceData" element={<ProtectedRoute><DownloadAllEmployeeAttendanceData /></ProtectedRoute>} />
        <Route path="/UpdateAttendanceAdd" element={<ProtectedRoute><UpdateAttendanceAdd /></ProtectedRoute>} />
        <Route path="/Summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
        <Route path="/Component" element={<ProtectedRoute><Component /></ProtectedRoute>} />
        <Route path="/Menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/Page" element={<ProtectedRoute><Page /></ProtectedRoute>} />  
        <Route path="/Role" element={<ProtectedRoute><Role /></ProtectedRoute>} />  
        <Route path="/Permission" element={<ProtectedRoute><Permission /></ProtectedRoute>} />
        <Route path="/AssignPermission" element={<ProtectedRoute><AssignPermission /></ProtectedRoute>} />
        <Route path="/UpdatePermission" element={<ProtectedRoute><UpdatePermission /></ProtectedRoute>} />
        <Route path="/Notice" element={<ProtectedRoute><QuizNotice /></ProtectedRoute>} />
        <Route path="/Classes" element={<ProtectedRoute><QuizClasses /></ProtectedRoute>} />
        <Route path="/QuizResult" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
        <Route path="/Classlink" element={<ProtectedRoute><Quizlink /></ProtectedRoute>} />
        <Route path="/StudentNotice" element={<ProtectedRoute><QuizSingleNotice /></ProtectedRoute>} />
        <Route path="/SingleResult" element={<ProtectedRoute><QuizSingleResult /></ProtectedRoute>} />
        <Route path="/StudentClasslink" element={<ProtectedRoute><QuizSinglelink /></ProtectedRoute>} />
        <Route path="/StudentAttendance" element={<ProtectedRoute><QuizSingleAttendance /></ProtectedRoute>} />
        <Route path="/StudentFeedback" element={<ProtectedRoute><QuizSingleFeedback /></ProtectedRoute>} />
        <Route path="/TestPage" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
        <Route path="/ClassAttendance" element={<ProtectedRoute><QuizAttendance /></ProtectedRoute>} />
        <Route path="/Pabna" element={<ProtectedRoute><Pabna /></ProtectedRoute>} />
        <Route path="/ClassFeedback" element={<ProtectedRoute><QuizFeedback /></ProtectedRoute>} />

      </Routes>
      </RoleProvider>
      </ThemeProvider>
    </Router>
    
  );
}

export default App;
