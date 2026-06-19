import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./components/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";              // framework CSS Bootstrap
import "@fortawesome/fontawesome-free/css/all.min.css";     // ikon FontAwesome

import "/src/assets/css/custom-style/Login.css";            // style halaman login
import "/src/assets/css/custom-style/compheader.css";       // style sidebar dan topbar
import "/src/assets/css/custom-style/content.css";          // style global seluruh halaman konten
import "/src/assets/css/custom-style/staffcustom.css";      // style khusus halaman portal staff

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);