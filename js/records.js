import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

        todosLosRecords = [];
        querySnapshot.forEach((doc) => {
            todosLosRecords.push(doc.data());
        });

        pintarTabla(todosLosRecords);

    } catch (error) {
        console.error("Error al leer de Firestore: ", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ff0055;">Error al cargar la base de datos.</td></tr>`;
    }
}

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

// Conectar los botones de filtro de manera limpia desde JS (sin usar onclick en el HTML)
document.addEventListener("DOMContentLoaded", () => {
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Quitar clase active a todos y ponerla al presionado
            botonesFiltro.forEach(b => {
                b.style.background = '#1a1a1a';
                b.style.color = '#fff';
            });
            e.target.style.background = '#ffe600';
            e.target.style.color = '#000';
            e.target.style.fontWeight = 'bold';

            const categoria = e.target.getAttribute('data-category');
            
            if (categoria === 'Todos') {
                pintarTabla(todosLosRecords);
            } else {
                const filtrados = todosLosRecords.filter(r => r.category === categoria);
                pintarTabla(filtrados);
            }
        });
    });

    if (tableBody) {
        cargarRecords();
    }
});
