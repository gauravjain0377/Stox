import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Home from './landing_page/home/HomePage';
import Login from './landing_page/pages/Login';
import Signup from './landing_page/pages/Signup';
import AboutPage from './landing_page/about/AboutPage';
import PricingPage from './landing_page/pricing/PricingPage';
import SupportPage from './landing_page/support/SupportPage';
import Utilities from './landing_page/utilities/Utilities';
import NotFound from './landing_page/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/utilities" element={<Utilities />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;