import { ref } from 'vue'
import { 
  getCurrentUser, 
  onAuthStateChangedListener,
  logoutUser
} from '@/firebase/authService'

const user = ref(null)
const isAuthenticated = ref(false)

// Initialize auth state
onAuthStateChangedListener((currentUser) => {
  user.value = currentUser
  isAuthenticated.value = !!currentUser
})

// Get current user from Firebase
const fetchCurrentUser = async () => {
  const currentUser = await getCurrentUser()
  user.value = currentUser
  isAuthenticated.value = !!currentUser
  return currentUser
}

// Logout function
const logout = async () => {
  try {
    await logoutUser()
    user.value = null
    isAuthenticated.value = false
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

export default function useAuthStore() {
  return {
    user,
    isAuthenticated,
    fetchCurrentUser,
    logout
  }
}