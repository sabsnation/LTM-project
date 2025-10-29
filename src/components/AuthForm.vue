<!-- src/components/AuthForm.vue -->
<template>
  <div class="auth-container">
    <div v-if="loading" class="loading">
      <p>Processing...</p>
    </div>
    <form v-else @submit.prevent="submitForm" class="auth-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          :disabled="loading"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          :disabled="loading"
          class="form-control"
        />
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <button 
        type="submit" 
        :disabled="loading || !email || !password"
        class="btn btn-primary auth-btn"
      >
        {{ isLogin ? 'Login' : 'Register' }}
      </button>
      <button 
        type="button" 
        @click="loginWithGoogle"
        :disabled="loading"
        class="btn btn-outline-danger google-btn mt-2"
      >
        Continue with Google
      </button>
      <div class="auth-toggle mt-3">
        <p>
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <a href="#" @click.prevent="toggleMode">
            {{ isLogin ? 'Register' : 'Login' }}
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  loginUser, 
  registerUser, 
  loginWithGoogle as googleLogin 
} from '@/firebase/authService'
import { createUser } from '@/firebase/firestoreService'

const props = defineProps({
  isPatient: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const isLogin = ref(true)

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}

const submitForm = async () => {
  if (!email.value || !password.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    let user
    if (isLogin.value) {
      user = await loginUser(email.value, password.value)
    } else {
      user = await registerUser(email.value, password.value)
      // Create user profile in Firestore
      await createUser({
        id: user.uid,
        email: user.email,
        name: user.email.split('@')[0], // Use part of email as default name
        role: props.isPatient ? 'user' : 'therapist', // For patient users, default to 'user' until linked with therapist
        therapist_linked_id: null,
        createdAt: new Date()
      })
    }
    
    // Redirect based on user type
    if (props.isPatient) {
      router.push('/patient/dashboard')
    } else {
      router.push('/psychologist/dashboard')
    }
  } catch (err) {
    console.error('Auth error:', err)
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already registered.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else if (err.code === 'auth/wrong-password') {
      error.value = 'Incorrect password.'
    } else if (err.code === 'auth/user-not-found') {
      error.value = 'No account found with this email.'
    } else {
      error.value = 'An error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const loginWithGoogle = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const user = await googleLogin()
    
    // Check if user exists in Firestore, if not create profile
    // In a real app, you'd check this properly
    try {
      await createUser({
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: props.isPatient ? 'user' : 'therapist', // For patient users, default to 'user' until linked with therapist
        therapist_linked_id: null,
        createdAt: new Date()
      })
    } catch (e) {
      // User probably already exists, that's fine
      console.log('User profile may already exist:', e.message)
    }
    
    // Redirect based on user type
    if (props.isPatient) {
      router.push('/patient/dashboard')
    } else {
      router.push('/psychologist/dashboard')
    }
  } catch (err) {
    console.error('Google login error:', err)
    error.value = 'Google login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #d32f2f;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
}

.auth-btn, .google-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.auth-toggle {
  text-align: center;
  margin-top: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>