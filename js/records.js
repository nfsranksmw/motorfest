// ==========================================
// LÓGICA DE GESTIÓN DE RÉCORDS (Firestore)
// Archivo: js/records.js
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Utiliza la misma configuración de Firebase que en auth.js
const firebaseConfig = {
    apiKey: "AIzaSyBPvGd0mCaql2yMeKK3UogRBDj3Ig9EYOI",
    authDomain: "bskrmostorfest.firebaseapp.com",
    projectId: "bskrmostorfest",
    storageBucket: "bskrmostorfest.firebasestorage.app",
    messagingSenderId: "662332371404",
    appId: "1:662332371404:web:c70d8219c6e74fafffed69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Manejar el formulario de subida de récords (en ingreso.html)
const recordForm = document.getElementById('record-form');
if (recordForm) {
    recordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            alert("Debes iniciar sesión para publicar un récord.");
            return;
        }

        const category = document.getElementById('record-category').value;
        const track = document.getElementById('record-track').value;
        const timeScore = document.getElementById('record-time').value;
        const videoUrl = document.getElementById('record-video').value;
        const pilotName = user.email.split('@')[0].toUpperCase();

        try {
            await addDoc(collection(db, "records"), {
                pilot: pilotName,
                category: category,
                track: track,
                timeScore: timeScore,
                videoUrl: videoUrl,
                date: new Date()
            });

            alert("¡Récord publicado con éxito en el expediente!");
            recordForm.reset();
            window.location.href = "expediente.html"; // Redirigir a la tabla
        } catch (error) {
            console.error("Error al guardar el récord: ", error);
            alert("Hubo un error al publicar el récord.");
        }
    });
}

// Cargar los récords en la tabla (en expediente.html)
const tableBody = document.getElementById('records-table-body');
async function cargarRecords() {
    if (!tableBody) return;

    try {
        const q = query(collection(db, "records"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        
        tableBody.innerHTML = ""; // Limpiar texto de carga

        if (querySnapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #6b7280;">No hay récords registrados todavía. ¡Sé el primero!</td></tr>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${data.pilot}</strong></td>
                <td><span class="badge-${data.category.toLowerCase().replace(/\s/g, '')}">${data.category}</span></td>
                <td>${data.track}</td>
                <td>${data.timeScore}</td>
                <td><a href="${data.videoUrl}" target="_blank" class="link-video">Ver Video 🎥</a></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar los récords: ", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ff0055;">Error al cargar los datos de la base de datos.</td></tr>`;
    }
}

// Ejecutar si estamos en expediente.html
if (tableBody) {
    cargarRecords();
}
