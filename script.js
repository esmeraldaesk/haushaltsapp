// 🔐 Initialisiert Firebase mit ausgelagerter Konfiguration
// ⚠️ 'config.js' muss im gleichen Ordner liegen, aber NICHT im Git-Repo!

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

const app = initializeApp(firebaseConfig);

// ... hier folgt deine bisherige App-Logik (CSV, Speicher etc.)
