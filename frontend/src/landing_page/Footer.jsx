import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "rgb(250, 250, 250)" }}>
      <div className="container-fluid border-top mt-5">
        <div className="row mt-5">
          <div className="col">
            <img src="media/images/logo.png" style={{ width: "20%" }} />
            <p className="text-muted">
              &copy; 2025, Stox All rights reserved.
            </p>
          </div>
          <div className="col">
            <p className="fs-5">Company</p>
            <a href="./about" className="text-muted">About</a>
            <br />
            <a href="" className="text-muted">Products</a>
            <br />
            <a href="" className="text-muted">Pricing</a>
            <br />
            <a href="" className="text-muted">Referral programme</a>
            <br />
            <a href="" className="text-muted">Careers</a>
            <br />
            <a href="" className="text-muted">Press & media</a>
            <br />
          </div>
          <div className="col">
            <p className="fs-5">Support</p>
            <a href="" className="text-muted">Contact</a>
            <br />
            <a href="" className="text-muted">Support portal</a>
            <br />
            <a href="" className="text-muted">Connect blog</a>
            <br />
            <a href="" className="text-muted">List of charges</a>
            <br />
          </div>
          <div className="col">
            <p className="fs-5">Account</p>
            <a href="" className="text-muted">Open an account</a>
            <br />
            <a href="" className="text-muted">Fund transfer</a>
            <br />
            <a href="" className="text-muted">60 day challenge</a>
            <br />
          </div>
        </div>
        <div className="mt-5 text-muted" style={{ fontSize: "12px" }}>
          <p>
          <strong>Disclaimer:</strong> This website is a personal project created for educational and demonstration purposes only. It is not a real stock trading platform and does not provide any financial, investment, or brokerage services. This platform is not registered with SEBI, NSE, BSE, MCX, CDSL, NSDL, or any other regulatory authority.
<br></br><br></br>
All information and features on this site are for learning purposes and should not be interpreted as financial advice or a recommendation to buy or sell any securities. Always consult a SEBI-registered stockbroker or financial advisor for real investment decisions.
<br></br><br></br>
<strong>Note:</strong> No real transactions or user data are processed or stored on this platform.
<br></br><br></br>
&copy; 2025, Stox All rights reserved.

          </p>
          <div className="footer-graveyard-links text-center">
    <ul>
      
      <a href="https://www.nseindia.com/" className="text-muted">NSE</a>   &nbsp;&nbsp;&nbsp;&nbsp;
  
      <a href="https://www.bseindia.com/" className="text-muted">BSE</a>
  
    </ul>


  </div>
        </div>
      </div>
    </footer>
  );

 
}

export default Footer;
