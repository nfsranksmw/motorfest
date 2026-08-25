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
        
        const querySnapshot = await getDocs(collection(db, "records"));
        
        pilotsGrid.innerHTML = "";

        let recordsArray = [];

        if (querySnapshot.empty) {
            console.warn("Firebase no tiene registros aún. Usando datos de prueba.");
            // Datos de prueba para que las tarjetas se dibujen obligatoriamente y veas el funcionamiento
            recordsArray = [
                { pilotName: "NeonQueen", event: "Grand Race - Oahu", car: "Nissan GT-R R35", time: "01:42.500", videoUrl: "#" },
                { pilotName: "Zimanx", event: "Summit Contest", car: "Porsche 911 GT3", time: "00:58.120", videoUrl: "#" }
            ];
        } else {
            querySnapshot.forEach((doc) => {
                recordsArray.push(doc.data());
            });
        }

        // Agrupamos los récords por nombre de piloto
        const pilotosMap = {};
        recordsArray.forEach((data) => {
            const piloto = data.pilotName || data.nombre || "Piloto Anónimo";
            
            if (!pilotosMap[piloto]) {
                pilotosMap[piloto] = [];
            }
            pilotosMap[piloto].push(data);
        });

        // Dibujamos las tarjetas en pantalla
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

            // Al hacer clic, muestra la tabla del piloto
            card.addEventListener('click', () => {
                mostrarDetallePiloto(nombrePiloto, recordsDelPiloto);
            });

            pilotsGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar los récords: ", error);
        pilotsGrid.innerHTML = `<p style="text-align: center; color: #ff0055; grid-column: 1 / -1;">Error al conectar con la base de datos. Revisa la consola (F12).</p>`;
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
            <td>${rec.videoUrl && rec.videoUrl !== "#" ? `<a href="${rec.videoUrl}" target="_blank" class="link-video">Ver Prueba</a>` : 'Sin video'}</td>
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