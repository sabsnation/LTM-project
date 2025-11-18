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

// Library writings collection
const libraryWritingsCollection = 'library_writings'

// User operations
const createUser = async (userData) => {
  try {
    console.log('Tentando criar usuário no Firestore:', userData.id)
    
    // Criar cópia dos dados para evitar problemas de imutabilidade
    let userDataCopy = { ...userData }
    
    let userRef = doc(db, usersCollection, userDataCopy.id)
    
    // Verificar se o usuário já existe
    let userSnapshot = await getDoc(userRef)
    if (userSnapshot.exists()) {
      console.log('Usuário já existe no Firestore:', userSnapshot.data())
      return userRef
    }
    
    // Criar objeto para salvar no Firestore
    let dataToSave = {
      ...userDataCopy,
      createdAt: serverTimestamp()
    }
    
    console.log('Salvando dados do usuário:', dataToSave)
    await setDoc(userRef, dataToSave)
    console.log('Usuário criado com sucesso no Firestore')
    return userRef
  } catch (error) {
    console.error('Erro ao criar usuário no Firestore:', error)
    console.error('Erro stack:', error.stack)
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
    
    // Validar que o author_id existe antes de prosseguir
    if (!letterData.author_id) {
      throw new Error('author_id é obrigatório para criar uma carta');
    }
    
    // Preparar os dados com valores padrão
    const processedData = {
      author_id: letterData.author_id,
      therapist_id: letterData.therapist_id !== undefined ? letterData.therapist_id : null,
      title: letterData.title || '',
      category: letterData.category || 'sem-categoria',
      mood: letterData.mood || '😊',
      openDate: letterData.openDate || null,
      content: letterData.content || '',
      hasMedia: Boolean(letterData.hasMedia),
      status: letterData.status || 'private'
    };
    
    console.log('Dados da carta após processamento e validação:', processedData);
    
    // Usar addDoc para gerar ID automaticamente
    const letterRef = await addDoc(collection(db, lettersCollection), {
      ...processedData,
      createdAt: serverTimestamp()
    })
    
    console.log('Carta criada com sucesso no Firestore com ID:', letterRef.id)
    return letterRef
  } catch (error) {
    console.error('Erro ao criar carta no Firestore:', error)
    console.error('Detalhes do erro:', {
      name: error.name,
      code: error.code,
      message: error.message
    })
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
    console.error('Erro ao atualizar carta:', error)
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
    console.error('Erro ao buscar cartas do usuário:', error)
    throw error
  }
}

// Library writings operations
const createLibraryWriting = async (writingData) => {
  try {
    const writingRef = await addDoc(collection(db, libraryWritingsCollection), {
      ...writingData,
      createdAt: serverTimestamp()
    })
    return writingRef
  } catch (error) {
    throw error
  }
}

const getAllLibraryWritings = async () => {
  try {
    const q = query(
      collection(db, libraryWritingsCollection),
      orderBy('createdAt', 'desc'),
      limit(50) // Limitar para evitar carregar muitos registros de uma vez
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    throw error
  }
}

const getUserLibraryWritings = async (userId) => {
  try {
    const q = query(
      collection(db, libraryWritingsCollection),
      where('author_id', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    const writings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Ordenar localmente por createdAt em ordem decrescente
    return writings.sort((a, b) => {
      // Verificar se os campos createdAt existem e são objetos do Firebase Timestamp
      const dateA = a.createdAt ? 
        (typeof a.createdAt.toDate === 'function' ? a.createdAt.toDate() : new Date(a.createdAt)) : 
        new Date(0);
      const dateB = b.createdAt ? 
        (typeof b.createdAt.toDate === 'function' ? b.createdAt.toDate() : new Date(b.createdAt)) : 
        new Date(0);
      
      return dateB - dateA; // Ordem decrescente (mais recente primeiro)
    });
  } catch (error) {
    console.error('Erro na consulta de escritas do usuário:', error)
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
    console.error(`Erro ao excluir documento da coleção ${collectionName}:`, error)
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
  
  // Library writings operations
  createLibraryWriting,
  getAllLibraryWritings,
  getUserLibraryWritings,
  
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