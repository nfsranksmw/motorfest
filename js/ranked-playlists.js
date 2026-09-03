// ==========================================
// LÓGICA DE RANKED PLAYLISTS, OCR (CON SOPORTE JXR) Y FILTRADO POR CATEGORÍAS
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Categorías principales de vehículos permitidas en las pestañas de filtrado
const vehicleCategories = [
    "Todas", 
    "Street Tier 1", 
    "Street Tier 2", 
    "Racing", 
    "Hypercar", 
    "Alpha GP", 
    "Rally Raid", 
    "Rally"
];

// Base de datos de Playlists
const playlistsData = [
    { 
        id: "made-in-japan", 
        name: "Made in Japan", 
        desc: "Carreras nocturnas, luces de neón y cultura del derrape nipón.", 
        events: ["Daikoku Welcome", "Shakotan Yoshiki", "Kyusha Spirit", "Touge Battle", "Neon Underground", "Mid Night Melee", "Meiji Drift (Desafío final)"] 
    },
    { 
        id: "porsche-911", 
        name: "911 Legacy: A Porsche Story", 
        desc: "Un recorrido histórico dedicado por completo al mítico coche de Porsche.", 
        events: ["Arrival (Street Race - Porsche)", "Rally (Rally Raid - Porsche Raid)", "Legends (Street Race - Porsche Turbo 3.6)", "Freeway (Hypercar - Porsche GT1)", "Grand Prix (Touring Car - Porsche GT3 Cup)", "Challenge (Street Race - Carrera 4S)"]
    },
    { 
        id: "lamborghini", 
        name: "Automobili Lamborghini", 
        desc: "Experiencia de velocidad pura enfocada en los superdeportivos de la firma italiana.", 
        events: ["Creating a Legend (Con el clásico Miura SV)", "The V12 Path (Enfocado en el icónico motor de la marca)", "The Bull Stampede (Carrera masiva de superdeportivos)", "The Raging SUV (Evento off-road con el Lamborghini Urus)", "Hybrid Future (Conduciendo el Sián y el Countach LPI 800-4)", "The Revuelto Reveal (Carrera final con el buque insignia híbrido)"]
    },
    { 
        id: "vintage-garage", 
        name: "Vintage Garage", 
        desc: "Conducción clásica de época sin GPS ni ayudas electrónicas en pantalla.", 
        events: ["Kiss Me Kombi", "Back to the 50s", "The Muscle Era", "Supercar Inception", "The 80s Vibe", "The Final Countdown"] 
    },
    { 
        id: "hawaii-scenic-tour", 
        name: "Hawaii Scenic Tour", 
        desc: "Un viaje guiado para explorar los parajes más icónicos de las islas.", 
        events: ["Ho'Laule'A Hawai'i", "Wonders of Ko'Olau Poko", "Bounty of 'Ewa", "The Volcano Ascent", "Pacific Coast Drive", "Aloha Motorfest Finale"]
    },
    { 
        id: "rule-the-streets", 
        name: "Rule the Streets", 
        desc: "Diseñada junto al popular canal automotriz de contenido Donut Media.", 
        events: ["Question 1: Pop-Up Headlights?", "Question 2: V8 vs V12?", "Question 3: FWD or RWD?", "Question 4: Inline 6 vs V6?", "Question 5: JDM vs US Muscle?", "Question 6: Turbo vs Supercharger?", "Question 7: Who Rules the Streets?"]
    },
    { 
        id: "drift-experience", 
        name: "Drift Experience", 
        desc: "Competiciones basadas exclusivamente en conseguir la puntuación máxima de derrape.", 
        events: ["Drift Introduction", "Slick Roads", "Asphalt Slideway", "The Sliding Circle", "Neon Slipstream", "The Drift King Trial"] 
    },
    { 
        id: "motorsports", 
        name: "Motorsports", 
        desc: "Carreras profesionales en circuitos con paradas en boxes y gestión de neumáticos.", 
        events: ["Motorsports Prologue", "The Pit Stop Challenge", "Grand Prix Championship", "Endurance Trial", "The Grid Showdown", "Podium Finish"] 
    },
    { 
        id: "american-muscle", 
        name: "American Muscle: A Mustang Tribute", 
        desc: "Carreras de aceleración y potencia bruta americana enfocadas en el Ford Mustang.", 
        events: ["The Mustang Dawn", "Pony Express", "The Mustang Heritage", "Rethinking the Legend", "Modern Pony", "The Ultimate Tribute"] 
    },
    { 
        id: "liberty-walk", 
        name: "Liberty Walk: A Signature Edition", 
        desc: "Centrada en la cultura del tuning extremo y carrocerías anchas de Liberty Walk.", 
        events: ["Welcome to Liberty Walk", "The LBWK Philosophy", "Widebody Kingdom", "The Kato Legacy", "Stance and Style", "Elite Gathering"] 
    },
    { 
        id: "off-road-addict", 
        name: "Off-Roading Addict", 
        desc: "Desafíos en rutas de tierra, barro y escenarios naturales.", 
        events: ["Mud-Slinging Prologue", "The Ridge Run", "Wild Wilderness", "Tropical Storm Trail", "Jungle Rush", "The Mud King Finish"] 
    },
    { 
        id: "electric-odyssey", 
        name: "Electric Odyssey", 
        desc: "Carreras tecnológicas a bordo de superdeportivos totalmente eléctricos.", 
        events: ["The Spark", "Silent Power", "Lightning Strike", "Voltage Peak", "Eco-Exotic Challenge", "The Electric Horizon"] 
    },
    { 
        id: "ocean-sky", 
        name: "Ocean 'N Sky", 
        desc: "Carreras que alternan dinámicamente entre lanchas rápidas y aviones.", 
        events: ["The Aqua-Aero Intro", "Wave Breaker", "Cloud Chaser", "Island Hop", "The Coastal Sprint", "Skyline Finish"] 
    },
    { 
        id: "dream-cars", 
        name: "Dream Cars", 
        desc: "Selección de vehículos exóticos presentados de la mano de Supercar Blondie.", 
        events: ["The Blondie Welcome", "Concept Realized", "Exotic Geometry", "The Ultra-Rare Gathering", "Future Masterpiece", "The Multimillion Finale"] 
    },
    { 
        id: "gymkhana-grid", 
        name: "Gymkhana Grid Masters", 
        desc: "Desafíos de habilidad y acrobacias extremas junto a Hoonigan.", 
        events: ["Hoonigan Welcome Stage", "The Smoke Show", "Industrial Playground", "The Ken Block Tribute", "Tire Slayer Arena", "Grid Master Showdown", "The Ultimate Hoonigan"] 
    },
    { 
        id: "bike-lovers", 
        name: "Bike Lovers", 
        desc: "Desafíos diseñados en su totalidad para los entusiastas de las motocicletas.", 
        events: ["Two-Wheel Takeover", "Superbike Symphony", "Dirt Bike Chaos", "Cruising Oahu", "The Apex Predator", "The Bikers' Reunion"] 
    },
    { 
        id: "ferrari-passion", 
        name: "Ferrari Passion", 
        desc: "Una lista de carreras exclusiva centrada en el legado de la marca de Maranello.", 
        events: ["The Enzo Ferrari Legacy", "Maranello Masterpieces", "Rosso Corsa Sprint", "V12 Symphony", "Scuderia Track Day", "The F80 Ultimate Reveal"] 
    },
    { 
        id: "bmw-legacy", 
        name: "BMW Legacy", 
        desc: "Un recorrido especial que celebra los modelos deportivos históricos de BMW.", 
        events: ["Bavarian Roots", "The M Power Revolution", "Touring Car Heritage", "Two-Wheel Adventure", "Modern Performance", "The Prototype Horizon"] 
    },
    { 
        id: "hollywood-action", 
        name: "Hollywood Action!", 
        desc: "Carreras de acción cinemática recreando escenas de películas de Hollywood.", 
        events: ["The Blockbuster Opening", "Sci-Fi Neon Chase", "The Spy Who Drove Me", "Disaster Escape", "The Big Heist", "The Final Cut"] 
    },
    { 
        id: "red-bull-wild-ride", 
        name: "Red Bull Wild Ride", 
        desc: "Eventos multidisciplinarios patrocinados por Red Bull que exigen control absoluto.", 
        events: ["The Wild Welcome", "Canion Flight", "Speed Clash Arena", "Stormy Waters", "The Taurus Ridge", "Red Bull Ultimate Finish"] 
    },
    { 
        id: "street-riders", 
        name: "Street Riders", 
        desc: "Eventos enfocados en la escena del automovilismo callejero clandestino.", 
        events: ["The Underground Meet", "Gridlock Sprint", "Neon Boulevard", "Alleyway Drift", "The Midnight Run", "King of the Streets Finale"] 
    },
    { 
        id: "american-main-stage", 
        name: "American Main Stage", 
        desc: "Celebración masiva de la historia de la velocidad estadounidense.", 
        events: ["The Detroit Iron", "Indy Oval Experience", "Dragstrip Showdown", "The Pike's Peak Spirit", "The Stars & Stripes Grand Prix"] 
    },
    { 
        id: "red-bull-speed-clash", 
        name: "Red Bull Speed Clash", 
        desc: "Eventos multidisciplinarios compitiendo contra o junto a vehículos de diferentes categorías.", 
        events: ["The Playground Inception", "Air vs Ground Battle", "The F1 Simulation", "Two-Wheel Supremacy", "The Red Bull Grand Prix"] 
    },
    { 
        id: "nascar-tour", 
        name: "NASCAR Motorfest Tour", 
        desc: "Carreras de alta velocidad con físicas de rebufo y estrategias de boxes en los óvalos.", 
        events: ["The Green Flag Opening", "Drafting Strategy", "Under the Floodlights", "The Tri-Oval Sprint", "The Checkered Flag Finish"] 
    },
    { 
        id: "made-in-japan-2", 
        name: "Made in Japan Vol. 2", 
        desc: "Continuación de la cultura nipona con carreras nocturnas y tramos de montaña exigentes.", 
        events: ["Wangan Spirit", "Touge Spirit", "Ebisu Spirit", "Zeroyon Style", "Kanjo Style", "Shinjuku Style Finale"] 
    },
    { 
        id: "late-show", 
        name: "The Motorfest Late Show", 
        desc: "Playlist estilo show televisivo con episodios periódicos y dinámicas mixtas.", 
        events: ["Performance Dreams", "Dolce Velocita", "Eternal Legends", "The Late Show Final Curtain"] 
    }
];

let currentPlaylistName = "";
let currentEventName = "";
let currentCategoryFilter = "Todas";
let extractedRecordsCache = [];

function renderPlatformBadge(platformName) {
    if (!platformName) return `<span style="color: #6b7280; font-size: 0.8rem;">N/A</span>`;
    const p = platformName.trim().toLowerCase();
    let platformText = platformName.toUpperCase();
    let textColor = "#ffffff";

    if (p.includes("pc")) { platformText = "PC"; } 
    else if (p.includes("xbox")) { platformText = "XBOX"; textColor = "#107c10"; } 
    else if (p.includes("playstation") || p.includes("ps")) { platformText = "PLAYSTATION"; textColor = "#0070d1"; }

    return `
        <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.07); padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <span style="font-family: 'Orbitron', sans-serif; font-weight: bold; color: #ffe600; font-size: 13px; margin-right: 3px;">M</span>
            <span style="color: ${textColor}; font-weight: bold; font-size: 11px; font-family: 'Orbitron', sans-serif;">${platformText}</span>
        </span>
    `;
}

function renderPlaylists() {
    const container = document.getElementById('playlists-container');
    if (!container) return;
    container.innerHTML = "";

    // Aplicar estilos de cuadrícula/bloques si no los tiene definidos por CSS externo
    container.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; padding: 20px 0;";

    playlistsData.forEach(pl => {
        const card = document.createElement('div');
        card.className = 'motorfest-card playlist-card'; // Añadimos la clase de tarjeta que definiste
        card.style.cssText = `
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        `;
        
        card.onmouseover = () => {
            card.style.borderColor = '#ffe600';
            card.style.transform = 'translateY(-3px)';
        };
        card.onmouseout = () => {
            card.style.borderColor = '#27272a';
            card.style.transform = 'translateY(0)';
        };

        card.onclick = () => showEvents(pl);
        card.innerHTML = `
            <div>
                <h3 style="color: #fff; font-family: 'Orbitron', sans-serif; font-size: 16px; margin-bottom: 8px;">${pl.name}</h3>
                <p style="color: #9ca3af; font-size: 13px; line-height: 1.4; margin: 0;">${pl.desc}</p>
            </div>
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 15px;">
                <span style="color: #ffe600; font-size: 13px; font-family: 'Orbitron', sans-serif; font-weight: bold;">Ver Eventos →</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function showEvents(playlist) {
    currentPlaylistName = playlist.name;
    document.getElementById('events-playlist-title').innerText = playlist.name;
    
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = "";
    
    // Aplicamos un diseño de cuadrícula o columna de tarjetas para los eventos
    eventsContainer.style.cssText = "display: flex; flex-direction: column; gap: 14px; padding: 10px 0;";

    playlist.events.forEach((eventName, index) => {
        const item = document.createElement('div');
        item.className = 'event-card-item';
        item.style.cssText = `
            background: #18181b;
            border: 1px solid #27272a;
            border-left: 4px solid #ffe600;
            border-radius: 8px;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        item.onmouseover = () => {
            item.style.background = '#222225';
            item.style.borderColor = '#ffe600';
            item.style.transform = 'translateX(4px)';
        };
        item.onmouseout = () => {
            item.style.background = '#18181b';
            item.style.borderColor = '#27272a';
            item.style.borderLeftColor = '#ffe600';
            item.style.transform = 'translateX(0)';
        };

        item.onclick = () => showRankedTable(playlist.name, eventName);
        
        item.innerHTML = `
            <div>
                <span style="font-size: 10px; font-family: 'Orbitron', sans-serif; color: #9ca3af; display: block; margin-bottom: 4px;">EVENTO 0${index + 1}</span>
                <span style="font-family: 'Orbitron', sans-serif; font-weight: bold; color: #fff; font-size: 15px;">${eventName}</span>
            </div>
            <div style="background: rgba(255,230,0,0.1); border: 1px solid rgba(255,230,0,0.3); padding: 8px 14px; border-radius: 6px; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 12px; color: #ffe600; font-family: 'Orbitron', sans-serif; font-weight: bold;">Ver Top Ranked</span>
                <span style="color: #ffe600; font-size: 14px;">🏁</span>
            </div>
        `;
        eventsContainer.appendChild(item);
    });

    document.getElementById('view-playlists').classList.add('hidden-view');
    document.getElementById('view-events').classList.remove('hidden-view');
    document.getElementById('view-ranked').classList.add('hidden-view');
}

async function showRankedTable(playlistName, eventName) {
    currentPlaylistName = playlistName;
    currentEventName = eventName;
    currentCategoryFilter = "Todas";

    document.getElementById('ranked-event-title').innerText = eventName;
    document.getElementById('ranked-playlist-subtitle').innerText = `Playlist: ${playlistName}`;

    document.getElementById('view-events').classList.add('hidden-view');
    document.getElementById('view-ranked').classList.remove('hidden-view');

    renderCategoryTabs();
    await loadRankedData(playlistName, eventName);
}

function renderCategoryTabs() {
    let tabsContainer = document.getElementById('ranked-category-tabs');
    if (!tabsContainer) {
        const rankedView = document.getElementById('view-ranked');
        const titleSection = document.getElementById('ranked-playlist-subtitle');
        tabsContainer = document.createElement('div');
        tabsContainer.id = 'ranked-category-tabs';
        tabsContainer.style.cssText = "display: flex; gap: 8px; overflow-x: auto; padding: 10px 0; margin-bottom: 15px; white-space: nowrap;";
        if (titleSection && titleSection.parentNode) {
            titleSection.parentNode.insertBefore(tabsContainer, titleSection.nextSibling);
        } else {
            rankedView.prepend(tabsContainer);
        }
    }

    tabsContainer.innerHTML = "";
    vehicleCategories.forEach(cat => {
        const isActive = currentCategoryFilter === cat;
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.style.cssText = `
            background: ${isActive ? '#ffe600' : '#18181b'};
            color: ${isActive ? '#000' : '#d1d5db'};
            border: 1px solid ${isActive ? '#ffe600' : '#27272a'};
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: ${isActive ? 'bold' : 'normal'};
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
            transition: all 0.2s ease;
        `;
        btn.onclick = () => {
            currentCategoryFilter = cat;
            renderCategoryTabs();
            loadRankedData(currentPlaylistName, currentEventName);
        };
        tabsContainer.appendChild(btn);
    });
}

function showPlaylistsView() {
    document.getElementById('view-playlists').classList.remove('hidden-view');
    document.getElementById('view-events').classList.add('hidden-view');
    document.getElementById('view-ranked').classList.add('hidden-view');
}

function showEventsView() {
    document.getElementById('view-events').classList.remove('hidden-view');
    document.getElementById('view-ranked').classList.add('hidden-view');
}

document.addEventListener("DOMContentLoaded", () => {
    renderPlaylists();

    const btnBackPlaylists = document.getElementById('btn-back-playlists');
    const btnBackEvents = document.getElementById('btn-back-events');
    const btnOpenUpload = document.getElementById('btn-open-upload'); 
    const btnSubmitUpload = document.getElementById('btn-submit-upload'); 
    const btnCloseModal = document.getElementById('btn-close-modal'); 
    const fileInput = document.getElementById('screenshot-file');

    // Ampliar dinámicamente el atributo accept del input file para permitir imágenes JXR / JPE / JPG / PNG
    if (fileInput) {
        fileInput.setAttribute('accept', 'image/*,.jxr,.hdp,.wdp');
    }

    if (btnBackPlaylists) btnBackPlaylists.onclick = showPlaylistsView;
    if (btnBackEvents) btnBackEvents.onclick = showEventsView;

    if (btnOpenUpload) btnOpenUpload.onclick = openUploadModal;
    if (btnCloseModal) btnCloseModal.onclick = closeUploadModal;
    if (btnSubmitUpload) btnSubmitUpload.onclick = processAndUploadRanked;
});

function openUploadModal() {
    const modal = document.getElementById('upload-modal');
    if (modal) modal.style.display = 'flex';
    
    // Limpiar completamente la caché y los inputs anteriores para evitar retener datos viejos
    extractedRecordsCache = [];
    const fileInput = document.getElementById('screenshot-file');
    if (fileInput) fileInput.value = "";
    
    const statusDiv = document.getElementById('upload-status');
    if (statusDiv) statusDiv.innerText = "";

    const container = document.getElementById('ocr-preview-container');
    if (container) container.innerHTML = "";
}

function closeUploadModal() {
    const modal = document.getElementById('upload-modal');
    if (modal) modal.style.display = 'none';
    const fileInput = document.getElementById('screenshot-file');
    if (fileInput) fileInput.value = "";
    const statusDiv = document.getElementById('upload-status');
    if (statusDiv) statusDiv.innerText = "";
    const container = document.getElementById('ocr-preview-container');
    if (container) container.innerHTML = "";
    extractedRecordsCache = [];
}

// Función auxiliar para convertir archivos JXR (Windows Media Photo) u otros formatos complejos a un lienzo soportado por Tesseract
async function convertFileToProcessableImage(file) {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.jxr') || fileName.endsWith('.wdp') || fileName.endsWith('.hdp')) {
        console.warn("Archivo JXR detectado. Preparando conversión de flujo para OCR...");
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        
        // Forzar la lectura como URL de datos fresca para evitar problemas de caché del navegador
        reader.onload = (e) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width || 1920;
                canvas.height = img.height || 1080;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar lienzo previo
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        // Crear un archivo completamente nuevo con marca de tiempo para evitar colisiones en caché
                        const freshFile = new File([blob], `upload_${Date.now()}.png`, { type: "image/png" });
                        resolve(freshFile);
                    } else {
                        resolve(file); // Fallback al archivo original si falla el canvas
                    }
                }, 'image/png');
            };
            img.onerror = () => {
                // Si el navegador no puede decodificar nativamente el JXR por falta de códec del sistema, 
                // devolvemos el archivo original limpio.
                resolve(file);
            };
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });
}

async function processAndUploadRanked() {
    const fileInput = document.getElementById('screenshot-file');
    const statusDiv = document.getElementById('upload-status');

    if (!fileInput || fileInput.files.length === 0) {
        statusDiv.innerText = "Por favor selecciona una imagen o archivo JXR primero.";
        return;
    }

    // Obtener estrictamente el archivo recién seleccionado
    let file = fileInput.files[0];
    statusDiv.innerText = "Procesando formato de imagen (Soporte JXR activo)...";

    // Limpiar la vista previa anterior antes de generar los nuevos resultados
    const container = document.getElementById('ocr-preview-container');
    if (container) container.innerHTML = "";
    extractedRecordsCache = [];

    try {
        // Preprocesar el archivo de forma aislada y fresca
        file = await convertFileToProcessableImage(file);

        const worker = await Tesseract.createWorker('eng');
        statusDiv.innerText = "Analizando textos, tiempos y Top 5+ con Tesseract OCR...";
        
        const ret = await worker.recognize(file);
        await worker.terminate();

        const text = ret.data.text;
        console.log("Texto detectado por OCR:", text);

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        extractedRecordsCache = parseLeaderboardText(lines);

        if (extractedRecordsCache.length === 0) {
            throw new Error("No se detectaron textos válidos.");
        }

        statusDiv.innerText = "¡Top 5+ detectado con éxito! Asigna la categoría y confirma:";
        renderOCRPreviewTable(extractedRecordsCache);

    } catch (error) {
        console.error("Error en OCR o formato JXR:", error);
        statusDiv.innerText = "No se pudo leer automáticamente el archivo JXR. Rellena los datos manualmente abajo:";
        renderManualEntryForm();
    }
}

function parseLeaderboardText(lines) {
    let records = [];
    let posCounter = 1;

    lines.forEach(line => {
        const timeMatch = line.match(/(\d{2}:\d{2}[.,]\d{3})|(\d{1,2}[.,]\d{3})|(\d{2}:\d{2})/);
        if (timeMatch) {
            const timeStr = timeMatch[0];
            let cleanLine = line.replace(timeStr, "").trim();
            cleanLine = cleanLine.replace(/^[#\d\.\-\s]+/, "").trim();

            if (cleanLine.length < 2) {
                cleanLine = `Piloto ${posCounter}`;
            }
            
            records.push({
                pos: posCounter,
                driver: cleanLine,
                carCategory: currentCategoryFilter !== "Todas" ? currentCategoryFilter : "Street Tier 1", 
                platform: "PC",
                time: timeStr.replace(',', '.')
            });
            posCounter++;
        }
    });

    if (records.length < 5) {
        for (let i = records.length + 1; i <= 5; i++) {
            let fallbackName = lines[i - 1] && !lines[i - 1].match(/\d{2}:/) ? lines[i - 1] : `Piloto ${i}`;
            records.push({
                pos: i,
                driver: fallbackName.replace(/^[#\d\.\-\s]+/, "").trim() || `Piloto ${i}`,
                carCategory: currentCategoryFilter !== "Todas" ? currentCategoryFilter : "Street Tier 1",
                platform: "PC",
                time: "01:00.000"
            });
        }
    }

    return records.slice(0, 10);
}

function renderOCRPreviewTable(records) {
    let container = document.getElementById('ocr-preview-container');
    if (!container) return;

    let html = `<div style="max-height: 260px; overflow-y: auto; margin-top: 15px; text-align: left; border: 1px solid #333; padding: 10px; background: #09090b;">
        <p style="font-size: 11px; color: #ffe600; margin-bottom: 8px;">Revisa datos, tiempos y categoría de vehículo (Top 5+):</p>`;
    
    records.forEach((rec, idx) => {
        let catOptions = vehicleCategories.filter(c => c !== "Todas").map(c => `
            <option value="${c}" ${rec.carCategory === c ? 'selected' : ''}>${c}</option>
        `).join('');

        html += `<div style="display: flex; gap: 4px; margin-bottom: 6px; align-items: center; flex-wrap: wrap;">
            <input type="text" value="${rec.pos}" id="pos-${idx}" style="width: 30px; background: #222; color: #fff; border: 1px solid #444; text-align:center; font-size: 11px;">
            <input type="text" value="${rec.driver}" id="driver-${idx}" style="flex: 2; background: #222; color: #fff; border: 1px solid #444; padding: 3px; font-size: 11px;">
            <select id="cat-${idx}" style="flex: 1.5; background: #222; color: #ffe600; border: 1px solid #444; padding: 3px; font-size: 10px;">
                ${catOptions}
            </select>
            <input type="text" value="${rec.time}" id="time-${idx}" style="flex: 1.2; background: #222; color: #ffe600; border: 1px solid #444; padding: 3px; font-size: 11px;">
        </div>`;
    });

    html += `<button id="btn-save-confirmed" style="margin-top: 10px; width: 100%; background: #10b981; color: #fff; border: none; padding: 8px; font-weight: bold; cursor: pointer; border-radius: 4px; font-family: 'Orbitron'; font-size: 12px;">Confirmar y Actualizar Top en Firestore</button></div>`;
    container.innerHTML = html;

    document.getElementById('btn-save-confirmed').onclick = async () => {
        const statusDiv = document.getElementById('upload-status');
        statusDiv.innerText = "Actualizando récords en Firestore...";

        try {
            const qExisting = query(
                collection(db, "ranked_records"), 
                where("playlist", "==", currentPlaylistName), 
                where("event", "==", currentEventName)
            );
            const existingSnapshot = await getDocs(qExisting);
            const existingDocsMap = new Map();

            existingSnapshot.forEach(docSnap => {
                const data = docSnap.data();
                const pilotName = (data.pilot || data.driver || "").trim().toLowerCase();
                if (pilotName) {
                    existingDocsMap.set(pilotName, { id: docSnap.id, ...data });
                }
            });

            for (let i = 0; i < records.length; i++) {
                const pElem = document.getElementById(`pos-${i}`);
                const dElem = document.getElementById(`driver-${i}`);
                const cElem = document.getElementById(`cat-${i}`);
                const tElem = document.getElementById(`time-${i}`);

                if (!dElem || !tElem) continue;

                const p = parseInt(pElem.value) || (i + 1);
                const d = dElem.value.trim();
                const category = cElem ? cElem.value : "Street Tier 1";
                const t = tElem.value.trim();
                const pilotKey = d.toLowerCase();

                if (existingDocsMap.has(pilotKey)) {
                    const existingDocInfo = existingDocsMap.get(pilotKey);
                    const docRef = doc(db, "ranked_records", existingDocInfo.id);
                    await updateDoc(docRef, {
                        pos: p,
                        pilot: d,
                        carCategory: category,
                        timeScore: t,
                        timestamp: new Date()
                    });
                } else {
                    await addDoc(collection(db, "ranked_records"), {
                        playlist: currentPlaylistName,
                        event: currentEventName,
                        pos: p,
                        pilot: d,
                        carCategory: category,
                        platform: records[i].platform || "PC",
                        timeScore: t,
                        timestamp: new Date()
                    });
                }
            }

            statusDiv.innerText = "¡Top 5+ actualizado correctamente!";
            setTimeout(() => {
                closeUploadModal();
                loadRankedData(currentPlaylistName, currentEventName);
            }, 1500);

        } catch (e) {
            console.error(e);
            statusDiv.innerText = "Error al actualizar en la base de datos.";
        }
    };
}

function renderManualEntryForm() {
    renderOCRPreviewTable([
        { pos: 1, driver: "Croozy703", carCategory: "Street Tier 1", time: "01:00.060" },
        { pos: 2, driver: "Align.", carCategory: "Street Tier 1", time: "02:02.825" },
        { pos: 3, driver: "CORLEONE-.", carCategory: "Street Tier 1", time: "02:03.309" },
        { pos: 4, driver: "Piloto 4", carCategory: "Street Tier 1", time: "02:05.100" },
        { pos: 5, driver: "Piloto 5", carCategory: "Street Tier 1", time: "02:06.400" }
    ]);
}

async function loadRankedData(playlistName, eventName) {
    const tbody = document.getElementById('ranked-global-tbody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #ffe600;">Cargando récords...</td></tr>`;

    try {
        const q = query(
            collection(db, "ranked_records"), 
            where("playlist", "==", playlistName), 
            where("event", "==", eventName)
        );
        const realSnapshot = await getDocs(q);
        
        let eventRecords = [];
        realSnapshot.forEach((docSnap) => {
            eventRecords.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (currentCategoryFilter !== "Todas") {
            eventRecords = eventRecords.filter(rec => {
                const recCat = (rec.carCategory || rec.car || "").trim();
                return recCat.toLowerCase() === currentCategoryFilter.toLowerCase();
            });
        }

        if (eventRecords.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">
                        No hay registros cargados para la categoría <b style="color: #ffe600;">${currentCategoryFilter}</b> en este evento. <br>¡Sube una captura (incluso en formato JXR) para agregar los primeros!
                    </td>
                </tr>
            `;
            return;
        }

        eventRecords.sort((a, b) => (a.pos || 0) - (b.pos || 0));

        tbody.innerHTML = "";
        eventRecords.forEach((rec, index) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #27272a";
            const posColor = index === 0 ? "#ffe600" : (index === 1 ? "#e5e7eb" : (index === 2 ? "#d97706" : "#9ca3af"));

            const driverName = rec.pilot || rec.driver || "Piloto Anónimo";
            const categoryName = rec.carCategory || rec.car || "Street Tier 1";

            tr.innerHTML = `
                <td style="padding: 12px; text-align: center; font-family: 'Orbitron'; font-weight: bold; color: ${posColor};">#${rec.pos || index + 1}</td>
                <td style="padding: 12px; font-weight: 600; color: #fff;">${driverName}</td>
                <td style="padding: 12px; color: #d1d5db;"><span style="background: rgba(255,230,0,0.1); color: #ffe600; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${categoryName}</span></td>
                <td style="padding: 12px; text-align: center;">${renderPlatformBadge(rec.platform)}</td>
                <td style="padding: 12px; text-align: right; color: #ffe600; font-weight: bold; font-family: 'Orbitron';">${rec.timeScore || rec.time || "N/A"}</td>
                <td style="padding: 12px; text-align: center;">
                    <button class="btn-edit-rec" data-id="${rec.id}" data-pilot="${driverName}" data-cat="${categoryName}" data-time="${rec.timeScore || rec.time || ""}" style="background: #3b82f6; color: #fff; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px; margin-right: 4px;">✏️ Editar</button>
                    <button class="btn-delete-rec" data-id="${rec.id}" style="background: #ef4444; color: #fff; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">🗑️ Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Configurar eventos para los botones de eliminar
        document.querySelectorAll('.btn-delete-rec').forEach(btn => {
            btn.onclick = async (e) => {
                const docId = e.target.getAttribute('data-id');
                if (confirm("¿Estás seguro de eliminar este registro del ranking?")) {
                    try {
                        await deleteDoc(doc(db, "ranked_records", docId));
                        loadRankedData(playlistName, eventName);
                    } catch (err) {
                        console.error("Error al eliminar:", err);
                        alert("No se pudo eliminar el registro.");
                    }
                }
            };
        });

        // Configurar eventos para los botones de editar
        document.querySelectorAll('.btn-edit-rec').forEach(btn => {
            btn.onclick = (e) => {
                const dataset = e.target.dataset;
                // Puedes abrir el modal de subida o un formulario rápido para reasignar valores usando dataset.id, dataset.pilot, dataset.cat, dataset.time
                const newTime = prompt("Editar tiempo para " + dataset.pilot + ":", dataset.time);
                if (newTime !== null) {
                    const docRef = doc(db, "ranked_records", dataset.id);
                    updateDoc(docRef, { timeScore: newTime, timestamp: new Date() })
                        .then(() => loadRankedData(playlistName, eventName))
                        .catch(err => console.error("Error al actualizar:", err));
                }
            };
        });

    } catch (error) {
        console.error("Error cargando los datos de ranked:", error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #ef4444;">Error al cargar los récords.</td></tr>`;
    }
}