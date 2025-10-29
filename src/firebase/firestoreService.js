import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  setDoc,
  orderBy,
  limit
} from 'firebase/firestore'
import { db } from './init'

// Users collection
const usersCollection = 'users'

// Therapists collection
const therapistsCollection = 'therapists'

// Letters collection
const lettersCollection = 'letters'

// User operations
const createUser = async (userData) => {
  try {
    console.log('Tentando criar usuário no Firestore:', userData)
    const userRef = doc(db, usersCollection, userData.id)
    
    // Verificar se o usuário já existe
    const userSnapshot = await getDoc(userRef)
    if (userSnapshot.exists()) {
      console.log('Usuário já existe no Firestore:', userSnapshot.data())
      return userRef
    }
    
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp()
    })
    console.log('Usuário criado com sucesso no Firestore')
    return userRef
  } catch (error) {
    console.error('Erro ao criar usuário no Firestore:', error)
    throw error
  }
}

const getUserById = async (userId) => {
  try {
    const userDoc = doc(db, usersCollection, userId)
    const userSnapshot = await getDoc(userDoc)
    return userSnapshot.exists() ? { id: userSnapshot.id, ...userSnapshot.data() } : null
  } catch (error) {
    throw error
  }
}

const updateUser = async (userId, userData) => {
  try {
    const userDoc = doc(db, usersCollection, userId)
    await updateDoc(userDoc, userData)
  } catch (error) {
    throw error
  }
}

// Therapist operations
const createTherapist = async (therapistData) => {
  try {
    const therapistRef = doc(db, therapistsCollection, therapistData.id)
    await setDoc(therapistRef, {
      ...therapistData,
      createdAt: serverTimestamp(),
      status_verification: 'pending' // Default status
    })
    return therapistRef
  } catch (error) {
    throw error
  }
}

const getTherapistById = async (therapistId) => {
  try {
    const therapistDoc = doc(db, therapistsCollection, therapistId)
    const therapistSnapshot = await getDoc(therapistDoc)
    return therapistSnapshot.exists() ? { id: therapistSnapshot.id, ...therapistSnapshot.data() } : null
  } catch (error) {
    throw error
  }
}

const updateTherapist = async (therapistId, therapistData) => {
  try {
    const therapistDoc = doc(db, therapistsCollection, therapistId)
    await updateDoc(therapistDoc, therapistData)
  } catch (error) {
    throw error
  }
}

const getTherapistByCode = async (code) => {
  try {
    const q = query(collection(db, therapistsCollection), where('code_vinculo', '==', code))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const therapistDoc = querySnapshot.docs[0]
      return { id: therapistDoc.id, ...therapistDoc.data() }
    }
    return null
  } catch (error) {
    throw error
  }
}

// Letters operations
const createLetter = async (letterData) => {
  try {
    console.log('Criando carta no Firestore:', letterData)
    const letterRef = doc(db, lettersCollection, letterData.id)
    await setDoc(letterRef, {
      ...letterData,
      createdAt: serverTimestamp()
    })
    console.log('Carta criada com sucesso no Firestore')
    return letterRef
  } catch (error) {
    console.error('Erro ao criar carta no Firestore:', error)
    throw error
  }
}

const getLetterById = async (letterId) => {
  try {
    const letterDoc = doc(db, lettersCollection, letterId)
    const letterSnapshot = await getDoc(letterDoc)
    return letterSnapshot.exists() ? { id: letterSnapshot.id, ...letterSnapshot.data() } : null
  } catch (error) {
    throw error
  }
}

const updateLetter = async (letterId, letterData) => {
  try {
    const letterDoc = doc(db, lettersCollection, letterId)
    await updateDoc(letterDoc, letterData)
  } catch (error) {
    throw error
  }
}

const getUserLetters = async (userId) => {
  try {
    const q = query(
      collection(db, lettersCollection), 
      where('author_id', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    throw error
  }
}

// General collection operations
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    })
    return docRef
  } catch (error) {
    throw error
  }
}

const getCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    throw error
  }
}

const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnapshot = await getDoc(docRef)
    return docSnapshot.exists() ? { id: docSnapshot.id, ...docSnapshot.data() } : null
  } catch (error) {
    throw error
  }
}

const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, data)
  } catch (error) {
    throw error
  }
}

const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    throw error
  }
}

// Queries with conditions
const getDocumentsByField = async (collectionName, field, operator, value) => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    throw error
  }
}

export {
  // Collections names
  usersCollection,
  therapistsCollection,
  lettersCollection,
  
  // User operations
  createUser,
  getUserById,
  updateUser,
  
  // Therapist operations
  createTherapist,
  getTherapistById,
  updateTherapist,
  getTherapistByCode,
  
  // Letters operations
  createLetter,
  getLetterById,
  updateLetter,
  getUserLetters,
  
  // General operations
  addDocument,
  getCollection,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsByField,
  
  // Additional helpers
  serverTimestamp
}