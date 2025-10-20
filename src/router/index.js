import { createRouter, createWebHistory } from 'vue-router'
import PatientLogin from '@/views/PatientLogin.vue'
import SelectionScreen from '@/views/SelectionScreen.vue'
import PsychologistLogin from '@/views/PsychologistLogin.vue'
import PatientDashboard from '@/views/PatientDashboard.vue'
import PsychologistDashboard from '@/views/PsychologistDashboard.vue'
import PatientProfile from '@/views/PatientProfile.vue'
import PatientLetters from '@/views/PatientLetters.vue'
import KnowledgeTower from '@/views/KnowledgeTower.vue'
import SageHouse from '@/views/SageHouse.vue'
import PatientNotifications from '@/views/PatientNotifications.vue' // ⬅️ adicione esta linha

const routes = [
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
