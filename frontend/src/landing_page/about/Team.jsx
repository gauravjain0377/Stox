import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">People</h1>
      </div>

      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-3 text-center">
          <img
            src="media/images/Gaurav_Jain.png"
            style={{ borderRadius: "100%", width: "50%" }}
          />
          <h4 className="mt-5">Gaurav Jain</h4>
          <h6>Founder, CEO</h6>
        </div>
        <div className="col-6 p-3">
          <br></br> <br></br>
          <p>
            Gaurav bootstrapped and founded Stock Trading Platform in 2025 to overcome the
            hurdles he faced during his decade long stint as a trader.
          </p>
          <p>Playing cricket is his zen.</p>
          <p>
            Connect on <a href="https://www.linkedin.com/in/this-is-gaurav-jain/">LinkedIn</a> / <a href="https://github.com/gauravjain0377">Github</a> /{" "}
            <a href="https://x.com/gauravjain0377">X</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;