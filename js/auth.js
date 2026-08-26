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
  apiKey: "AIzaSyBPvGd0mCaql2yMeKK3UogRBDj3Ig9EYOI",
  authDomain: "bskrmostorfest.firebaseapp.com",
  databaseURL: "https://bskrmostorfest-default-rtdb.firebaseio.com",
  projectId: "bskrmostorfest",
  storageBucket: "bskrmostorfest.firebasestorage.app",
  messagingSenderId: "662332371404",
  appId: "1:662332371404:web:c70d8219c6e74fafffed69",
  measurementId: "G-WHH6X6227Z"
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

import { doc, setDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (authSection) authSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        
        const pilotName = user.email.split('@')[0].toUpperCase();
        if (userTagDisplay) {
            userTagDisplay.textContent = pilotName;
        }

        // GUARDAR O ACTUALIZAR AL PILOTO EN LA COLECCIÓN "members" AUTOMÁTICAMENTE
        try {
            const userRef = doc(db, "members", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                pilotName: pilotName,
                email: user.email,
                // Imagen por defecto de avatar o la de su perfil de Google si la hubiera
                photoUrl: user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=" + pilotName,
                lastLogin: new Date()
            }, { merge: true }); // { merge: true } evita que se sobrescriba si ya existe
        } catch (error) {
            console.error("Error al registrar miembro automáticamente: ", error);
        }

    } else {
        if (authSection) authSection.classList.remove('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
    }
});
// ==========================================
// LÓGICA DE ENVÍO DE RÉCORDS (Añadir al final de auth.js)
// ==========================================
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const recordForm = document.getElementById('record-form');

if (recordForm) {
    recordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar que el usuario esté autenticado
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Debes iniciar sesión para publicar un récord.");
            return;
        }

        const pilotName = currentUser.email.split('@')[0].toUpperCase();

        // Capturar los valores exactos de los inputs y selects de ingreso.html
        const categoryVal = document.getElementById('record-category').value;
        const trackVal = document.getElementById('record-track').value;
        const carCategoryVal = document.getElementById('car-category-select').value;
        const carVal = document.getElementById('car-input').value;
        const timeVal = document.getElementById('record-time').value;
        const videoVal = document.getElementById('record-video').value;

        try {
            // Guardar en la colección "records" que lee records.js
            await addDoc(collection(db, "records"), {
                pilot: pilotName,
                category: categoryVal,       // Grand Race, Summit, Playlist, Trackforge
                track: trackVal,             // Pista / Evento
                carCategory: carCategoryVal, // Clase de vehículo (Street, Hypercar, etc.)
                car: carVal,                 // Modelo del vehículo
                timeScore: timeVal,          // Tiempo o Puntuación
                videoUrl: videoVal,          // URL del video de evidencia
                createdAt: new Date()
            });

            alert("¡Récord publicado con éxito en el expediente!");
            recordForm.reset(); // Limpia el formulario tras el éxito

        } catch (error) {
            console.error("Error al publicar el récord: ", error);
            alert("Hubo un error al registrar en la base de datos: " + error.message);
        }
    });
}
