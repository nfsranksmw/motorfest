import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Tus credenciales de Firebase
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
const db = getFirestore(app);
const auth = getAuth(app);

// 1. GESTIÓN DEL FORMULARIO DE RÉCORDS (ingreso.html)
const recordForm = document.getElementById('record-form');

if (recordForm) {
    recordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        
        // Obtenemos los valores del formulario
        const category = document.getElementById('record-category').value;
        const track = document.getElementById('record-track').value;
        const timeScore = document.getElementById('record-time').value;
        const videoUrl = document.getElementById('record-video').value;
        
        // Si hay un usuario logueado usamos su correo, si no, uno genérico de prueba
        const pilotName = user ? user.email.split('@')[0].toUpperCase() : "PILOTO BSKR";

        try {
            console.log("Enviando récord a Firestore...");
            
            await addDoc(collection(db, "records"), {
                pilot: pilotName,
                category: category,
                track: track,
                timeScore: timeScore,
                videoUrl: videoUrl,
                createdAt: new Date()
            });

            alert("¡Récord publicado con éxito!");
            recordForm.reset();
        } catch (error) {
            console.error("Error al registrar en Firestore: ", error);
            alert("Error al subir el récord. Revisa la consola.");
        }
    });
}

// 2. CARGAR RÉCORDS EN LA TABLA (expediente.html)
const tableBody = document.getElementById('records-table-body');

async function cargarRecords() {
    if (!tableBody) return;

    try {
        const querySnapshot = await getDocs(collection(db, "records"));
        
        tableBody.innerHTML = ""; 

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
        console.error("Error al leer de Firestore: ", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ff0055;">Error al cargar la base de datos.</td></tr>`;
    }
}

if (tableBody) {
    cargarRecords();
}
// Variable global para guardar los récords y filtrarlos sin recargar
let todosLosRecords = [];

const tableBody = document.getElementById('records-table-body');

async function cargarRecords() {
    if (!tableBody) return;

    try {
        const querySnapshot = await getDocs(collection(db, "records"));
        
        tableBody.innerHTML = ""; 

        if (querySnapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #6b7280;">No hay récords registrados todavía. ¡Sé el primero!</td></tr>`;
            return;
        }

        todosLosRecords = []; // Limpiar array
        querySnapshot.forEach((doc) => {
            todosLosRecords.push(doc.data());
        });

        // Mostrar todos por defecto
        pintarTabla(todosLosRecords);

    } catch (error) {
        console.error("Error al leer de Firestore: ", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ff0055;">Error al cargar la base de datos.</td></tr>`;
    }
}

// Función para pintar la tabla dinámicamente
function pintarTabla(records) {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (records.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #6b7280;">No hay récords en esta categoría.</td></tr>`;
        return;
    }

    records.forEach((data) => {
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
}

// Función global de filtrado por categoría al hacer clic en los botones
window.filtrarCategoria = function(categoria, botonElemento) {
    // Cambiar estilo visual de los botones activos
    const botones = document.querySelectorAll('.filter-btn');
    botones.keyValues?.forEach(b => b.classList.remove('active'));
    // O de forma más limpia:
    botones.forEach(btn => btn.style.background = '#1a1a1a'); // Color inactivo
    botones.forEach(btn => btn.style.color = '#fff');
    
    if(botonElemento) {
        botonElemento.style.background = '#ffe600'; // Amarillo Motorfest
        botonElemento.style.color = '#000';
        botonElemento.style.fontWeight = 'bold';
    }

    if (categoria === 'Todos') {
        pintarTabla(todosLosRecords);
    } else {
        const filtrados = todosLosRecords.filter(r => r.category === categoria);
        pintarTabla(filtrados);
    }
};

if (tableBody) {
    cargarRecords();
}
