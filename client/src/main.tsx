import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Link to Material Icons for sidebar and UI elements
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
link.rel = "stylesheet";
document.head.appendChild(link);

// Add title
const title = document.createElement("title");
title.textContent = "Creator AI - Self-Hosted Content Creation Suite";
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
