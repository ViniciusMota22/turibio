import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = document.getElementById("root");
const tree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
// O HTML de cada rota já vem pré-renderizado; hidratamos em vez de recriar.
if (root.hasChildNodes()) hydrateRoot(root, tree);
else createRoot(root).render(tree);
