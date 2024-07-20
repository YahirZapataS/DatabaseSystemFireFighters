import { auth } from "./firebaseConfig";

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Usuario o contraseña incorrectos',
                text: 'Verifica tus credenciales e intentalo de nuevo'
            });
        });
});