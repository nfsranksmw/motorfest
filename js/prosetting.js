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

const categoriasOficiales = [
    "Street Tier 1", "Street Tier 2", "Drift", 
    "Cup Car", "Racing", "Dragster", 
    "Hypercar", "Alpha GP", "Motocross", 
    "Rally Raid", "Demolition", "Rally", 
    "Monster", "Powerboat", "Plane", "Jet", "Helicopter"
];

const categoriesGrid = document.getElementById('categories-grid');
const categoriesView = document.getElementById('categories-view');
const categoryDetailsView = document.getElementById('category-details-view');
const selectedCategoryTitle = document.getElementById('selected-category-title');
const setupsContainer = document.getElementById('setups-container');
const btnBackCategories = document.getElementById('btn-back-categories');

let allSetups = [];

async function cargarProSettings() {
    try {
        categoriesGrid.innerHTML = `<p style="color: #9ca3af; grid-column: 1 / -1; text-align: center;">Cargando categorías de tuneo...</p>`;
        
        const querySnapshot = await getDocs(collection(db, "prosettings"));
        
        allSetups = [];
        querySnapshot.forEach((doc) => {
            allSetups.push({ id: doc.id, ...doc.data() });
        });

        renderizarCategorias();

    } catch (error) {
        console.error("Error al cargar pro settings:", error);
        renderizarCategorias();
    }
}

function renderizarCategorias() {
    categoriesGrid.innerHTML = "";

    const iconosCategorias = {
        "street tier 1": "🚗",
        "street tier 2": "🏎️",
        "drift": "💨",
        "cup car": "🏁",
        "racing": "🏆",
        "dragster": "🔥",
        "hypercar": "⚡",
        "alpha gp": "🏎️",
        "motocross": "🏍️",
        "rally raid": "🚙",
        "demolition": "💥",
        "rally": "🌲",
        "monster": "🛞",
        "powerboat": "🚤",
        "plane": "✈️",
        "jet": "🚀",
        "helicopter": "🚁"
    };

    categoriasOficiales.forEach(catName => {
        const keyLower = catName.trim().toLowerCase();
        const icono = iconosCategorias[keyLower] || "🏎️";

        const count = allSetups.filter(s => {
            const catSetup = (s.category || s.categoria || "").trim().toLowerCase();
            return catSetup === keyLower;
        }).length;

        const card = document.createElement('div');
        card.className = "category-card";
        card.innerHTML = `
            <div class="category-content-left" style="display: flex; align-items: center; gap: 15px;">
                <div class="category-icon" style="width: 36px; height: 36px; background: #222222; border: 1px solid #282828; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px;">${icono}</div>
                <div class="category-info">
                    <h4>${catName}</h4>
                    <span class="category-models">${count} modelo${count !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <span style="color: #6b7280; font-size: 1rem;">➔</span>
        `;

        card.addEventListener('click', () => {
            mostrarSetupsDeCategoria(catName);
        });

        categoriesGrid.appendChild(card);
    });
}

function mostrarSetupsDeCategoria(categoryName) {
    categoriesView.classList.add('hidden');
    categoryDetailsView.classList.remove('hidden');
    selectedCategoryTitle.textContent = `Pro Settings: ${categoryName}`;

    setupsContainer.innerHTML = "";

    const filtrados = allSetups.filter(s => {
        const catSetup = (s.category || s.categoria || "").trim().toLowerCase();
        const catOficial = categoryName.trim().toLowerCase();
        return catSetup === catOficial;
    });

    if (filtrados.length === 0) {
        setupsContainer.innerHTML = `<p style="text-align: center; color: #6b7280; padding: 40px; grid-column: 1/-1;">No hay configuraciones Pro registradas todavía para esta categoría. ¡Sé el primero en publicarla desde tu panel de acceso!</p>`;
        return;
    }

    filtrados.forEach(setup => {
        const card = document.createElement('div');
        card.className = "prosetup-card";
        
        const marcaExtraida = setup.brand || setup.carBrand || setup.marca || setup.vehicleBrand || (setup.carName ? setup.carName.split(' ')[0] : 'Marca Desconocida');

        card.innerHTML = `
            <div class="prosetup-grid-top" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; margin-bottom: 25px;">
                <div>
                    <h3 style="font-family: 'Orbitron', sans-serif; color: #ffe600; font-size: 1.2rem; margin-bottom: 4px;">${marcaExtraida}</h3>
                    <h2 style="font-family: 'Orbitron', sans-serif; color: #fff; font-size: 1.8rem; margin-bottom: 15px;">${setup.carName || 'Vehículo Desconocido'}</h2>
                    <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
                        <span style="background: #222222; border: 1px solid #282828; color: #9ca3af; padding: 3px 10px; border-radius: 6px; font-size: 11px;">📅 ${setup.year || '1990'}</span>
                        <span style="background: #222222; border: 1px solid #282828; color: #9ca3af; padding: 3px 10px; border-radius: 6px; font-size: 11px;">🌍 ${setup.country || 'Germany'}</span>
                        <span style="background: #047857; color: #fff; padding: 3px 10px; border-radius: 6px; font-size: 11px;">Viable</span>
                    </div>
                    <p style="font-size: 13px; color: #9ca3af; margin-bottom: 8px;">👤 Tuner: <strong style="color: #ffe600;">${setup.tuner || 'Akor'}</strong></p>
                    <p style="font-size: 13px; color: #9ca3af; margin-bottom: 8px;">📂 Category: <strong style="color: #fff;">${setup.category || setup.categoria || categoryName}</strong></p>
                    <p style="font-size: 13px; color: #9ca3af; margin-bottom: 8px;">🎮 Input method: <strong style="color: #fff;">${setup.inputMethod || 'gamepad'}</strong></p>
                    <p style="font-size: 13px; color: #9ca3af;">💰 Price: <strong style="color: #fff;">${setup.price || '350.000'} ⃀</strong></p>
                </div>
                <div style="background: #1a1a1a; border: 1px solid #282828; border-radius: 12px; padding: 20px;">
                    <h4 style="font-family: 'Orbitron', sans-serif; color: #ffe600; font-size: 13px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">⏱️ Performance Stats</h4>
                    <div style="font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 10px; color: #9ca3af; border-bottom: 1px dashed #282828; padding-bottom: 6px;"><span>Engine</span> <strong style="color:#fff;">${setup.engine || 'Thermal'}</strong></div>
                    <div style="font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 10px; color: #9ca3af; border-bottom: 1px dashed #282828; padding-bottom: 6px;"><span>Power</span> <strong style="color:#fff;">${setup.power || '655 HP'}</strong></div>
                    <div style="font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 10px; color: #9ca3af; border-bottom: 1px dashed #282828; padding-bottom: 6px;"><span>Weight</span> <strong style="color:#fff;">${setup.weight || '1200 kg'}</strong></div>
                    <div style="font-size: 12px; display: flex; justify-content: space-between; color: #9ca3af; padding-bottom: 2px;"><span>Speed</span> <strong style="color:#fff;">${setup.speed || '290 km/h'}</strong></div>
                </div>
            </div>

            <div class="section-box">
                <h4>⚙️ Transmission</h4>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Final Drive</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.finalDrive || '0%'}</span>
                    <span style="font-size: 11px; color: #9ca3af;">Short</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.finalDrive || '0%'};"></div></div>
                    <span style="font-size: 11px; color: #9ca3af;">Long</span>
                </div>
            </div>

            <div class="section-box">
                <h4>🛞 Tires</h4>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Grip Front</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.gripFront || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.gripFront || '0%'};"></div></div>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Grip Rear</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.gripRear || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.gripRear || '0%'};"></div></div>
                </div>
            </div>

            <div class="section-box">
                <h4>🛑 Brakes</h4>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Brake Balance</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.brakeBalance || '59%'}</span>
                    <span style="font-size: 11px; color: #9ca3af;">Front</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.brakeBalance || '59%'};"></div></div>
                    <span style="font-size: 11px; color: #9ca3af;">Rear</span>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Brake Power</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.brakePower || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.brakePower || '0%'};"></div></div>
                </div>
            </div>

            <div class="section-box">
                <h4>💨 Aero</h4>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Load Front</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.loadFront || '-6%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.loadFront || '-6%'};"></div></div>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Load Rear</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.loadRear || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.loadRear || '0%'};"></div></div>
                </div>
            </div>

            <div class="section-box">
                <h4>📊 Springs (Suspensión)</h4>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Spring Front</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.springFront || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.springFront || '0%'};"></div></div>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Spring Rear</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.springRear || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.springRear || '0%'};"></div></div>
                </div>
            </div>

            <div class="section-box">
                <h4>🔧 Dampers (Amortiguadores)</h4>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Comp Front</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.compFront || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.compFront || '0%'};"></div></div>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Comp Rear</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.comprear || setup.compRear || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.comprear || setup.compRear || '0%'};"></div></div>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Reb Front</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.rebFront || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.rebFront || '0%'};"></div></div>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Reb Rear</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.rebrear || setup.rebRear || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.rebrear || setup.rebRear || '0%'};"></div></div>
                </div>
            </div>

            <div class="section-box">
                <h4>⚖️ Anti-Roll Bars (ARB)</h4>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">ARB Front</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.arbFront || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.arbFront || '0%'};"></div></div>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">ARB Rear</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.arbrear || setup.arbRear || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.arbrear || setup.arbRear || '0%'};"></div></div>
                </div>
            </div>

            <div class="section-box">
                <h4>📐 Alignment (Camber)</h4>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Camber Front</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.camberFront || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.camberFront || '0%'};"></div></div>
                </div>
                <div class="slider-row">
                    <span style="width: 140px; font-weight: bold; color: #fff;">Camber Rear</span>
                    <span style="font-size: 12px; color: #ffe600; font-weight: bold;">${setup.camberrear || setup.camberRear || '0%'}</span>
                    <div class="slider-bar"><div class="slider-dot" style="left: ${setup.camberrear || setup.camberRear || '0%'};"></div></div>
                </div>
            </div>
        `;
        
        // Añadimos la clase base para que aplique los estilos CSS correctos
        card.className = "setup-card";
        setupsContainer.appendChild(card);
    });
}

if (btnBackCategories) {
    btnBackCategories.addEventListener('click', () => {
        categoryDetailsView.classList.add('hidden');
        categoriesView.classList.remove('hidden');
    });
}

cargarProSettings();