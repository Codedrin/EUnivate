import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Client Pages */
import LandingPage from './view/pages/Client/MainPage'; 
import About from './view/pages/Client/About';
import Advantage from './view/pages/Client/Advantage';
import Contact from './view/pages/Client/Contact';
import OurTeam from './view/pages/Client/OurTeam';
import EuStore from './view/pages/Client/EuStore';
import Mission from './view/pages/Client/Mission';
import Events from './view/pages/Client/Events';
import Quotation from './view/pages/Client/Quotation';
import Showcases from './view/pages/Client/Showcases';
import Challenges from './view/pages/Client/Challenges';
import ProjectManagement from './view/pages/Client/ProjectManagement';
import Webinars from './view/pages/Client/Webinars';
import Login from './view/pages/Client/Login.jsx';
import Signup from './view/pages/Client/Signup.jsx';
import Forgotpassword from './view/pages/Client/Forgotpassword.jsx';
import ResetPassword from './view/pages/Client/Resetpassword.jsx';
import CTA from "./view/components/Client/LastSection/CTA.jsx";
// Admins
import SuperAdminDashboard from './view/pages/Admin/SuperAdmin.jsx';
import Admin from './view/pages/Admin/Admin.jsx';
import Collaborator from './view/pages/Admin/Collaborator.jsx';

//Client
import User from './view/pages/Client/User.jsx';

/* Global CSS */
import './index.css'; 

//Hooks


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
       <Route path = "/cta" element = {<CTA />} />
        <Route path="/about" element={<About />} />
        <Route path="/advantage" element={<Advantage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/eu-store" element={<EuStore />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/events" element={<Events />} />
        <Route path="/quotation" element={<Quotation />} />
        <Route path="/showcases" element={<Showcases />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/project" element={<ProjectManagement />} />
        <Route path="/webinar" element={<Webinars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgotpassword />} />
            {/* Admin Route */}
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/collab" element={<Admin />} />
        <Route path="/admin" element={<Collaborator />} />
          {/* Client */}
        <Route path="/user" element={<User />} />

          {/*Hooks*/}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
