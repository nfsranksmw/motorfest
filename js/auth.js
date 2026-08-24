// ==========================================
// CONFIGURACIÓN Y LÓGICA DE AUTENTICACIÓN
// Archivo: js/auth.js
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// TODO: Cambia estos valores por los que te proporcione tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY_DE_FIREBASE",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const userTagDisplay = document.getElementById('user-tag-display');
const btnLogout = document.getElementById('btn-logout');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, loginEmailInput.value, loginPasswordInput.value);
        } catch (error) {
            alert("Error al iniciar sesión: " + error.message);
        }
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert("Has cerrado sesión.");
        } catch (error) {
            console.error("Error al salir: ", error);
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (authSection) authSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        if (userTagDisplay) {
            userTagDisplay.textContent = user.email.split('@')[0].toUpperCase();
        }
    } else {
        if (authSection) authSection.classList.remove('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
    }
});

export { auth };
