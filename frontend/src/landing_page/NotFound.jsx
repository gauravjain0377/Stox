import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function NotFound() {
  return (
    <>
      <Navbar />
      <div className="container p-5 mb-5">
        <div className="row text-center">
          <h1 className="mt-5">404 Not Found</h1>
          <p>
            Sorry, the page you are looking does not exist.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;