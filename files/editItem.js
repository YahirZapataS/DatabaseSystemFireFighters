import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('itemId');
    
    if (!itemId) {
        Swal.fire('¡Error!', 'ID del item no proporcionado.', 'error');
        return;
    }

    try {
        const itemDoc = doc(db, 'inventory', itemId);
        const itemSnapshot = await getDoc(itemDoc);

        if (itemSnapshot.exists()) {
            const item = itemSnapshot.data();
            document.getElementById('itemId').value = itemId;
            document.getElementById('itemName').value = item.name || '';
            document.getElementById('itemDescription').value = item.description || '';
            document.getElementById('itemCount').value = item.count || '';
            document.getElementById('itemClassification').value = item.classification || '';
            document.getElementById('itemCapacity').value = item.capacity || '';
            document.getElementById('itemLocation').value = item.location || '';
            document.getElementById('itemBrand').value = item.brand || '';
            document.getElementById('itemExpiryDate').value = item.expiryDate || '';
            document.getElementById('itemStatus').value = item.status || '';
        } else {
            Swal.fire('¡Error!', 'Item no encontrado.', 'error');
        }

        document.getElementById('editItemForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedItem = {
                name: document.getElementById('itemName').value,
                description: document.getElementById('itemDescription').value,
                count: parseInt(document.getElementById('itemCount').value, 10),
                classification: document.getElementById('itemClassification').value,
                capacity: document.getElementById('itemCapacity').value,
                location: document.getElementById('itemLocation').value,
                brand: document.getElementById('itemBrand').value,
                expiryDate: document.getElementById('itemExpiryDate').value,
                status: document.getElementById('itemStatus').value,
            };

            try {
                await updateDoc(itemDoc, updatedItem);
                Swal.fire('¡Éxito!', 'Item actualizado con éxito.', 'success').then(() => {
                    window.location.href = 'inventory.html';
                });
            } catch (error) {
                Swal.fire('¡Error!', 'No se pudo actualizar el item.', 'error');
            }
        });

    } catch (error) {
        console.error('Error al obtener el documento:', error);
        Swal.fire('¡Error!', 'Error al obtener el item.', 'error');
    }
});

document.getElementById('btnCancel').addEventListener('click', () => {
    window.location.href = 'inventory.html';
});