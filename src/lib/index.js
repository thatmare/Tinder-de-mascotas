// aqui exportaras las funciones que necesites

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
} from 'firebase/auth';
import { firebaseConfig } from '../firebase.config.js';


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Firebase Authentication and get a reference to the service

export const signPop = async (event) => {
  event.preventDefault();
  const provider = new GoogleAuthProvider();
  try {
    // Ejecutar la autenticación con Google
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log(credential);

    // Iniciar sesión en Firebase con las credenciales obtenidas
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (navigateTo) => {
  const email = document.getElementById('txtEmail');
  const password = document.getElementById('txtPasswordAgain');
  const spanEmail = document.getElementById('spanErrorEmail');
  const spanPassword = document.getElementById('spanErrorPassword');
  const spanCreateUser = document.getElementById('spanCreateUser');

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log(userCredential);

    // spanCreateUser.style.display = 'flex';
    // spanCreateUser.textContent = 'You have successfully signed up!';
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    if (errorCode === 'auth/email-already-in-use') {
      spanEmail.textContent = 'Email in use';
    } else if (errorCode === 'auth/invalid-email') {
      spanEmail.textContent = 'Invalid Email';
    } else if (errorCode === 'auth/weak-password') {
      spanPassword.textContent = 'Password is too weak';
    }
  }
};

export const LoginUser = () => {
  const emailInput = document.getElementById('txtEmail');
  const passwordInput = document.getElementById('txtPassword');
  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      if (errorCode === 'auth/user-not-found') {
        emailInput.classList.add('invalid');
        document.getElementById('spanErrorEmail').textContent = 'User not found';
      } else if (errorCode === 'auth/wrong-password') {
        passwordInput.classList.add('invalid');
        document.getElementById('spanErrorPassword').textContent = 'Wrong password';
      }
    });
};

// Validación de contraseña segura
export const securePassword = () => {
  const password = document.getElementById('txtPassword');
  const paswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_][^\s]{6,15}$/;

  if (paswordRegex.test(password.value)) {
    password.classList.remove('invalid');
    password.classList.add('valid');
    document.getElementById('spanErrorPassword').textContent = '';
  } else {
    password.classList.remove('valid');
    password.classList.add('invalid');
    document.getElementById('spanErrorPassword').textContent = 'Please enter a strong password that contains 6 to 15 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character. Please make sure there are no spaces.';
  }
};

// Validación de que las contraseñas coincidan
export const validatePassowrds = () => {
  const passwordValue = document.getElementById('txtPassword').value;
  const passwordAgain = document.getElementById('txtPasswordAgain');
  const passwordAgainValue = passwordAgain.value;
  const spanErrorPasswordAgain = document.getElementById('spanErrorPasswordAgain');

  if (passwordValue !== passwordAgainValue) {
    passwordAgain.classList.remove('valid');
    passwordAgain.classList.add('invalid');
    spanErrorPasswordAgain.textContent = 'Passwords are different.';
  } else {
    passwordAgain.classList.remove('invalid');
    passwordAgain.classList.add('valid');
    spanErrorPasswordAgain.textContent = '';
  }
};

// Validación de que sea email
export const validateEmail = () => {
  const email = document.getElementById('txtEmail');
  const correoRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;

  if (correoRegex.test(email.value)) {
    email.classList.remove('invalid');
    email.classList.add('valid');
    document.getElementById('spanErrorEmail').textContent = '';
  } else {
    email.classList.remove('valid');
    email.classList.add('invalid');
    document.getElementById('spanErrorEmail').textContent = 'Please enter a valid email.';
  }
};
