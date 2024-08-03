import { getDocs, collection, query, deleteDoc, orderBy, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

const inventoryTableBody = document.getElementById('inventoryTable').querySelector('tbody');
const classificationFilter = document.getElementById('classificationFilter');
const locationFilter = document.getElementById('locationFilter');
const brandFilter = document.getElementById('brandFilter');
const statusFilter = document.getElementById('statusFilter');

async function fetchInventory() {
    const inventoryQuery = query(collection(db, 'inventory'), orderBy('id'));
    const querySnapshot = await getDocs(inventoryQuery);

    window.inventoryData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    populateFilters();
    renderTable(window.inventoryData);
}

function populateFilters() {
    const classifications = new Set();
    const locations = new Set();
    const brands = new Set();
    const statuses = new Set();

    window.inventoryData.forEach(item => {
        classifications.add(item.classification);
        locations.add(item.location);
        brands.add(item.brand);
        statuses.add(item.status);
    });

    classificationFilter.innerHTML = `<option value="">Todas</option>` + Array.from(classifications).map(c => `<option value="${c}">${c}</option>`).join('');
    locationFilter.innerHTML = `<option value="">Todas</option>` + Array.from(locations).map(l => `<option value="${l}">${l}</option>`).join('');
    brandFilter.innerHTML = `<option value="">Todas</option>` + Array.from(brands).map(b => `<option value="${b}">${b}</option>`).join('');
    statusFilter.innerHTML = `<option value="">Todos</option>` + Array.from(statuses).map(s => `<option value="${s}">${s}</option>`).join('');
}

function filterData() {
    const classification = classificationFilter.value;
    const location = locationFilter.value;
    const brand = brandFilter.value;
    const status = statusFilter.value;

    const filteredData = window.inventoryData.filter(item => {
        return (
            (classification === '' || item.classification === classification) &&
            (location === '' || item.location === location) &&
            (brand === '' || item.brand === brand) &&
            (status === '' || item.status === status)
        );
    });

    renderTable(filteredData);
}

function renderTable(data) {
    inventoryTableBody.innerHTML = '';
    data.forEach(item => {
        addItemToTable(item.id, item);
    });
}

function addItemToTable(id, item) {
    const row = inventoryTableBody.insertRow();
    row.setAttribute('data-id', id);
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.classification}</td>
        <td>${item.capacity}</td>
        <td>${item.location}</td>
        <td>${item.brand}</td>
        <td>${item.expiryDate}</td>
        <td>${item.status}</td>
        <td>
            <button class="edit-btn" onclick="editItem('${id}')">Editar</button>
            <button class="delete-btn" onclick="deleteItem('${id}')">Eliminar</button>
        </td>
    `;
}

classificationFilter.addEventListener('change', filterData);
locationFilter.addEventListener('change', filterData);
brandFilter.addEventListener('change', filterData);
statusFilter.addEventListener('change', filterData);

window.editItem = function(id) {
    window.location.href = `editItem.html?itemId=${id}`;
}

window.deleteItem = async function(id) {
    try {
        await deleteDoc(doc(db, 'inventory', id));
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }
        Swal.fire('Eliminado!', 'El equipo/utilería ha sido eliminado.', 'success');
    } catch (e) {
        console.error('Error al eliminar el ítem:', e);
        Swal.fire('¡Error!', 'No se pudo eliminar el equipo/utilería', 'error');
    }
}

fetchInventory();