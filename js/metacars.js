// Lista estática manual con todos los vehículos y especificaciones extraídas de las guías de temporada
const metaVehiclesData = [
    // --- STREET TIER 1 ---
    { category: "Street Tier 1", brand: "Audi", model: "RS 2 Avant", metaStatus: "meta" },
    { category: "Street Tier 1", brand: "Porsche", model: "911 Carrera RS 2.7", metaStatus: "meta" },
    { category: "Street Tier 1", brand: "Ford", model: "Mustang Mach-E GT (-10% relación final)", metaStatus: "viable" },
    { category: "Street Tier 1", brand: "Audi", model: "RS 3 Sportback", metaStatus: "contenders" },
    { category: "Street Tier 1", brand: "BMW", model: "M3 Sport Evolution / ErlKönig Ed.", metaStatus: "contenders" },
    { category: "Street Tier 1", brand: "Ford", model: "Focus RS", metaStatus: "contenders" },
    { category: "Street Tier 1", brand: "Lancia", model: "Stratos HF Stradale", metaStatus: "contenders" },
    { category: "Street Tier 1", brand: "Land Rover", model: "Defender 110 V8", metaStatus: "contenders" },
    { category: "Street Tier 1", brand: "Mazda", model: "Rx-7 Turbo 10th Anniversary", metaStatus: "contenders" },

    // --- STREET TIER 2 ---
    { category: "Street Tier 2", brand: "Ferrari", model: "F40 / F50", metaStatus: "meta" },
    { category: "Street Tier 2", brand: "Ferrari", model: "GTO", metaStatus: "meta" },
    { category: "Street Tier 2", brand: "Mazda", model: "Rx-7 Red Fury Ed. (Summit)", metaStatus: "meta" },
    { category: "Street Tier 2", brand: "Porsche", model: "911 GT (993)", metaStatus: "meta" },
    { category: "Street Tier 2", brand: "Lamborghini", model: "Huracán LP610-4", metaStatus: "viable" },
    { category: "Street Tier 2", brand: "Nissan", model: "R32 Haru Ed. (-20% R.F.)", metaStatus: "viable" },
    { category: "Street Tier 2", brand: "Porsche", model: "Taycan T. Ed. (-9% R.F.)", metaStatus: "viable" },
    { category: "Street Tier 2", brand: "Toyota", model: "Supra Ryujin Ed.", metaStatus: "viable" },
    { category: "Street Tier 2", brand: "Aston Martin", model: "V8 Vantage S", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Audi", model: "RS5 Coupé / USST Official Ed.", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "BMW", model: "M5 CS / Rival Ed.", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Chevrolet", model: "Corvette ZR1", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Dodge", model: "Challenger SRT Demon Awaken Ed. / Charger SRT Hellcat Redeye Widebody", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Ferrari", model: "512 TR (Testarossa)", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Honda", model: "NSX", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Hoonigan", model: "Audi Scotto's Coupé quattro", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Lotus", model: "Exige S", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Mercedes-AMG", model: "SLS", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Nissan", model: "R32 / R34 Blackphanthaa Ed. (Summit)", metaStatus: "contenders" },
    { category: "Street Tier 2", brand: "Porsche", model: "911 GT3 RS", metaStatus: "contenders" },

    // --- DRIFT ---
    { category: "Drift", brand: "Hoonigan", model: "Ford Hoonicorn Mustang", metaStatus: "meta" },
    { category: "Drift", brand: "Hoonigan", model: "Mitsubishi Lancer Evo IX", metaStatus: "contenders" },
    { category: "Drift", brand: "Hoonigan", model: "Audi S1 e-tron quattro", metaStatus: "contenders" },

    // --- ALPHA GP ---
    { category: "Alpha GP", brand: "Red Bull", model: "RB14 Disruption Ed. (El mejor - Balance)", metaStatus: "meta" },
    { category: "Alpha GP", brand: "Red Bull", model: "RB14 (Balanceado)", metaStatus: "meta" },
    { category: "Alpha GP", brand: "Red Bull", model: "RB20 (Aceleración)", metaStatus: "viable" },
    { category: "Alpha GP", brand: "Proto", model: "Alpha Mark X (Balanceado)", metaStatus: "viable" },
    { category: "Alpha GP", brand: "Ivory-Tower", model: "Alpha IVT-R07 (Curvas)", metaStatus: "viable" },
    { category: "Alpha GP", brand: "Ivory Tower", model: "IVT AGP R-07", metaStatus: "contenders" },
    { category: "Alpha GP", brand: "Proto", model: "Alpha Mark II", metaStatus: "contenders" },
    { category: "Alpha GP", brand: "Red Bull", model: "RB18", metaStatus: "contenders" },

    // --- RACING ---
    { category: "Racing", brand: "Gordon Murray Automotive", model: "T.50s (Mejor)", metaStatus: "meta" },
    { category: "Racing", brand: "Chevrolet", model: "Camaro SS (Balanceado)", metaStatus: "meta" },
    { category: "Racing", brand: "Lamborghini", model: "Gallardo LP 570-4", metaStatus: "viable" },
    { category: "Racing", brand: "Hoonigan", model: "Audi e-tron", metaStatus: "viable" },
    { category: "Racing", brand: "Ferrari", model: "FXX K, F40 LM, 599XX EVO", metaStatus: "contenders" },
    { category: "Racing", brand: "KTM", model: "X-Bow GT2", metaStatus: "contenders" },
    { category: "Racing", brand: "Radical", model: "RXC 600 R", metaStatus: "contenders" },

    // --- DRAGSTER ---
    { category: "Dragster", brand: "Proto", model: "Hup One Burning Wheels (Trampas de velocidad)", metaStatus: "meta" },
    { category: "Dragster", brand: "Dodge", model: "SRT Viper GTS 2013 (Eventos de Drag)", metaStatus: "meta" },

    // --- HYPERCAR ---
    { category: "Hypercar", brand: "Koenigsegg", model: "Agera R (Mejor)", metaStatus: "meta" },
    { category: "Hypercar", brand: "Noble", model: "M600 L.Y. Ed. (Smt) - Balanceado", metaStatus: "meta" },
    { category: "Hypercar", brand: "Noble", model: "M500 (Rectas)", metaStatus: "viable" },
    { category: "Hypercar", brand: "Rimac", model: "Nevera T.A. Ed. (Smt) - Aceleración", metaStatus: "viable" },
    { category: "Hypercar", brand: "Bugatti", model: "Centodieci", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Ferrari", model: "Enzo Ferrari", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Ferrari", model: "488 Pista", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Gordon Murray Automotive", model: "T.50", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Koenigsegg", model: "Jesko", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Lamborghini", model: "Revuelto", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Lamborghini", model: "Aventador LP700-4", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Mercedes-AMG", model: "One", metaStatus: "contenders" },
    { category: "Hypercar", brand: "McLaren", model: "Senna", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Porsche", model: "Carrera GT", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Porsche", model: "911 GT1 Strassenversion (993)", metaStatus: "contenders" },
    { category: "Hypercar", brand: "Porsche", model: "919 Street", metaStatus: "contenders" },
    { category: "Hypercar", brand: "W Motors", model: "Lykan Hypersport", metaStatus: "contenders" },

    // --- RALLY RAID ---
    { category: "Rally Raid", brand: "BMW", model: "Z4 sDrive35is (Mejor)", metaStatus: "meta" },
    { category: "Rally Raid", brand: "Porsche", model: "959 Raid (Balanceado)", metaStatus: "meta" },
    { category: "Rally Raid", brand: "Audi", model: "RS Q e-tron (-10% R.F.)", metaStatus: "viable" },
    { category: "Rally Raid", brand: "Toyota", model: "Tacoma", metaStatus: "viable" },
    { category: "Rally Raid", brand: "Ariel", model: "Nomad", metaStatus: "contenders" },
    { category: "Rally Raid", brand: "Hummer", model: "H1 Alpha Evo 1", metaStatus: "contenders" },
    { category: "Rally Raid", brand: "Jeep", model: "Wrangler Evo 2", metaStatus: "contenders" },
    { category: "Rally Raid", brand: "Nissan", model: "Skyline GT-R (R34)", metaStatus: "contenders" },

    // --- MONSTER ---
    { category: "Monster", brand: "Chevrolet", model: "Silverado 1500", metaStatus: "meta" },
    { category: "Monster", brand: "Hummer", model: "H1 Alpha (Rebufo)", metaStatus: "viable" },

    // --- DEMOLITION ---
    { category: "Demolition", brand: "Dodge", model: "Charger R/T Hemi", metaStatus: "meta" },

    // --- RALLY ---
    { category: "Rally", brand: "Peugeot", model: "205 T16 Evo 2", metaStatus: "meta" },
    { category: "Rally", brand: "Ford", model: "Fiesta RB Ed. (Summit) - Curvas", metaStatus: "viable" },
    { category: "Rally", brand: "Mini", model: "Cooper S Countryman - Baches", metaStatus: "viable" },
    { category: "Rally", brand: "Porsche", model: "911 GT3 RS RD L. Ed. - Asfalto", metaStatus: "viable" },
    { category: "Rally", brand: "Citroën", model: "C3 Racing", metaStatus: "contenders" },
    { category: "Rally", brand: "Ford", model: "Fiesta, Focus RS RX Glow M. Ed.", metaStatus: "contenders" },
    { category: "Rally", brand: "Lancia", model: "Delta S4", metaStatus: "contenders" },
    { category: "Rally", brand: "Nissan", model: "Skyline GT-R (R34)", metaStatus: "contenders" },
    { category: "Rally", brand: "Renault", model: "Maxi 5 Turbo", metaStatus: "contenders" },

    // --- MOTOCROSS ---
    { category: "Motocross", brand: "KTM", model: "450 EXC Red Bull Ed. (Curvas)", metaStatus: "viable" },
    { category: "Motocross", brand: "Yamaha", model: "YZ450F (Mejor)", metaStatus: "meta" },
    { category: "Motocross", brand: "KTM", model: "450 EXC Nighthawk Ed. (Rectas)", metaStatus: "viable" },

    // --- POWERBOAT ---
    { category: "Powerboat", brand: "Vector", model: "V40R (Carreras)", metaStatus: "meta" },
    { category: "Powerboat", brand: "ICE Marine", model: "BladeRunner 35 (Destrozo de boyas)", metaStatus: "meta" },

    // --- PLANE / AVIÓN ---
    { category: "Plane", brand: "North American", model: "P-51 Mustang (Velocidad)", metaStatus: "meta" },
    { category: "Plane", brand: "Zivco", model: "Edge 540 V3 (Agilidad)", metaStatus: "viable" },

    // --- HELICOPTER ---
    { category: "Helicopter", brand: "General", model: "Helicópteros (Los 2 van igual)", metaStatus: "meta" }
];

const categoriasOficiales = [
    "Street Tier 1", "Street Tier 2", "Drift", 
    "Cup Car", "Racing", "Dragster", 
    "Hypercar", "Alpha GP", "Motocross", 
    "Rally Raid", "Demolition", "Rally", 
    "Monster", "Powerboat", "Plane", "Jet", "Helicopter"
];

const metaCategoriesGrid = document.getElementById('meta-categories-grid');
const metaCategoriesContainer = document.getElementById('meta-categories-container');
const categoryVehiclesView = document.getElementById('category-vehicles-view');
const metaSelectedCatTitle = document.getElementById('meta-selected-cat-title');
const btnBackMetaCategories = document.getElementById('btn-back-meta-categories');
const filterCategorySelect = document.getElementById('filter-category');
const metaVehiclesGrid = document.getElementById('meta-vehicles-grid');
const metaSearchInput = document.getElementById('meta-search-input');
const filterMetaStatus = document.getElementById('filter-meta-status');

let allVehicles = metaVehiclesData;

function inicializarMetaCars() {
    poblarSelectCategorias();
    renderizarTarjetasCategorias();
    configurarFiltrosYBusqueda();
    renderizarEstadisticasGlobales();
}

function poblarSelectCategorias() {
    if (!filterCategorySelect) return;
    categoriasOficiales.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.toLowerCase();
        option.textContent = cat;
        filterCategorySelect.appendChild(option);
    });
}

function renderizarEstadisticasGlobales() {
    let statsContainer = document.getElementById('meta-stats-container');
    if (!statsContainer && metaCategoriesContainer) {
        statsContainer = document.createElement('div');
        statsContainer.id = 'meta-stats-container';
        metaCategoriesContainer.appendChild(statsContainer);
    }

    if (!statsContainer) return;

    const totalVehiculos = allVehicles.length;
    const totalMeta = allVehicles.filter(v => v.metaStatus.toLowerCase() === 'meta').length;
    const totalViable = allVehicles.filter(v => v.metaStatus.toLowerCase() === 'viable').length;
    const totalContenders = allVehicles.filter(v => v.metaStatus.toLowerCase() === 'contenders').length;

    statsContainer.style.cssText = `
        margin-top: 30px;
        background: #161616;
        border: 1px solid #282828;
        border-radius: 10px;
        padding: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 15px;
        text-align: center;
    `;

    statsContainer.innerHTML = `
        <div style="background: #161616; border: 1px solid #282828; border-radius: 8px; padding: 12px; transition: all 0.25s ease;">
            <div style="font-family: 'Orbitron', sans-serif; font-size: 1.2rem; color: #fff; font-weight: bold;">${totalVehiculos}</div>
            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-top: 4px; font-family: 'Orbitron', sans-serif;">Total Modelos</div>
        </div>
        <div style="background: rgba(255, 230, 0, 0.04); border: 1px solid rgba(255, 230, 0, 0.3); border-radius: 8px; padding: 12px; transition: all 0.25s ease;">
            <div style="font-family: 'Orbitron', sans-serif; font-size: 1.2rem; color: #ffe600; font-weight: bold;">${totalMeta}</div>
            <div style="font-size: 11px; color: #ffe600; text-transform: uppercase; margin-top: 4px; font-family: 'Orbitron', sans-serif;">Meta</div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; transition: all 0.25s ease;">
            <div style="font-family: 'Orbitron', sans-serif; font-size: 1.2rem; color: #10b981; font-weight: bold;">${totalViable}</div>
            <div style="font-size: 11px; color: #10b981; text-transform: uppercase; margin-top: 4px; font-family: 'Orbitron', sans-serif;">Viable</div>
        </div>
        <div style="background: rgba(59, 130, 246, 0.04); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 12px; transition: all 0.25s ease;">
            <div style="font-family: 'Orbitron', sans-serif; font-size: 1.2rem; color: #3b82f6; font-weight: bold;">${totalContenders}</div>
            <div style="font-size: 11px; color: #3b82f6; text-transform: uppercase; margin-top: 4px; font-family: 'Orbitron', sans-serif;">Contenders</div>
        </div>
    `;
}

function renderizarTarjetasCategorias() {
    if (!metaCategoriesGrid) return;
    metaCategoriesGrid.innerHTML = "";

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

        const count = allVehicles.filter(v => v.category.trim().toLowerCase() === keyLower).length;

        const card = document.createElement('div');
        card.className = "meta-category-card";
        
        card.style.cssText = `
            background: #161616;
            border: 1px solid #282828;
            border-radius: 10px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: all 0.25s ease;
        `;

        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 36px; height: 36px; background: #222222; border: 1px solid #282828; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px;">${icono}</div>
                <div>
                    <h4 style="font-family: 'Orbitron', sans-serif; font-size: 1rem; color: #fff; margin-bottom: 4px;">${catName}</h4>
                    <span style="font-size: 12px; color: #9ca3af;">${count} modelo${count !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <span style="color: #6b7280; font-size: 1rem;">➔</span>
        `;

        // Efecto hover con brillo interior y exterior para las tarjetas de categoría
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = '#ffe600';
            card.style.background = '#222014'; // Fondo con tinte amarillo sutil
            card.style.transform = 'translateY(-3px)';
            card.style.boxShadow = '0 6px 20px rgba(255, 230, 0, 0.2), inset 0 0 12px rgba(255, 230, 0, 0.1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = '#282828';
            card.style.background = '#161616';
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });

        card.addEventListener('click', () => {
            abrirCategoriaVehiculos(catName, count);
        });

        metaCategoriesGrid.appendChild(card);
    });
}

function abrirCategoriaVehiculos(categoryName, count) {
    if (!metaCategoriesContainer || !categoryVehiclesView) return;
    metaCategoriesContainer.style.display = 'none';
    categoryVehiclesView.style.display = 'block';
    metaSelectedCatTitle.textContent = `${categoryName} (${count} modelo${count !== 1 ? 's' : ''})`;
    
    renderizarVehiculosDeCategoria(categoryName);
}

function renderizarVehiculosDeCategoria(categoryName, filtroBusqueda = "", filtroStatus = "all") {
    if (!metaVehiclesGrid) return;
    metaVehiclesGrid.innerHTML = "";

    const keyLower = categoryName.trim().toLowerCase();
    
    const vehiculosFiltrados = allVehicles.filter(v => {
        const coincideCat = v.category.trim().toLowerCase() === keyLower;
        const textoCompleto = `${v.brand} ${v.model}`.toLowerCase();
        const coincideTexto = textoCompleto.includes(filtroBusqueda);
        const coincideStatus = filtroStatus === "all" || v.metaStatus.toLowerCase() === filtroStatus;
        
        return coincideCat && coincideTexto && coincideStatus;
    });

    if (vehiculosFiltrados.length === 0) {
        metaVehiclesGrid.innerHTML = `<p style="color: #9ca3af; grid-column: 1 / -1; text-align: center; padding: 30px;">No se encontraron vehículos registrados en esta categoría.</p>`;
        return;
    }

    vehiculosFiltrados.forEach(vehiculo => {
        const status = (vehiculo.metaStatus || "not-meta").toLowerCase();
        let badgeHtml = "";
        let cardBorderColor = "#222222";
        let hoverBgColor = "#1a1a1a";
        let hoverGlowColor = "rgba(255, 255, 255, 0.15)";
        let hoverInnerGlow = "rgba(255, 255, 255, 0.05)";

        if (status === "meta") {
            badgeHtml = `<span style="background: rgba(255, 230, 0, 0.15); color: #ffe600; border: 1px solid #ffe600; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: 'Orbitron', sans-serif;">META</span>`;
            cardBorderColor = "#ffe600";
            hoverBgColor = "#222014"; // Tinte amarillo de fondo
            hoverGlowColor = "rgba(255, 230, 0, 0.35)";
            hoverInnerGlow = "rgba(255, 230, 0, 0.15)";
        } else if (status === "viable") {
            badgeHtml = `<span style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: 'Orbitron', sans-serif;">VIABLE</span>`;
            cardBorderColor = "#10b981";
            hoverBgColor = "#13221b"; // Tinte verde de fondo
            hoverGlowColor = "rgba(16, 185, 129, 0.35)";
            hoverInnerGlow = "rgba(16, 185, 129, 0.15)";
        } else if (status === "contenders") {
            badgeHtml = `<span style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid #3b82f6; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: 'Orbitron', sans-serif;">CONTENDER</span>`;
            cardBorderColor = "#3b82f6";
            hoverBgColor = "#131b26"; // Tinte azul de fondo
            hoverGlowColor = "rgba(59, 130, 246, 0.35)";
            hoverInnerGlow = "rgba(59, 130, 246, 0.15)";
        } else {
            badgeHtml = `<span style="background: rgba(107, 114, 128, 0.15); color: #9ca3af; border: 1px solid #4b5563; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: 'Orbitron', sans-serif;">NOT META</span>`;
            hoverBgColor = "#1f1f1f";
            hoverGlowColor = "rgba(156, 163, 175, 0.25)";
            hoverInnerGlow = "rgba(156, 163, 175, 0.08)";
        }

        const carCard = document.createElement('div');
        carCard.style.cssText = `
            background: #161616;
            border: 1px solid ${cardBorderColor};
            border-radius: 10px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: all 0.25s ease;
        `;

        // Efecto hover dinámico combinando brillo exterior e interior con el color correspondiente
        carCard.addEventListener('mouseenter', () => {
            carCard.style.background = hoverBgColor;
            carCard.style.transform = 'translateY(-4px)';
            carCard.style.boxShadow = `0 6px 20px ${hoverGlowColor}, inset 0 0 14px ${hoverInnerGlow}`;
        });

        carCard.addEventListener('mouseleave', () => {
            carCard.style.background = '#161616';
            carCard.style.transform = 'translateY(0)';
            carCard.style.boxShadow = 'none';
        });

        carCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-family: 'Orbitron', sans-serif;">${vehiculo.category}</span>
                ${badgeHtml}
            </div>
            <div>
                <h4 style="font-family: 'Orbitron', sans-serif; font-size: 1rem; color: #fff; margin: 0;">${vehiculo.brand} ${vehiculo.model}</h4>
            </div>
        `;

        metaVehiclesGrid.appendChild(carCard);
    });
}

function configurarFiltrosYBusqueda() {
    if (metaSearchInput) {
        metaSearchInput.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            const statusSeleccionado = filterMetaStatus ? filterMetaStatus.value : "all";
            
            if (categoryVehiclesView.style.display === 'block') {
                const catActiva = metaSelectedCatTitle.textContent.split('(')[0].trim();
                renderizarVehiculosDeCategoria(catActiva, texto, statusSeleccionado);
            }
        });
    }

    if (filterMetaStatus) {
        filterMetaStatus.addEventListener('change', (e) => {
            const statusSeleccionado = e.target.value;
            const texto = metaSearchInput ? metaSearchInput.value.toLowerCase().trim() : "";
            
            if (categoryVehiclesView.style.display === 'block') {
                const catActiva = metaSelectedCatTitle.textContent.split('(')[0].trim();
                renderizarVehiculosDeCategoria(catActiva, texto, statusSeleccionado);
            }
        });
    }
}

if (btnBackMetaCategories) {
    btnBackMetaCategories.addEventListener('click', () => {
        categoryVehiclesView.style.display = 'none';
        metaCategoriesContainer.style.display = 'block';
        if (metaSearchInput) metaSearchInput.value = "";
        if (filterMetaStatus) filterMetaStatus.value = "all";
    });
}

inicializarMetaCars();