import { getDocs, doc, updateDoc, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

const loansTableBody = document.getElementById('loansTable').querySelector('tbody');
const statusFilter = document.getElementById('statusFilter');

statusFilter.addEventListener('change', fetchLoans);

async function fetchLoans() {
    const status = statusFilter.value;
    const loansSnapshot = await getDocs(collection(db, 'loans'));
    loansTableBody.innerHTML = '';

    loansSnapshot.forEach((doc) => {
        const loan = doc.data();
        if (status === 'Todos' || loan.status === status) {
            addLoanToTable(doc.id, loan);
        }
    });
}

function addLoanToTable(id, loan) {
    const row = loansTableBody.insertRow();
    row.setAttribute('data-id', id);
    row.innerHTML = `
        <td>${loan.id}</td>
        <td>${loan.item}</td>
        <td>${loan.quantity}</td>
        <td>${loan.employee}</td>
        <td>${new Date(loan.date.toDate()).toLocaleDateString()}</td>
        <td>${loan.status}</td>
        <td>${loan.status === 'Terminado' ? '' : '<button class="btnEdit" data-id="${id}">Editar</button>'}</td>
        <td>${loan.status === 'Terminado' ? '' : '<button class="btnComplete" data-id="${id}">Terminar</button>'}</td>
    `;

    // Add event listeners for Edit and Complete buttons if they exist
    const editButton = row.querySelector('.btnEdit');
    if (editButton) {
        editButton.addEventListener('click', () => {
            window.location.href = `editLoan.html?loanId=${id}`;
        });
    }

    const completeButton = row.querySelector('.btnComplete');
    if (completeButton) {
        completeButton.addEventListener('click', async () => {
            try {
                await updateDoc(doc(db, 'loans', id), { status: 'Terminado' });
                Swal.fire('¡Éxito!', 'El préstamo ha sido marcado como terminado.', 'success');
                fetchLoans(); // Refresh the loans table to reflect the change
            } catch (error) {
                Swal.fire('¡Error!', 'No se pudo actualizar el estado del préstamo.', 'error');
                console.error('Error updating loan status:', error);
            }
        });
    }
}

document.getElementById('btnAddLoan').addEventListener('click', async () => {
    try {
        const loanId = await generateLoanId();
        window.location.href = `addLoan.html?loanId=${loanId}`;
    } catch (error) {
        Swal.fire('¡Error!', 'No se pudo crear el nuevo préstamo.', 'error');
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

fetchLoans();