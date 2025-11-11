<!-- src/components/RegisterModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="$emit('close')">
    <div class="bg-amber-100 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-amber-700" @click.stop>
      <div class="bg-gradient-to-r from-amber-700 to-amber-900 p-4 text-amber-100">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold font-serif">Criar Novo Selo</h2>
          <button @click="$emit('close')" class="hover:bg-amber-600 p-1 rounded-full transition-all">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <div v-if="error" class="error-message text-red-500 text-sm mb-4 p-2 bg-red-100 rounded">
          {{ error }}
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-amber-900 font-semibold mb-2 font-serif">Nome Completo</label>
            <input 
              v-model="name" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
              placeholder="Seu nome"
            />
          </div>
          
          <div>
            <label class="block text-amber-900 font-semibold mb-2 font-serif">Idade</label>
            <input 
              v-model="age" 
              type="number" 
              required
              min="1" 
              max="120"
              class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
              placeholder="Sua idade"
            />
          </div>
          
          <div>
            <label class="block text-amber-900 font-semibold mb-2 font-serif">Símbolo de Correio</label>
            <input 
              v-model="email" 
              type="email" 
              required
              class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
              placeholder="seu@selo.com"
            />
          </div>
          
          <div>
            <label class="block text-amber-900 font-semibold mb-2 font-serif">Senha Secreta</label>
            <input 
              v-model="password" 
              type="password" 
              required
              class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label class="block text-amber-900 font-semibold mb-2 font-serif">Confirmar Senha Secreta</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              required
              class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
              placeholder="••••••••"
            />
          </div>
          
          <button
            @click="handleRegister"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 py-2.5 rounded font-bold hover:from-amber-800 hover:to-amber-950 transition-all shadow border border-amber-800 disabled:opacity-50 font-serif"
          >
            <span v-if="!loading">Criar Selo</span>
            <span v-else>Processando...</span>
          </button>
          
          <div class="mt-4">
            <button
              @click="handleGoogleRegister"
              :disabled="loading"
              class="w-full bg-red-500 text-white py-2.5 rounded font-bold hover:bg-red-600 transition-all shadow border border-red-600 disabled:opacity-50 font-serif"
            >
              Continuar com Google
            </button>
          </div>
        </div>
        
        <div class="mt-4 text-center">
          <p class="text-amber-900 text-sm font-serif">
            Já tem um selo?
            <button 
              @click="switchToLogin"
              class="text-amber-800 hover:text-amber-950 font-bold underline"
            >
              Acesse seu selo
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { 
  registerUser, 
  loginWithGoogle 
} from '@/firebase/authService'
import { createUser } from '@/firebase/firestoreService'

const emit = defineEmits(['close'])

const name = ref('')
const age = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (!name.value || !age.value || !email.value || !password.value) {
    error.value = 'Por favor, preencha todos os campos.'
    return
  }

  // Validação mais rigorosa de email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email.value.trim())) {
    error.value = 'Por favor, insira um email válido (ex: usuario@dominio.com).'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem.'
    return
  }
  
  if (password.value.length < 6) {
    error.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }
  
  if (age.value < 1 || age.value > 120) {
    error.value = 'Por favor, informe uma idade válida (1-120).'
    return
  }
  
  // Debug: exibir o email antes de enviar para o Firebase
  console.log('Email sendo enviado para registro:', email.value.trim())
  console.log('Formato do email parece válido:', emailRegex.test(email.value.trim()))
  
  loading.value = true
  error.value = ''
  
  try {
    // Registrar usuário no Firebase Auth
    console.log('Tentando registrar usuário com email:', email.value.trim())
    const user = await registerUser(email.value.trim(), password.value)
    console.log('Usuário registrado com sucesso:', user.uid)
    
    // Criar perfil do usuário no Firestore
    let userData = {
      id: user.uid,
      email: user.email,
      name: name.value,
      age: parseInt(age.value),
      role: 'user', // Papel padrão para usuários comuns
      therapist_linked_id: null,
      bio: 'Usuário em jornada de autodescoberta e cura. Engajado no processo terapêutico e comprometido com o crescimento pessoal.',
      progress: 0,
      createdAt: new Date()
    }
    
    await createUser(userData)
    console.log('Perfil do usuário criado com sucesso no Firestore')
    
    // Emitir evento de sucesso e fechar modal
    emit('register-success')
  } catch (err) {
    console.error('Registration error completo:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
      email: email.value.trim()
    })
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'Este e-mail já está registrado.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Formato de email inválido. Por favor, verifique e tente novamente.'
    } else {
      error.value = 'Erro ao criar conta. Por favor, tente novamente. Detalhes: ' + err.message
    }
  } finally {
    loading.value = false
  }
}

const handleGoogleRegister = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const user = await loginWithGoogle()
    console.log('Usuário logado com Google com sucesso:', user)
    
    // Criar perfil do usuário no Firestore se não existir
    try {
      await createUser({
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'Usuário sem nome',
        age: null, // Idade não disponível no login Google
        role: 'user', // Papel padrão para usuários comuns
        therapist_linked_id: null,
        bio: 'Usuário em jornada de autodescoberta e cura. Engajado no processo terapêutico e comprometido com o crescimento pessoal.',
        progress: 0,
        createdAt: new Date()
      })
      console.log('Perfil do usuário criado com sucesso no Firestore após login Google')
    } catch (createErr) {
      // O perfil pode já existir, isso é aceitável
      console.log('Perfil do usuário pode já existir:', createErr.message)
    }
    
    // Emitir evento de sucesso e fechar modal
    emit('register-success')
  } catch (err) {
    console.error('Google registration error:', err)
    // Tratamento específico para o erro de popup bloqueado
    if (err.code === 'auth/popup-blocked') {
      error.value = 'O popup de login do Google foi bloqueado. Por favor, permita popups para este site e tente novamente.'
    } else {
      error.value = 'Erro ao registrar com Google. Por favor, tente novamente. Detalhes: ' + err.message
    }
  } finally {
    loading.value = false
  }
}

const switchToLogin = () => {
  emit('switch-to-login')
}
</script>

<style scoped>
.error-message {
  border-radius: 4px;
}
</style>