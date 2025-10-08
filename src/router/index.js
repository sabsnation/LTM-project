import { createRouter, createWebHistory } from 'vue-router'
import PatientLogin from '@/views/PatientLogin.vue'
import SelectionScreen from '@/views/SelectionScreen.vue'
import PsychologistLogin from '@/views/PsychologistLogin.vue'
import PatientDashboard from '@/views/PatientDashboard.vue'
import PsychologistDashboard from '@/views/PsychologistDashboard.vue'

// 1. Defina suas rotas
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
    path: '/psychologist/dashboard',
    name: 'psychologist-dashboard',
    component: PsychologistDashboard,
    meta: { requiresAuth: true }
  }
]

// 2. Crie a instância do roteador
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router