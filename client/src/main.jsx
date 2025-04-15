import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const rootUrl = `${window.location.origin}`;
document
  .querySelector('meta[property="og:url"]')
  .setAttribute("content", rootUrl);

const rootUrlPreviewImage = `${window.location.origin}/preview.png`;
document
  .querySelector('meta[property="og:image"]')
  .setAttribute("content", rootUrlPreviewImage);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
