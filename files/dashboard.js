import { getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function() {
    const inventoryLink = document.getElementById('inventoryLink');
    const loansLink = document.getElementById('loansLink');
    const personnelLink = document.getElementById('personnelLink');
    const inventorySection = document.getElementById('inventorySection');
    const loansSection = document.getElementById('loansSection');
    const personnelSection = document.getElementById('personnelSection');
    const sidebarTitle = document.getElementById('sidebarTitle');

    // Función para actualizar el nombre del usuario en la barra lateral
    async function updateSidebarTitle() {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');

        if (email) {
            const usersCollection = collection(db, 'users');
            const userQuery = query(usersCollection, where("email", "==", email));

            try {
                const querySnapshot = await getDocs(userQuery);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0].data();
                    if (sidebarTitle) {
                        sidebarTitle.textContent = `Bienvenido ${userDoc.name}`;
                    }
                } else {
                    console.error('No se encontró el documento del usuario.');
                }
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        } else {
            console.error('No se proporcionó un correo electrónico.');
        }
    }

    // Llama a la función para actualizar el título de la barra lateral
    updateSidebarTitle();

    // Funcionalidad de secciones
    inventoryLink.addEventListener('click', function() {
        showSection(inventorySection);
    });

    loansLink.addEventListener('click', function() {
        showSection(loansSection);
    });

    personnelLink.addEventListener('click', function() {
        showSection(personnelSection);
    });

    function showSection(section) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(sec => sec.classList.remove('active'));
        section.classList.add('active');
    }

    // Muestra la sección de inventario por defecto
    showSection(inventorySection);
});