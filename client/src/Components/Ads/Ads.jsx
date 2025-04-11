import { useEffect } from "react";

const AdComponent = ({ adCode }) => {
  useEffect(() => {
    // Create a temporary container to parse the adCode HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = adCode;

    // Append each child of tempDiv to the ad container
    const adContainer = document.getElementById("ad-container");
    while (tempDiv.firstChild) {
      adContainer.appendChild(tempDiv.firstChild);
    }
  }, [adCode]);

  return (
    <>
      <div id="ad-container"></div>
    </>
  );
};

export default AdComponent;
