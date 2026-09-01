// ==========================================
// LÓGICA DE CATEGORÍAS, PLAYLISTS Y RANKINGS
// Archivo: js/playlists.js
// ==========================================

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

// Metadatos y banners estéticos para las categorías principales de rutas
const categoryMetadata = {
    "playlist": {
        name: "Playlists Oficiales",
        desc: "Eventos temáticos y culturales de The Crew Motorfest.",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80"
    },
    "grand race": {
        name: "Grand Race",
        desc: "Carreras masivas multiclase de alta intensidad.",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
    },
    "summit": {
        name: "The Summit Contest",
        desc: "Eventos competitivos semanales y marcadores de élite.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80"
    },
    "trackforge": {
        name: "Trackforge",
        desc: "Pruebas contrarreloj y circuitos de precisión técnica.",
        image: "https://images.unsplash.com/photo-1541348263662-e0626628d0cf?auto=format&fit=crop&w=600&q=80"
    },
    "main stage": {
        name: "Main Stage",
        desc: "Desafíos principales de la temporada actual.",
        image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=600&q=80"
    }
};

let allRecordsCache = [];
let selectedCategory = null;
let selectedTrackOrEvent = null;

const gridElement = document.getElementById('dynamicGrid');
const mainTitle = document.getElementById('mainTitle');
const mainSubtitle = document.getElementById('mainSubtitle');
const breadcrumbContainer = document.getElementById('breadcrumbContainer');
const breadcrumbPath = document.getElementById('breadcrumbPath');

// Función para renderizar la insignia estilizada de la plataforma con la "M" de Motorfest
function renderPlatformBadge(platformName) {
    if (!platformName) return `<span style="color: #6b7280; font-size: 0.8rem;">N/A</span>`;

    const p = platformName.trim().toLowerCase();
    let platformText = platformName.toUpperCase();
    let textColor = "#ffffff"; // Blanco por defecto

    if (p.includes("pc")) {
        platformText = "PC";
        textColor = "#ffffff";
    } else if (p.includes("xbox") || p.includes("series") || p.includes("xsx")) {
        platformText = "XBOX";
        textColor = "#107c10"; // Verde Xbox
    } else if (p.includes("playstation") || p.includes("ps5") || p.includes("ps4") || p.includes("play") || p.includes("ps")) {
        platformText = "PLAYSTATION";
        textColor = "#0070d1"; // Azul PlayStation
    }

    // La "M" inclinada en amarillo característica de Motorfest
    const mLogo = `<span style="font-family: 'Orbitron', sans-serif; font-weight: bold; font-style: italic; color: #ffe600; font-size: 13px; margin-right: 3px;">M</span>`;

    return `
        <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.07); padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            ${mLogo}
            <span style="color: ${textColor}; font-weight: bold; font-size: 11px; letter-spacing: 0.5px; font-family: 'Orbitron', sans-serif;">${platformText}</span>
        </span>
    `;
}

// 1. Cargar datos desde Firebase
async function cargarRegistrosDesdeFirebase() {
    if (!gridElement) return;

    try {
        gridElement.innerHTML = `<p style="color: #9ca3af; grid-column: 1 / -1; text-align: center; padding: 30px;">Cargando categorías y récords...</p>`;
        
        const querySnapshot = await getDocs(collection(db, "records"));
        
        if (querySnapshot.empty) {
            gridElement.innerHTML = `<p style="text-align: center; color: #6b7280; grid-column: 1 / -1; padding: 30px;">No hay récords publicados todavía.</p>`;
            return;
        }

        allRecordsCache = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            allRecordsCache.push({
                pilot: data.pilot || "Piloto Anónimo",
                track: data.track || "Evento General",
                category: data.category ? data.category.trim() : "Playlist",
                car: data.car || "No especificado",
                carCategory: data.carCategory || data.categoriaVehiculo || "Categoría Estándar",
                platform: data.platform || data.plataforma || "",
                time: data.timeScore || data.time || "N/A",
                videoUrl: data.videoUrl || ""
            });
        });

        renderCategoriesView();

    } catch (error) {
        console.error("Error al conectar con Firebase: ", error);
        gridElement.innerHTML = `<p style="text-align: center; color: #ff0055; grid-column: 1 / -1; padding: 30px;">Error al conectar con la base de datos.</p>`;
    }
}

// 2. VISTA 1: Tarjetas principales de Categorías (Playlist, Grand Race, Summit, etc.)
window.renderCategoriesView = function() {
    selectedCategory = null;
    selectedTrackOrEvent = null;

    if (breadcrumbContainer) breadcrumbContainer.style.display = 'none';
    if (mainTitle) mainTitle.innerText = "Playlists y Competiciones";
    if (mainSubtitle) mainSubtitle.innerText = "Selecciona una categoría de competición para explorar sus eventos y rankings.";

    if (allRecordsCache.length === 0) {
        gridElement.innerHTML = `<p style="text-align: center; color: #9ca3af; grid-column: 1 / -1; padding: 40px;">No hay registros disponibles.</p>`;
        return;
    }

    const categoriesMap = {};
    allRecordsCache.forEach(rec => {
        const catName = rec.category;
        const catKey = catName.toLowerCase();

        if (!categoriesMap[catKey]) {
            categoriesMap[catKey] = {
                originalName: catName,
                count: 0
            };
        }
        categoriesMap[catKey].count++;
    });

    let html = '';
    Object.keys(categoriesMap).forEach(key => {
        const item = categoriesMap[key];
        const meta = categoryMetadata[key] || {
            name: item.originalName,
            desc: `Competiciones oficiales de la categoría ${item.originalName}.`,
            image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80"
        };

        html += `
            <div class="card-item" onclick="selectCategoryCard('${item.originalName.replace(/'/g, "\\'")}')" style="background: #161616; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.2s;">
                <img src="${meta.image}" alt="${meta.name}" style="width: 100%; height: 160px; object-fit: cover;">
                <div style="padding: 20px;">
                    <h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 8px;">${meta.name}</h3>
                    <p style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 15px; line-height: 1.4;">${meta.desc}</p>
                    <div style="color: #facc15; font-weight: bold; font-size: 0.9rem;">Explorar (${item.count} registros) →</div>
                </div>
            </div>
        `;
    });

    gridElement.innerHTML = html;
};

// 3. VISTA 2: Eventos / Tracks dentro de la categoría seleccionada
window.selectCategoryCard = function(categoryName) {
    selectedCategory = categoryName;
    selectedTrackOrEvent = null;

    if (breadcrumbContainer) breadcrumbContainer.style.display = 'flex';
    if (breadcrumbPath) {
        breadcrumbPath.innerHTML = `<span>/</span> <a href="#" onclick="renderCategoriesView(); return false;" style="color:#facc15; text-decoration:none;">Categorías</a> <span style="color:#fff;">/ ${categoryName}</span>`;
    }
    if (mainTitle) mainTitle.innerText = categoryName;
    if (mainSubtitle) mainSubtitle.innerText = "Selecciona el evento o ruta específica.";

    const recordsInCategory = allRecordsCache.filter(r => r.category.trim().toLowerCase() === categoryName.toLowerCase());

    const tracksMap = {};
    recordsInCategory.forEach(rec => {
        const trackName = rec.track.trim();
        if (!tracksMap[trackName]) tracksMap[trackName] = 0;
        tracksMap[trackName]++;
    });

    let html = '';
    Object.keys(tracksMap).forEach(trackName => {
        const count = tracksMap[trackName];
        html += `
            <div class="card-item" onclick="selectTrackCard('${trackName.replace(/'/g, "\\'")}')" style="background: #161616; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; cursor: pointer;">
                <span style="font-size: 0.75rem; color: #facc15; font-weight: bold; text-transform: uppercase;">Evento / Ruta</span>
                <h3 style="color: #fff; font-size: 1.2rem; margin: 10px 0 8px 0;">${trackName}</h3>
                <p style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 15px;">${count} registro(s) guardados.</p>
                <div style="color: #facc15; font-weight: bold; font-size: 0.9rem;">Ver Clases de Vehículos ⚡</div>
            </div>
        `;
    });

    gridElement.innerHTML = html;
};

// 4. VISTA 3: Clases de Vehículos para ese evento o ruta
window.selectTrackCard = function(trackName) {
    selectedTrackOrEvent = trackName;

    if (breadcrumbContainer) breadcrumbContainer.style.display = 'flex';
    if (breadcrumbPath) {
        breadcrumbPath.innerHTML = `
            <span>/</span> <a href="#" onclick="renderCategoriesView(); return false;" style="color:#facc15; text-decoration:none;">Categorías</a> 
            <span>/</span> <a href="#" onclick="selectCategoryCard('${selectedCategory.replace(/'/g, "\\'")}')" style="color:#facc15; text-decoration:none;">${selectedCategory}</a> 
            <span style="color:#fff;">/ ${trackName}</span>
        `;
    }
    if (mainTitle) mainTitle.innerText = trackName;
    if (mainSubtitle) mainSubtitle.innerText = "Selecciona la categoría de vehículo para ver el ranking de tiempos.";

    const recordsInTrack = allRecordsCache.filter(r => r.track.trim().toLowerCase() === trackName.toLowerCase());

    const carCategoriesMap = {};
    recordsInTrack.forEach(rec => {
        const carCat = rec.carCategory || "Sin Categoría";
        if (!carCategoriesMap[carCat]) {
            carCategoriesMap[carCat] = 0;
        }
        carCategoriesMap[carCat]++;
    });

    let html = '';
    Object.keys(carCategoriesMap).forEach(carCat => {
        const count = carCategoriesMap[carCat];
        html += `
            <div class="card-item" onclick="selectCarCategoryCard('${trackName.replace(/'/g, "\\'")}', '${carCat.replace(/'/g, "\\'")}')" style="background: #161616; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; cursor: pointer;">
                <span style="font-size: 0.75rem; color: #ffe600; font-weight: bold; text-transform: uppercase;">Clase de Vehículo</span>
                <h3 style="color: #fff; font-size: 1.2rem; margin: 10px 0 8px 0;">${carCat}</h3>
                <p style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 15px;">${count} registro(s) en esta clase.</p>
                <div style="color: #facc15; font-weight: bold; font-size: 0.9rem;">Ver Tabla Ranked 🏆</div>
            </div>
        `;
    });

    gridElement.innerHTML = html;
};

// 5. VISTA 4: Tabla Ranked Final por Evento y Categoría de Vehículo
window.selectCarCategoryCard = function(trackName, carCategory) {
    if (breadcrumbContainer) breadcrumbContainer.style.display = 'flex';
    if (breadcrumbPath) {
        breadcrumbPath.innerHTML = `
            <span>/</span> <a href="#" onclick="renderCategoriesView(); return false;" style="color:#facc15; text-decoration:none;">Categorías</a> 
            <span>/</span> <a href="#" onclick="selectCategoryCard('${selectedCategory.replace(/'/g, "\\'")}')" style="color:#facc15; text-decoration:none;">${selectedCategory}</a> 
            <span>/</span> <a href="#" onclick="selectTrackCard('${selectedTrackOrEvent.replace(/'/g, "\\'")}')" style="color:#facc15; text-decoration:none;">${selectedTrackOrEvent}</a> 
            <span style="color:#fff;">/ ${carCategory}</span>
        `;
    }
    if (mainTitle) mainTitle.innerText = `${trackName} - ${carCategory}`;
    if (mainSubtitle) mainSubtitle.innerText = `Ranking oficial ordenado por el mejor tiempo en la clase ${carCategory}.`;

    const finalRecords = allRecordsCache.filter(r => 
        r.track.trim().toLowerCase() === trackName.toLowerCase() && 
        (r.carCategory || "Sin Categoría").trim().toLowerCase() === carCategory.trim().toLowerCase()
    );

    if (finalRecords.length === 0) {
        gridElement.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #9ca3af; padding: 40px;">No hay tiempos registrados para esta categoría.</div>`;
        return;
    }

    finalRecords.sort((a, b) => a.time.localeCompare(b.time));

    let rows = '';
    finalRecords.forEach((rec, index) => {
        let medal = `#${index + 1}`;
        if (index === 0) medal = '🥇 1º';
        if (index === 1) medal = '🥈 2º';
        if (index === 2) medal = '🥉 3º';

        rows += `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 14px 20px; font-weight: bold; color: #facc15; font-size: 1.1rem;">${medal}</td>
                <td style="padding: 14px 20px; font-weight: 600; color: #fff;">[BSKR] ${rec.pilot}</td>
                <td style="padding: 14px 20px; color: #9ca3af;">${rec.car}</td>
                <td style="padding: 14px 20px;">${renderPlatformBadge(rec.platform)}</td>
                <td style="padding: 14px 20px; font-family: 'Orbitron', sans-serif; color: #facc15; font-weight: bold; font-size: 1.1rem;">${rec.time}</td>
                <td style="padding: 14px 20px;">${rec.videoUrl ? `<a href="${rec.videoUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">Ver Prueba</a>` : 'Sin video'}</td>
            </tr>
        `;
    });

    gridElement.innerHTML = `
        <div style="grid-column: 1 / -1; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; background: #161616; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08);">
                <thead>
                    <tr style="background: rgba(250, 204, 21, 0.1); color: #facc15; font-family: 'Orbitron', sans-serif; text-transform: uppercase; font-size: 0.85rem;">
                        <th style="padding: 14px 20px; text-align: left;">Rank</th>
                        <th style="padding: 14px 20px; text-align: left;">Piloto</th>
                        <th style="padding: 14px 20px; text-align: left;">Vehículo</th>
                        <th style="padding: 14px 20px; text-align: left;">Plataforma</th>
                        <th style="padding: 14px 20px; text-align: left;">Tiempo Oficial</th>
                        <th style="padding: 14px 20px; text-align: left;">Prueba</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
};

document.addEventListener("DOMContentLoaded", () => {
    cargarRegistrosDesdeFirebase();
});