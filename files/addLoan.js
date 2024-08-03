import { getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

let selectedItems = [];

async function fetchItems() {
    try {
        const itemsSnapshot = await getDocs(collection(db, 'inventory'));
        return itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

async function fetchEmployees() {
    try {
        const employeesSnapshot = await getDocs(collection(db, 'staff'));
        return employeesSnapshot.docs.map(doc => doc.data().name);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

document.getElementById('searchItem').addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase();
    const items = await fetchItems();

    const filteredItems = items.filter(item => item.name.toLowerCase().includes(query));
    displaySearchResults(filteredItems);
});

function displaySearchResults(items) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.textContent = `${item.name} - ${item.quantity} en inventario`;
        resultItem.addEventListener('click', () => addItemToSelection(item));
        searchResults.appendChild(resultItem);
    });
}

function addItemToSelection(item) {
    if (!selectedItems.find(selected => selected.id === item.id)) {
        selectedItems.push(item);
        updateSelectedItemsList();
    }
}

function updateSelectedItemsList() {
    const selectedItemsList = document.getElementById('selectedItemsList');
    selectedItemsList.innerHTML = '';

    selectedItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Cantidad: ${item.quantity}`;
        selectedItemsList.appendChild(listItem);
    });
}

document.getElementById('loanForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const employeeName = document.getElementById('employeeSelect').value;
    const date = document.getElementById('loanDate').value;

    try {
        for (const item of selectedItems) {
            const quantity = parseInt(document.getElementById('itemQuantity').value, 10);
            if (quantity > item.quantity) {
                Swal.fire('¡Error!', `La cantidad solicitada para ${item.name} excede el inventario disponible.`, 'error');
                return;
            }
            const loanId = await generateLoanId();
            const loanData = {
                id: loanId,
                item: item.name,
                itemId: item.id,
                quantity,
                employee: employeeName,
                date: new Date(date),
                status: 'Activo'
            };

            await addDoc(collection(db, 'loans'), loanData);
        }

        showAlertWithRedirect('¡Éxito!', 'Préstamos creados con éxito.', 'success');
    } catch (error) {
        Swal.fire('¡Error!', 'No se pudo crear el préstamo.', 'error');
        console.error('Error creating loan:', error);
    }
});

async function generateLoanId() {
    try {
        const loansSnapshot = await getDocs(collection(db, 'loans'));
        const lastLoan = loansSnapshot.docs[loansSnapshot.docs.length - 1];
        const lastId = lastLoan ? lastLoan.data().id : 0;
        return lastId + 1;
    } catch (error) {
        console.error('Error generating loan ID:', error);
    }
}

async function initializeForm() {
    try {
        const employees = await fetchEmployees();

        const employeeSelect = document.getElementById('employeeSelect');
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee;
            option.textContent = employee;
            employeeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error initializing form:', error);
    }
}

initializeForm();

document.getElementById('btnCancel').addEventListener('click', () => {
    window.location.href = 'loans.html';
});

function showAlertWithRedirect(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'loans.html';
        }
    });
}