import React from "react";

function Pricing() {
  return (
    <div className="container mt-5 px-5">
      <div className="row">
        <div className="col-4">
          <h1 className="mb-3 fs-2">Unbeatable pricing</h1>
          <p className="mb-4">
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>
          <a href="./pricing" style={{ textDecoration: "none" }}  >
            See Pricing{" "}
            <i className="fa-solid fa-arrow-right-long mb-5" aria-hidden="true"></i>
          </a>
        </div>
        <div className="col-2 mt-4"></div>
        <div className="col-6 mb-5">
          <div className="row text-center">
            <div className="col p-3 border border-dark" >
              <h1>₹0</h1>
              <p>Free account opening</p>
            </div>
            <div className="col p-3 border border-dark">
              <h1>₹0</h1>
              <p>Free equity delivery and direct mutual funds</p>
            </div>
            <div className="col p-3 border border-dark">
              <h1>₹20</h1>
              <p>Intraday and F&O</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
