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

        if (querySnapshot.empty) {
            pilotsGrid.innerHTML = `<p style="text-align: center; color: #6b7280; grid-column: 1 / -1;">No hay récords publicados todavía en el expediente.</p>`;
            return;
        }

        const recordsArray = [];
        querySnapshot.forEach((doc) => {
            recordsArray.push(doc.data());
        });

        // Agrupamos los récords por el campo 'pilot'
        const pilotosMap = {};
        recordsArray.forEach((data) => {
            const piloto = data.pilot || data.pilotName || "Piloto Anónimo";
            
            if (!pilotosMap[piloto]) {
                pilotosMap[piloto] = [];
            }
            
            pilotosMap[piloto].push({
                track: data.track || data.event || "Evento General",
                category: data.category || "General", // Grand Race, Trackforge, Playlist, etc.
                car: data.car || data.vehiculo || "No especificado",
                carCategory: data.carCategory || data.categoriaVehiculo || "", // Categoría seleccionada del auto
                time: data.timeScore || data.time || "N/A",
                videoUrl: data.videoUrl || ""
            });
        });

        // Dibujamos las tarjetas de los pilotos
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

            card.addEventListener('click', () => {
                mostrarDetallePiloto(nombrePiloto, recordsDelPiloto);
            });

            pilotsGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar los récords: ", error);
        pilotsGrid.innerHTML = `<p style="text-align: center; color: #ff0055; grid-column: 1 / -1;">Error al conectar con la base de datos.</p>`;
    }
}

function mostrarDetallePiloto(nombre, records) {
    pilotsGrid.classList.add('hidden');
    pilotRecordsSection.classList.remove('hidden');
    selectedPilotTitle.textContent = `Expediente de Piloto: [BSKR] ${nombre}`;
    
    pilotRecordsTbody.innerHTML = "";

    records.forEach(rec => {
        const tr = document.createElement('tr');
        
        // Estilo profesional tipo insignia para la categoría de la ruta
        let badgeColor = "#3b82f6"; // Azul por defecto
        const catLower = rec.category.toLowerCase();
        if (catLower.includes('grand race')) badgeColor = "#eab308"; // Amarillo
        else if (catLower.includes('track')) badgeColor = "#ef4444"; // Rojo
        else if (catLower.includes('playlist')) badgeColor = "#8b5cf6"; // Morado

        const badgeHtml = `<span style="display: inline-block; background: ${badgeColor}22; color: ${badgeColor}; border: 1px solid ${badgeColor}; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 8px;">${rec.category}</span>`;

        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${rec.track}</div>
                <div style="margin-top: 4px;">${badgeHtml}</div>
            </td>
            <td>
                <div style="color: #fff; font-weight: 500;">${rec.car}</div>
                ${rec.carCategory ? `<div style="font-size: 12px; color: #ffe600; margin-top: 3px; font-weight: 600;">Clase: ${rec.carCategory}</div>` : ''}
            </td>
            <td style="color: #ffe600; font-weight: bold; font-family: 'Orbitron', sans-serif;">${rec.time}</td>
            <td>${rec.videoUrl ? `<a href="${rec.videoUrl}" target="_blank" class="link-video">Ver Prueba</a>` : 'Sin video'}</td>
        `;
        pilotRecordsTbody.appendChild(tr);
    });
}

if (btnBackToPilots) {
    btnBackToPilots.addEventListener('click', () => {
        pilotRecordsSection.classList.add('hidden');
        pilotsGrid.classList.remove('hidden');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarExpedientes();
});