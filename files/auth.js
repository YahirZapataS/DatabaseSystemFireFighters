import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from './firebaseConfig.js';

const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario Autenticado', userCredential.user);

        // Redirigir al dashboard con el correo como parámetro en la URL
        window.location.href = `dashboard.html?email=${encodeURIComponent(email)}`;
    } catch (error) {
        showAlert('¡Ups!', 'Correo o contraseña incorrectos. Intentalo de nuevo', 'error');
    }
});

const showPassword = document.getElementById('showPassword');
showPassword.addEventListener('change', function () {
    const passwordInput = document.getElementById('password');
    passwordInput.type = this.checked ? 'text' : 'password';
});

const btnRegister = document.getElementById('btnRegister');
btnRegister.addEventListener('click', function () {
    window.location.href = 'signup.html';
});

function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}