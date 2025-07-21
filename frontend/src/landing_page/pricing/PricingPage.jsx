import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Hero from "./Hero";
import ChargesTable from "./ChargesTable";
import AccountChargesTable from "./AccountChargesTable";

function PricingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ChargesTable />
      <AccountChargesTable />
      <Footer />
    </>
  );
}

export default PricingPage;