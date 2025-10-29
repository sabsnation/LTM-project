import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import { db } from '@/firebase/init'
import { getCurrentUser } from '@/firebase/authService'

// Get current user's profile
const getCurrentUserProfile = async () => {
  const user = await getCurrentUser()
  if (!user) return null
  
  try {
    const userDoc = doc(db, 'users', user.uid)
    const userSnapshot = await getDoc(userDoc)
    
    if (userSnapshot.exists()) {
      console.log('Perfil do usuário encontrado no Firestore:', userSnapshot.data())
      const userData = { id: userSnapshot.id, ...userSnapshot.data() }
      // Converter timestamp para data se necessário
      if (userData.createdAt && typeof userData.createdAt.toDate === 'function') {
        userData.createdAt = userData.createdAt.toDate()
      }
      
      // Atualizar o papel do usuário com base na ligação com terapeuta
      // Se o usuário já estiver ligado a um terapeuta mas não tem papel 'patient', atualizar
      if (userData.therapist_linked_id && userData.role !== 'patient') {
        // Atualizar o papel para 'patient'
        await updateDoc(userDoc, { role: 'patient' });
        userData.role = 'patient';
      } else if (!userData.therapist_linked_id && userData.role !== 'user') {
        // Se o usuário não está ligado a terapeuta mas tem papel diferente de 'user', atualizar
        await updateDoc(userDoc, { role: 'user' });
        userData.role = 'user';
      }
      
      return userData
    } else {
      // User doesn't exist in Firestore, create a basic profile
      console.log('Usuário não encontrado no Firestore, criando perfil...')
      const newProfile = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: 'user', // Default role is now 'user' until linked to a therapist
        therapist_linked_id: null,
        age: null, // Adicionando campo de idade
        bio: 'Usuário em jornada de autodescoberta e cura. Engajado no processo terapêutico e comprometido com o crescimento pessoal.',
        progress: 0, // Adicionando campo de progresso
        createdAt: new Date()
      }
      
      await setDoc(userDoc, newProfile)
      console.log('Perfil do usuário criado no Firestore:', newProfile)
      return newProfile
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

// Update current user's profile
const updateCurrentUserProfile = async (data) => {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')
  
  try {
    console.log('Atualizando perfil do usuário com dados:', data)
    const userDoc = doc(db, 'users', user.uid)
    await updateDoc(userDoc, data)
    console.log('Perfil do usuário atualizado com sucesso')
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// Get therapist profile by ID
const getTherapistById = async (therapistId) => {
  try {
    const therapistDoc = doc(db, 'therapists', therapistId)
    const therapistSnapshot = await getDoc(therapistDoc)
    
    if (therapistSnapshot.exists()) {
      return { id: therapistSnapshot.id, ...therapistSnapshot.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting therapist:', error)
    throw error
  }
}

// Get therapist by vinculo code
const getTherapistByCode = async (code) => {
  try {
    const q = query(collection(db, 'therapists'), where('code_vinculo', '==', code))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const therapistDoc = querySnapshot.docs[0]
      return { id: therapistDoc.id, ...therapistDoc.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting therapist by code:', error)
    throw error
  }
}

// Link user to therapist
const linkToTherapist = async (therapistId) => {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')
  
  try {
    const userDoc = doc(db, 'users', user.uid)
    await updateDoc(userDoc, { 
      therapist_linked_id: therapistId,
      role: 'patient'  // Update role to patient when linked to therapist
    })
  } catch (error) {
    console.error('Error linking to therapist:', error)
    throw error
  }
}

// Unlink from therapist
const unlinkFromTherapist = async () => {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')
  
  try {
    const userDoc = doc(db, 'users', user.uid)
    await updateDoc(userDoc, { 
      therapist_linked_id: null,
      role: 'user'  // Update role back to user when unlinked from therapist
    })
  } catch (error) {
    console.error('Error unlinking from therapist:', error)
    throw error
  }
}

export {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getTherapistById,
  getTherapistByCode,
  linkToTherapist,
  unlinkFromTherapist
}