import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth, db } from './firebaseConfig.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formGroup');
    const passwordInput = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const showPassword = document.getElementById('showPassword');
    const btnCancel = document.getElementById('btnCancel');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = form.email.value;
            const password = form.password.value;
            const confirmPassword = form.confirmPassword.value;
            const name = form.name.value;
            const lastname = form.lastname.value;
            const position = form.position.value;

            if (password.length < 6) {
                showAlert('¡Ups!', 'La contraseña debe tener al menos 6 caracteres.', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('¡Ups!', 'Las contraseñas no coinciden.', 'error');
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await saveFormDataToFirestore(email, name, lastname, position);

                form.reset();

                showAlertWithRedirect('Listo!', 'Usuario Creado con éxito.', 'success');

            } catch (error) {
                showAlert('¡Ups!', 'Algo pasó, Usuario no registrado', 'error');
            }
        });

        passwordInput.addEventListener('input', () => {
            updatePasswordStrength(passwordInput.value);
        });

        showPassword.addEventListener('change', function () {
            passwordInput.type = this.checked ? 'text' : 'password';
            confirmPasswordInput.type = this.checked ? 'text' : 'password';
        });

        btnCancel.addEventListener('click', async () => {
            window.location.replace('index.html');
        });
    } else {
        console.error('El elemento formGroup no se encuentra en el DOM.');
    }
});

function updatePasswordStrength(password) {
    const strengthMeter = document.createElement('div');
    strengthMeter.className = 'strengthMeter';

    if (password.length < 6) {
        strengthMeter.style.width = '20%';
        strengthMeter.style.backgroundColor = 'red';
    } else if (password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strengthMeter.style.width = '100%';
        strengthMeter.style.backgroundColor = 'green';
    } else if (password.length >= 6 && /[A-Z]/.test(password)) {
        strengthMeter.style.width = '60%';
        strengthMeter.style.backgroundColor = 'orange';
    } else {
        strengthMeter.style.width = '40%';
        strengthMeter.style.backgroundColor = 'yellow';
    }

    passwordStrength.innerHTML = '';
    passwordStrength.appendChild(strengthMeter);
}

async function saveFormDataToFirestore(email, name, lastname, position) {
    try {
        await addDoc(collection(db, 'users'), {
            email: email,
            name: name,
            lastname: lastname,
            position: position
        });
    } catch (error) {
        showAlert('¡Ups!', 'Ha ocurrido un error al guardar los datos en la base de datos', 'error');
    }
}

function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

function showAlertWithRedirect(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'index.html';
        }
    });
}
