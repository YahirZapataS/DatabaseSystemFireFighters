import { addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

const inventoryForm = document.getElementById('inventoryForm');

inventoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const item = {
        name: inventoryForm.itemName.value,
        classification: inventoryForm.itemClassification.value,
        quantity: inventoryForm.itemQuantity.value,
        capacity: inventoryForm.itemCapacity.value,
        location: inventoryForm.itemLocation.value,
        brand: inventoryForm.itemBrand.value,
        expiryDate: inventoryForm.itemExpiryDate.value,
        status: inventoryForm.itemStatus.value
    };

    try {
        const nextId = await getNextId();
        await addDoc(collection(db, 'inventory'), { id: nextId, ...item });

        Swal.fire({
            title: '¡Listo!',
            text: 'Equipo/Utilería agregado con éxito',
            icon: 'success'
        }).then(() => {
            window.location.href = 'inventory.html';
        });
    } catch (e) {
        Swal.fire('¡Error!', 'No se pudo agregar el equipo/utilería', 'error');
    }
});

async function getNextId() {
    const inventoryCollection = collection(db, 'inventory');
    const querySnapshot = await getDocs(inventoryCollection);

    const nextId = querySnapshot.size + 1;

    return nextId;
}