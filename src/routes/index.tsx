import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:lang" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
