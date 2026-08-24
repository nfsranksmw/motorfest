import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración de Firebase (asegúrate de que estos datos sean los de tu proyecto real)
const firebaseConfig = {
    apiKey: "AIzaSyBPvGd0mCaql2yMeKK3UogRBDj3Ig9EYOI",
  authDomain: "bskrmostorfest.firebaseapp.com",
  databaseURL: "https://bskrmostorfest-default-rtdb.firebaseio.com",
  projectId: "bskrmostorfest",
  storageBucket: "bskrmostorfest.firebasestorage.app",
  messagingSenderId: "662332371404",
  appId: "1:662332371404:web:c70d8219c6e74fafffed69"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 1. GUARDAR RÉCORD (Desde ingreso.html)
// ==========================================
const recordForm = document.getElementById('record-form');

if (recordForm) {
    recordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const pilot = document.getElementById('record-pilot').value;
        const category = document.getElementById('record-category').value;
        const track = document.getElementById('record-track').value;
        const timeScore = document.getElementById('record-time').value;
        const videoUrl = document.getElementById('record-video').value;

        try {
            // Guardar en la colección "records" de Firestore
            await addDoc(collection(db, "records"), {
                pilot: pilot,
                category: category,
                track: track,
                timeScore: timeScore,
                videoUrl: videoUrl,
                createdAt: new Date()
            });

            alert("¡Récord publicado con éxito en el sistema BSKR!");
            recordForm.reset();
        } catch (error) {
            console.error("Error detallado al publicar el récord: ", error);
            alert("Error al publicar el récord. Revisa la consola para más detalles.");
        }
    });
}

// ==========================================
// 2. CARGAR RÉCORDS EN LA TABLA (En expediente.html)
// ==========================================
const tableBody = document.getElementById('records-table-body');

async function cargarRecords() {
    if (!tableBody) return;

    try {
        const querySnapshot = await getDocs(collection(db, "records"));
        
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
                <td><span style="color: #ffe600; font-weight: bold;">${data.category}</span></td>
                <td>${data.track}</td>
                <td>${data.timeScore}</td>
                <td><a href="${data.videoUrl}" target="_blank" class="link-video">Ver Video 🎥</a></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar los récords: ", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ff0055;">Error al conectar con la base de datos.</td></tr>`;
    }
}

if (tableBody) {
    cargarRecords();
}
