import { getDocs, setDoc, doc, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

async function getNextStaffId() {
    const staffSnapshot = await getDocs(collection(db, 'staff'));
    let maxId = 0;
    staffSnapshot.forEach((doc) => {
        const id = parseInt(doc.id, 10);
        if (id > maxId) {
            maxId = id;
        }
    });
    return (maxId + 1).toString();
}

document.getElementById('addStaffForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const staffData = {
        name: document.getElementById('staffName').value,
        position: document.getElementById('staffPosition').value,
        email: document.getElementById('staffEmail').value,
        phone: document.getElementById('staffPhone').value,
    };

    try {
        const newStaffId = await getNextStaffId();
        await setDoc(doc(db, 'staff', newStaffId), staffData);
        Swal.fire('¡Éxito!', 'Empleado agregado con éxito.', 'success').then(() => {
            window.location.href = 'staff.html';
        });
    } catch (error) {
        Swal.fire('¡Error!', 'No se pudo agregar el empleado.', 'error');
        console.error('Error adding document: ', error);
    }
});