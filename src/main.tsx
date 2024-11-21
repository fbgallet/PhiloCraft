import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./routes/index.tsx";

import "@xyflow/react/dist/style.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
