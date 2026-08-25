import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const pilotsGrid = document.getElementById('pilots-grid');
const pilotRecordsSection = document.getElementById('pilot-records-section');
const selectedPilotTitle = document.getElementById('selected-pilot-title');
const pilotRecordsTbody = document.getElementById('pilot-records-tbody');
const btnBackToPilots = document.getElementById('btn-back-to-pilots');

async function cargarExpedientes() {
    if (!pilotsGrid) return;

    try {
        pilotsGrid.innerHTML = `<p style="color: #9ca3af; grid-column: 1 / -1;">Cargando registros de pilotos...</p>`;
        
        // Suponemos que tus récords se guardan en una colección llamada "records" en Firebase
        // Cada documento debe tener campos como: pilotName, event, car, time, videoUrl (opcional)
        const querySnapshot = await getDocs(collection(db, "records"));
        
        pilotsGrid.innerHTML = "";

        if (querySnapshot.empty) {
            pilotsGrid.innerHTML = `<p style="text-align: center; color: #6b7280; grid-column: 1 / -1;">No hay récords publicados todavía en el expediente.</p>`;
            return;
        }

        // Agrupamos los récords por nombre de piloto
        const pilotosMap = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const piloto = data.pilotName || "Piloto Anónimo";
            
            if (!pilotosMap[piloto]) {
                pilotosMap[piloto] = [];
            }
            pilotosMap[piloto].push(data);
        });

        // Dibujamos una tarjeta por cada piloto encontrado en la base de datos
        Object.keys(pilotosMap).forEach((nombrePiloto) => {
            const recordsDelPiloto = pilotosMap[nombrePiloto];
            
            const card = document.createElement('div');
            card.className = "member-card";
            card.style.cursor = "pointer";
            
            card.innerHTML = `
                <div class="member-info" style="padding: 30px 20px;">
                    <h3 style="font-size: 1.2rem; color: #fff; margin-bottom: 8px;">[BSKR] ${nombrePiloto}</h3>
                    <div class="member-role" style="margin-bottom: 15px;">🏁 Récords Registrados: ${recordsDelPiloto.length}</div>
                    <button class="btn-primary" style="font-size: 11px; padding: 6px 14px; pointer-events: none;">Ver Expediente</button>
                </div>
            `;

            // Al hacer clic en la tarjeta, ocultamos el grid y mostramos la tabla de este piloto específico
            card.addEventListener('click', () => {
                mostrarDetallePiloto(nombrePiloto, recordsDelPiloto);
            });

            pilotsGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar los récords: ", error);
        pilotsGrid.innerHTML = `<p style="text-align: center; color: #ff0055; grid-column: 1 / -1;">Error al conectar con la base de datos de récords.</p>`;
    }
}

function mostrarDetallePiloto(nombre, records) {
    pilotsGrid.classList.add('hidden');
    pilotRecordsSection.classList.remove('hidden');
    selectedPilotTitle.textContent = `Expediente de Piloto: [BSKR] ${nombre}`;
    
    pilotRecordsTbody.innerHTML = "";

    records.forEach(rec => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rec.event || 'Evento General'}</td>
            <td>${rec.car || 'No especificado'}</td>
            <td style="color: #ffe600; font-weight: bold;">${rec.time || 'N/A'}</td>
            <td>${rec.videoUrl ? `<a href="${rec.videoUrl}" target="_blank" class="link-video">Ver Prueba</a>` : 'Sin video'}</td>
        `;
        pilotRecordsTbody.appendChild(tr);
    });
}

// Botón para regresar al listado general de tarjetas
if (btnBackToPilots) {
    btnBackToPilots.addEventListener('click', () => {
        pilotRecordsSection.classList.add('hidden');
        pilotsGrid.classList.remove('hidden');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarExpedientes();
});