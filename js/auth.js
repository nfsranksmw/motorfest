import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { 
    doc, 
    setDoc, 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const userTagDisplay = document.getElementById('user-tag-display');
const btnLogout = document.getElementById('btn-logout');

const recordForm = document.getElementById('record-form');
const recordIdHidden = document.getElementById('record-id-hidden');
const btnSubmitRecord = document.getElementById('btn-submit-record');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const myRecordsTbody = document.getElementById('my-records-tbody');

// Referencias para el formulario y tabla de Pro Settings
const prosettingForm = document.getElementById('prosetting-form');
const prosettingIdHidden = document.getElementById('prosetting-id-hidden');
const btnSubmitProsetting = document.getElementById('btn-submit-prosetting');
const btnCancelProedit = document.getElementById('btn-cancel-proedit');
const myProsettingsTbody = document.getElementById('my-prosettings-tbody');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, loginEmailInput.value, loginPasswordInput.value);
        } catch (error) {
            alert("Error al iniciar sesión: " + error.message);
        }
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert("Has cerrado sesión.");
        } catch (error) {
            console.error("Error al salir: ", error);
        }
    });
}

// Cargar récords del usuario en su tabla
async function cargarMisRecords(pilotName) {
    if (!myRecordsTbody) return;
    myRecordsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #9ca3af; padding: 15px;">Cargando tus récords...</td></tr>`;

    try {
        const q = query(collection(db, "records"), where("pilot", "==", pilotName));
        const querySnapshot = await getDocs(q);

        myRecordsTbody.innerHTML = "";

        if (querySnapshot.empty) {
            myRecordsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #6b7280; padding: 15px;">No has publicado ningún récord todavía.</td></tr>`;
            return;
        }

        querySnapshot.forEach((documentSnapshot) => {
            const data = documentSnapshot.data();
            const docId = documentSnapshot.id;

            let fechaFormateada = "Desconocida";
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                const dateObj = data.createdAt.toDate();
                fechaFormateada = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #1f293d";
            tr.innerHTML = `
                <td style="padding: 12px;"><strong>${data.track || ''}</strong><br><span style="font-size: 11px; color: #9ca3af;">${data.category || ''} | Plaf: ${data.platform || 'N/A'}</span></td>
                <td style="padding: 12px;">${data.car || ''}<br><span style="font-size: 11px; color: #ffe600;">${data.carCategory || ''}</span></td>
                <td style="padding: 12px; color: #ffe600; font-family: 'Orbitron', sans-serif;">${data.timeScore || ''}</td>
                <td style="padding: 12px; font-size: 12px; color: #9ca3af;">${fechaFormateada}</td>
                <td style="padding: 12px; text-align: center;">
                    <button type="button" class="btn-edit-item btn-secondary" 
                        data-id="${docId}" 
                        data-category="${data.category || ''}" 
                        data-track="${data.track || ''}" 
                        data-platform="${data.platform || ''}" 
                        data-carcat="${data.carCategory || ''}" 
                        data-car="${data.car || ''}" 
                        data-time="${data.timeScore || ''}" 
                        data-video="${data.videoUrl || ''}" 
                        style="padding: 5px 10px; font-size: 11px; margin-right: 5px; cursor: pointer;">Editar</button>
                    <button type="button" class="btn-delete-item btn-secondary" data-id="${docId}" style="padding: 5px 10px; font-size: 11px; background: #ef4444; border-color: #ef4444; color: white; cursor: pointer;">Eliminar</button>
                </td>
            `;
            myRecordsTbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-edit-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const ds = e.currentTarget.dataset;
                
                recordIdHidden.value = ds.id;
                document.getElementById('record-category').value = ds.category;
                document.getElementById('record-track').value = ds.track;
                document.getElementById('record-platform').value = ds.platform; // Cargar la plataforma al editar
                document.getElementById('car-category-select').value = ds.carcat;
                document.getElementById('car-input').value = ds.car;
                document.getElementById('record-time').value = ds.time;
                document.getElementById('record-video').value = ds.video;

                btnSubmitRecord.textContent = "Actualizar Récord";
                if (btnCancelEdit) btnCancelEdit.classList.remove('hidden');
                
                recordForm.scrollIntoView({ behavior: 'smooth' });
            });
        });

        document.querySelectorAll('.btn-delete-item').forEach(button => {
            button.addEventListener('click', async (e) => {
                const docId = e.currentTarget.dataset.id;
                if (confirm("¿Estás seguro de que deseas eliminar este récord del expediente?")) {
                    try {
                        await deleteDoc(doc(db, "records", docId));
                        alert("Récord eliminado correctamente.");
                        const currentUser = auth.currentUser;
                        if (currentUser) {
                            cargarMisRecords(currentUser.email.split('@')[0].toUpperCase());
                        }
                    } catch (error) {
                        console.error("Error al eliminar:", error);
                        alert("No se pudo eliminar el récord.");
                    }
                }
            });
        });

    } catch (error) {
        console.error("Error al cargar mis récords:", error);
        myRecordsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ef4444; padding: 15px;">Error al cargar tus récords.</td></tr>`;
    }
}

// Cargar Pro Settings propios del usuario en su panel
async function cargarMisProsettings(pilotName) {
    if (!myProsettingsTbody) return;
    myProsettingsTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #9ca3af; padding: 15px;">Cargando tus Pro Settings...</td></tr>`;

    try {
        const q = query(collection(db, "prosettings"), where("tuner", "==", pilotName));
        const querySnapshot = await getDocs(q);

        myProsettingsTbody.innerHTML = "";

        if (querySnapshot.empty) {
            myProsettingsTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #6b7280; padding: 15px;">No has publicado ningún Pro Setting todavía.</td></tr>`;
            return;
        }

        querySnapshot.forEach((documentSnapshot) => {
            const data = documentSnapshot.data();
            const docId = documentSnapshot.id;

            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #1f293d";
            tr.innerHTML = `
                <td style="padding: 12px;"><strong>${data.carName || ''}</strong><br><span style="font-size: 11px; color: #ffe600;">${data.category || ''}</span></td>
                <td style="padding: 12px; font-size: 12px; color: #9ca3af;">Power: ${data.power || 'N/A'}<br>Weight: ${data.weight || 'N/A'}</td>
                <td style="padding: 12px; font-size: 12px; color: #9ca3af;">Spring F: ${data.springFront || '0%'} | R: ${data.springRear || '0%'}</td>
                <td style="padding: 12px; text-align: center;">
                    <button type="button" class="btn-edit-proitem btn-secondary" 
                        data-id="${docId}" 
                        data-category="${data.category || ''}" 
                        data-carname="${data.carName || ''}" 
                        data-power="${data.power || ''}" 
                        data-weight="${data.weight || ''}" 
                        data-speed="${data.speed || ''}" 
                        data-finaldrive="${data.finalDrive || ''}"
                        data-gripfront="${data.gripFront || ''}"
                        data-griprear="${data.gripRear || ''}"
                        data-brakebalance="${data.brakeBalance || ''}"
                        data-brakepower="${data.brakePower || ''}"
                        data-loadfront="${data.loadFront || ''}"
                        data-loadrear="${data.loadRear || ''}"
                        data-springfront="${data.springFront || ''}" 
                        data-springrear="${data.springRear || ''}"
                        data-compfront="${data.compFront || ''}"
                        data-comprear="${data.compRear || ''}"
                        data-rebfront="${data.rebFront || ''}"
                        data-rebrear="${data.rebRear || ''}"
                        data-arbfront="${data.arbFront || ''}"
                        data-arbrear="${data.arbRear || ''}"
                        data-camberfront="${data.camberFront || ''}"
                        data-camberrear="${data.camberRear || ''}"
                        style="padding: 5px 10px; font-size: 11px; margin-right: 5px; cursor: pointer;">Editar</button>
                    <button type="button" class="btn-delete-proitem btn-secondary" data-id="${docId}" style="padding: 5px 10px; font-size: 11px; background: #ef4444; border-color: #ef4444; color: white; cursor: pointer;">Eliminar</button>
                </td>
            `;
            myProsettingsTbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-edit-proitem').forEach(button => {
            button.addEventListener('click', (e) => {
                const ds = e.currentTarget.dataset;
                
                if (prosettingIdHidden) prosettingIdHidden.value = ds.id;
                document.getElementById('ps-category').value = ds.category;
                document.getElementById('ps-carname').value = ds.carname;
                document.getElementById('ps-power').value = ds.power;
                document.getElementById('ps-weight').value = ds.weight;
                document.getElementById('ps-speed').value = ds.speed;
                
                document.getElementById('ps-finaldrive').value = ds.finaldrive || '';
                document.getElementById('ps-gripfront').value = ds.gripfront || '';
                document.getElementById('ps-griprear').value = ds.griprear || '';
                document.getElementById('ps-brakebalance').value = ds.brakebalance || '';
                document.getElementById('ps-brakepower').value = ds.brakepower || '';
                document.getElementById('ps-loadfront').value = ds.loadfront || '';
                document.getElementById('ps-loadrear').value = ds.loadrear || '';
                document.getElementById('ps-springfront').value = ds.springfront || '';
                document.getElementById('ps-springrear').value = ds.springrear || '';
                document.getElementById('ps-compfront').value = ds.compfront || '';
                document.getElementById('ps-comprear').value = ds.comprear || '';
                document.getElementById('ps-rebfront').value = ds.rebfront || '';
                document.getElementById('ps-rebrear').value = ds.rebrear || '';
                document.getElementById('ps-arbfront').value = ds.arbfront || '';
                document.getElementById('ps-arbrear').value = ds.arbrear || '';
                document.getElementById('ps-camberfront').value = ds.camberfront || '';
                document.getElementById('ps-camberrear').value = ds.camberrear || '';

                if (btnSubmitProsetting) btnSubmitProsetting.textContent = "Actualizar Pro Setting";
                if (btnCancelProedit) btnCancelProedit.classList.remove('hidden');
                
                prosettingForm.scrollIntoView({ behavior: 'smooth' });
            });
        });

        document.querySelectorAll('.btn-delete-proitem').forEach(button => {
            button.addEventListener('click', async (e) => {
                const docId = e.currentTarget.dataset.id;
                if (confirm("¿Estás seguro de que deseas eliminar este Pro Setting?")) {
                    try {
                        await deleteDoc(doc(db, "prosettings", docId));
                        alert("Pro Setting eliminado correctamente.");
                        const currentUser = auth.currentUser;
                        if (currentUser) {
                            cargarMisProsettings(currentUser.email.split('@')[0].toUpperCase());
                        }
                    } catch (error) {
                        console.error("Error al eliminar pro setting:", error);
                        alert("No se pudo eliminar el ajuste.");
                    }
                }
            });
        });

    } catch (error) {
        console.error("Error al cargar tus Pro Settings:", error);
        myProsettingsTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 15px;">Error al cargar tus Pro Settings.</td></tr>`;
    }
}

if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
        recordForm.reset();
        recordIdHidden.value = "";
        btnSubmitRecord.textContent = "Publicar Récord";
        btnCancelEdit.classList.add('hidden');
    });
}

if (btnCancelProedit) {
    btnCancelProedit.addEventListener('click', () => {
        prosettingForm.reset();
        if (prosettingIdHidden) prosettingIdHidden.value = "";
        btnSubmitProsetting.textContent = "Guardar Pro Setting";
        btnCancelProedit.classList.add('hidden');
    });
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (authSection) authSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        
        const pilotName = user.email.split('@')[0].toUpperCase();
        if (userTagDisplay) {
            userTagDisplay.textContent = pilotName;
        }

        cargarMisRecords(pilotName);
        cargarMisProsettings(pilotName);

        try {
            const userRef = doc(db, "members", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                pilotName: pilotName,
                email: user.email,
                photoURL: user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=" + pilotName,
                lastLogin: new Date()
            }, { merge: true });
        } catch (error) {
            console.error("Error al registrar miembro automáticamente: ", error);
        }

    } else {
        if (authSection) authSection.classList.remove('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
    }
});

if (recordForm) {
    recordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Debes iniciar sesión para publicar un récord.");
            return;
        }

        const pilotName = currentUser.email.split('@')[0].toUpperCase();
        const recordId = recordIdHidden.value;

        // Se incluye el campo platform aquí para enviarlo a Firestore
        const recordData = {
            pilot: pilotName,
            category: document.getElementById('record-category').value,
            track: document.getElementById('record-track').value,
            platform: document.getElementById('record-platform').value, // <--- CAMBIO APLICADO
            carCategory: document.getElementById('car-category-select').value,
            car: document.getElementById('car-input').value,
            timeScore: document.getElementById('record-time').value,
            videoUrl: document.getElementById('record-video').value,
            updatedAt: new Date()
        };

        try {
            if (recordId) {
                const docRef = doc(db, "records", recordId);
                await updateDoc(docRef, recordData);
                alert("¡Récord actualizado con éxito!");
            } else {
                recordData.createdAt = new Date();
                await addDoc(collection(db, "records"), recordData);
                alert("¡Récord publicado con éxito en el expediente!");
            }

            recordForm.reset();
            recordIdHidden.value = "";
            btnSubmitRecord.textContent = "Publicar Récord";
            if (btnCancelEdit) btnCancelEdit.classList.add('hidden');
            
            cargarMisRecords(pilotName);

        } catch (error) {
            console.error("Error en la operación del récord: ", error);
            alert("Hubo un error en la base de datos: " + error.message);
        }
    });
}

// Lógica de envío del formulario de Pro Settings
if (prosettingForm) {
    prosettingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Debes iniciar sesión para publicar un Pro Setting.");
            return;
        }

        const pilotName = currentUser.email.split('@')[0].toUpperCase();
        const prosettingId = prosettingIdHidden ? prosettingIdHidden.value : "";

        const psData = {
            tuner: pilotName,
            category: document.getElementById('ps-category').value,
            carName: document.getElementById('ps-carname').value,
            power: document.getElementById('ps-power').value,
            weight: document.getElementById('ps-weight').value,
            speed: document.getElementById('ps-speed').value,
            finalDrive: document.getElementById('ps-finaldrive').value,
            gripFront: document.getElementById('ps-gripfront').value,
            gripRear: document.getElementById('ps-griprear').value,
            brakeBalance: document.getElementById('ps-brakebalance').value,
            brakePower: document.getElementById('ps-brakepower').value,
            loadFront: document.getElementById('ps-loadfront').value,
            loadRear: document.getElementById('ps-loadrear').value,
            springFront: document.getElementById('ps-springfront').value,
            springRear: document.getElementById('ps-springrear').value,
            compFront: document.getElementById('ps-compfront').value,
            compRear: document.getElementById('ps-comprear').value,
            rebFront: document.getElementById('ps-rebfront').value,
            rebRear: document.getElementById('ps-rebrear').value,
            arbFront: document.getElementById('ps-arbfront').value,
            arbRear: document.getElementById('ps-arbrear').value,
            camberFront: document.getElementById('ps-camberfront').value,
            camberRear: document.getElementById('ps-camberrear').value,
            updatedAt: new Date()
        };

        try {
            if (prosettingId) {
                const docRef = doc(db, "prosettings", prosettingId);
                await updateDoc(docRef, psData);
                alert("¡Pro Setting actualizado con éxito!");
            } else {
                psData.createdAt = new Date();
                await addDoc(collection(db, "prosettings"), psData);
                alert("¡Pro Setting publicado con éxito en el garaje!");
            }

            prosettingForm.reset();
            if (prosettingIdHidden) prosettingIdHidden.value = "";
            if (btnSubmitProsetting) btnSubmitProsetting.textContent = "Guardar Pro Setting";
            if (btnCancelProedit) btnCancelProedit.classList.add('hidden');

            cargarMisProsettings(pilotName);

        } catch (error) {
            console.error("Error al guardar pro setting:", error);
            alert("Error al guardar el ajuste: " + error.message);
        }
    });
}