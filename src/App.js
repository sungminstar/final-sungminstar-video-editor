import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VideoEditor from "./pages/VideoEditor/VideoEditor";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VideoEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
