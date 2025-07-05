import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDesription,
}) {
  return (
    <div className="container ">
      <div className="row">
        <div className="col-6 ">
          <img src={imageURL} />
        </div>
        <div className="col-6 p-5">
         <br></br><br></br>
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          
          
        </div>
      </div>
    </div>
  );
}

export default LeftSection;