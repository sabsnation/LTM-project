import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from './init'

let googleProvider = null;

// Inicializar o provider apenas quando necessário
const getGoogleProvider = () => {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
  }
  return googleProvider;
};

const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

const loginWithGoogle = async () => {
  try {
    const provider = getGoogleProvider();
    const userCredential = await signInWithPopup(auth, provider)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

const logoutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    throw error
  }
}

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    console.log('Verificando estado de autenticação do usuário...')
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Estado de autenticação mudou, usuário:', user)
      unsubscribe()
      resolve(user)
    }, (error) => {
      console.error('Erro no estado de autenticação:', error)
      reject(error)
    })
  })
}

const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback)
}

export {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  getCurrentUser,
  onAuthStateChangedListener
}