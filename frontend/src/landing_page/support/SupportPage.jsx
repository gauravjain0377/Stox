import React from "react";
import "./support.css";

import Hero from "./Hero";
import CreateTicket from "./CreateTicket";
import FAQ from "./FAQ";
import GetInTouch from "./GetInTouch";
import ComplianceSafety from "./ComplianceSafety";

import Navbar from "../Navbar";
import Footer from "../Footer";

function SupportPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <CreateTicket />
      <FAQ />
      <GetInTouch />
      <ComplianceSafety />
      <Footer />
    </>
  );
}

export default SupportPage;