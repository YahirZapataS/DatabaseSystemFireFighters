import { getDocs, collection, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

const staffTableBody = document.getElementById('staffTable').querySelector('tbody');

async function fetchStaff() {
    const staffSnapshot = await getDocs(collection(db, 'staff'));
    staffTableBody.innerHTML = '';

    staffSnapshot.forEach((doc) => {
        const staff = doc.data();
        addStaffToTable(doc.id, staff);
    });
}

function addStaffToTable(id, staff) {
    const row = staffTableBody.insertRow();
    row.setAttribute('data-id', id);
    row.innerHTML = `
        <td>${id}</td>
        <td>${staff.name}</td>
        <td>${staff.position}</td>
        <td>${staff.email}</td>
        <td>${staff.phone}</td>
        <td>
            <button class="edit-btn" onclick="editStaff('${id}')">Editar</button>
            <button class="delete-btn" onclick="deleteStaff('${id}')">Eliminar</button>
        </td>
    `;
}

document.getElementById('btnAddEmployee').addEventListener('click', () => {
    window.location.href = 'addStaff.html';
})

window.editStaff = function(id) {
    window.location.href = `editStaff.html?staffId=${id}`;
}

window.deleteStaff = async function(id) {
    try {
        await deleteDoc(doc(db, 'staff', id));
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if(row) {
            row.remove();
        }
        Swal.fire('Eliminado!', 'El personal seleccionado ha sido eleminado', 'success');
    } catch (e) {
        console.error('Error al eliminar el personal', e);
        Swal.fire('Error', 'No se pudo eliminar el empleado', 'error');
    }
}

fetchStaff();