import { getDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

// Obtener el ID del empleado de la URL
const urlParams = new URLSearchParams(window.location.search);
const staffId = urlParams.get('staffId');

if (!staffId) {
    Swal.fire('¡Error!', 'ID del empleado no proporcionado.', 'error').then(() => {
        window.location.href = 'staff.html';
    });
}

// Función para cargar los datos del empleado en el formulario
async function loadStaffData() {
    const staffDoc = doc(db, 'staff', staffId);
    const staffSnapshot = await getDoc(staffDoc);

    if (staffSnapshot.exists()) {
        const staff = staffSnapshot.data();
        document.getElementById('staffId').value = staffId;
        document.getElementById('staffName').value = staff.name;
        document.getElementById('staffPosition').value = staff.position;
        document.getElementById('staffEmail').value = staff.email;
        document.getElementById('staffPhone').value = staff.phone;
    } else {
        Swal.fire('¡Error!', 'Empleado no encontrado.', 'error').then(() => {
            window.location.href = 'staff.html';
        });
    }
}

// Función para manejar el envío del formulario de edición de empleado
document.getElementById('editStaffForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const staffData = {
        name: document.getElementById('staffName').value,
        position: document.getElementById('staffPosition').value,
        email: document.getElementById('staffEmail').value,
        phone: document.getElementById('staffPhone').value,
    };

    try {
        const staffDoc = doc(db, 'staff', staffId);
        await updateDoc(staffDoc, staffData);
        Swal.fire('¡Éxito!', 'Empleado actualizado con éxito.', 'success').then(() => {
            window.location.href = 'staff.html';
        });
    } catch (error) {
        Swal.fire('¡Error!', 'No se pudo actualizar el empleado.', 'error');
        console.error('Error updating document: ', error);
    }
});

// Cargar los datos del empleado al cargar la página
loadStaffData();