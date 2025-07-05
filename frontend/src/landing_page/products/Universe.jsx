import React from "react";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Stox Universe</h1>
        <p>
          Extend your trading and investment experience
         
        </p>

        <div className="col-4 p-3 mt-5">
          <img
            src="media/images/zerodhaFundhouse.png"
            style={{ borderStyle: "none", maxWidth: "100%", height: "55px" }}
          />
          <p className="text-small text-muted mt-3">
            Our asset management venture that is creating simple and transparent
            index funds to help you save for your goals.
          </p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            className="mb-3"
            src="media/images/sensibullLogo.svg"
            style={{ borderStyle: "none", maxWidth: "100%", height: "55px" }}
          />
          <p className="text-small text-muted ">
            Options trading platform that lets you create strategies, analyze
            positions, and examine data points like open interest, FII/DII, and
            more.
          </p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            className="mb-3"
            src="media/images/smallcaseLogo.png"
            style={{ borderStyle: "none", maxWidth: "100%", height: "55px" }}
          />
          <p className="text-small text-muted">
            Investment research platform that offers detailed insights on
            stocks, sectors, supply chains, and more.
          </p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            className="mb-3"
            src="media/images/streakLogo.png"
            style={{ borderStyle: "none", maxWidth: "100%", height: "55px" }}
          />
          <p className="text-small text-muted">
            Systematic trading platform that allows you to create and backtest
            strategies without coding.
          </p>
        </div>
        <div className="col-4 p-3 mt-5 mb-5">
          <img
            className="mb-3"
            src="media/images/growwlogo.png"
            style={{ borderStyle: "none", maxWidth: "100%", height: "55px" }}
          />
          <p className="text-small text-muted">
            Thematic investment platform that helps you invest in diversified
            baskets of stocks on ETFs.
          </p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            className="mb-3"
            src="media/images/dittoLogo.png"
            style={{ borderStyle: "none", maxWidth: "100%", height: "55px" }}
          />
          <p className="text-small text-muted">
            Personalized advice on life and health insurance. No spam and no
            mis-selling. Sign up for free
          </p>
        </div>
        <button
          className="p-2 btn btn-primary fs-5 mb-5"
          
          style={{ width: "20%", margin: "0 auto" }}
        >
          <a href="./signup" className=" text-white">  Signup Now</a>
        
        </button>
      </div>
    </div>
  );
}

export default Universe;
