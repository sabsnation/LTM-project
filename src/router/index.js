import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from '@/firebase/authService'
import PatientLogin from '@/views/PatientLogin.vue'
import SelectionScreen from '@/views/SelectionScreen.vue'
import PsychologistLogin from '@/views/PsychologistLogin.vue'
import PatientDashboard from '@/views/PatientDashboard.vue'
import PsychologistDashboard from '@/views/PsychologistDashboard.vue'
import PsychologistProfile from '@/views/PsychologistProfile.vue'
import PatientProfile from '@/views/PatientProfile.vue'
import PatientLetters from '@/views/PatientLetters.vue'
import ViewLetter from '@/views/ViewLetter.vue'
import KnowledgeTower from '@/views/KnowledgeTower.vue'
import SageHouse from '@/views/SageHouse.vue'
import PatientNotifications from '@/views/PatientNotifications.vue' // ⬅️ adicione esta linha
import VillageLibrary from '@/views/VillageLibrary.vue'
import FirebaseTest from '@/views/FirebaseTest.vue'

const routes = [
  {
    path: '/',
    name: 'selection',
    component: SelectionScreen
  },
  {
    path: '/',
    name: 'selection',
    component: SelectionScreen
  },
  {
    path: '/login-paciente',
    name: 'patient-login',
    component: PatientLogin
  },
  {
    path: '/login-psicologo',
    name: 'psychologist-login',
    component: PsychologistLogin
  },
  {
    path: '/patient/dashboard',
    name: 'patient-dashboard',
    component: PatientDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient/profile',
    name: 'patient-profile',
    component: PatientProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient/letters',
    name: 'patient-letters',
    component: PatientLetters,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient/letters/:id',
    name: 'view-letter',
    component: ViewLetter,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient/knowledge-tower',
    name: 'knowledge-tower',
    component: KnowledgeTower,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient/sage-house',
    name: 'sage-house',
    component: SageHouse,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient/village-library',
    name: 'village-library',
    component: VillageLibrary,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient/notifications', // ⬅️ NOVA ROTA
    name: 'patient-notifications',
    component: PatientNotifications,
    meta: { requiresAuth: true }
  },
  {
    path: '/psychologist/dashboard',
    name: 'psychologist-dashboard',
    component: PsychologistDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/psychologist/profile',
    name: 'psychologist-profile',
    component: PsychologistProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/firebase-test',
    name: 'firebase-test',
    component: FirebaseTest
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Authentication guard
router.beforeEach(async (to, from, next) => {
  console.log('Verificando autenticação para rota:', to.name)
  const currentUser = await getCurrentUser()
  console.log('Usuário atual:', currentUser)
  
  if (to.meta.requiresAuth && !currentUser) {
    // If route requires auth and user is not logged in, redirect to selection screen
    console.log('Rota requer autenticação mas usuário não está logado, redirecionando para /')
    next('/')
  } else if ((to.name === 'patient-login' || to.name === 'psychologist-login') && currentUser) {
    // If user is logged in and tries to access login screens, redirect to dashboard
    console.log('Usuário está logado, redirecionando para dashboard')
    if (currentUser.email) { // Could implement role-based redirection later
      next('/patient/dashboard') // Default to patient dashboard for now
    }
  } else {
    console.log('Permitindo acesso à rota')
    next()
  }
})

export default router
