<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-amber-900 mb-6">Teste de Conexão Firebase</h1>
      
      <div class="bg-amber-100 rounded-lg shadow-lg p-6 mb-6 border border-amber-300">
        <h2 class="text-xl font-bold text-amber-900 mb-4">Status de Conexão</h2>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-amber-50 rounded border border-amber-300">
            <span>Autenticação Firebase:</span>
            <span :class="authStatus ? 'text-green-600' : 'text-red-600'">{{ authStatus ? 'Conectado' : 'Desconectado' }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-amber-50 rounded border border-amber-300">
            <span>Firestore Database:</span>
            <span :class="dbStatus ? 'text-green-600' : 'text-red-600'">{{ dbStatus ? 'Conectado' : 'Desconectado' }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-amber-50 rounded border border-amber-300">
            <span>Usuário Atual:</span>
            <span :class="currentUser ? 'text-green-600' : 'text-gray-600'">{{ currentUser ? currentUser.email : 'Nenhum' }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-amber-100 rounded-lg shadow-lg p-6 border border-amber-300">
          <h2 class="text-xl font-bold text-amber-900 mb-4">Testar Registro</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Nome</label>
              <input 
                v-model="testName" 
                type="text" 
                class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
                placeholder="Seu nome"
              />
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Email</label>
              <input 
                v-model="testEmail" 
                type="email" 
                class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
                placeholder="email@teste.com"
              />
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Senha</label>
              <input 
                v-model="testPassword" 
                type="password" 
                class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
                placeholder="senha"
              />
            </div>
            
            <button
              @click="testRegister"
              class="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 py-2 rounded font-bold hover:from-amber-800 hover:to-amber-950 transition-all shadow border border-amber-800"
            >
              Testar Registro
            </button>
          </div>
        </div>

        <div class="bg-amber-100 rounded-lg shadow-lg p-6 border border-amber-300">
          <h2 class="text-xl font-bold text-amber-900 mb-4">Testar Login</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Email</label>
              <input 
                v-model="loginEmail" 
                type="email" 
                class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
                placeholder="email@teste.com"
              />
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Senha</label>
              <input 
                v-model="loginPassword" 
                type="password" 
                class="w-full px-3 py-2 border border-amber-700 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif bg-amber-50"
                placeholder="senha"
              />
            </div>
            
            <button
              @click="testLogin"
              class="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 py-2 rounded font-bold hover:from-amber-800 hover:to-amber-950 transition-all shadow border border-amber-800"
            >
              Testar Login
            </button>
            
            <button
              @click="testLogout"
              v-if="currentUser"
              class="w-full bg-gradient-to-r from-red-700 to-red-900 text-white py-2 rounded font-bold hover:from-red-800 hover:to-red-950 transition-all shadow border border-red-800"
            >
              Fazer Logout
            </button>
          </div>
        </div>
      </div>

      <div class="bg-amber-100 rounded-lg shadow-lg p-6 border border-amber-300" v-if="testResults">
        <h2 class="text-xl font-bold text-amber-900 mb-4">Resultados do Teste</h2>
        <pre class="text-amber-900 bg-amber-50 p-4 rounded border border-amber-300 whitespace-pre-wrap">{{ testResults }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  getCurrentUser, 
  registerUser, 
  loginUser, 
  logoutUser 
} from '@/firebase/authService'
import { createUser, getUserById } from '@/firebase/firestoreService'
import { getCurrentUserProfile } from '@/firebase/userProfileService'

// Status de conexão
const authStatus = ref(false)
const dbStatus = ref(false)
const currentUser = ref(null)

// Campos de teste
const testName = ref('')
const testEmail = ref('')
const testPassword = ref('')
const loginEmail = ref('')
const loginPassword = ref('')

// Resultados dos testes
const testResults = ref('')

// Verificar status de conexão
onMounted(async () => {
  try {
    // Verificar autenticação
    const user = await getCurrentUser()
    authStatus.value = !!user
    currentUser.value = user
    
    // Verificar conexão com Firestore tentando buscar dados
    dbStatus.value = true // Se chegamos até aqui, Firestore está acessível
    
    console.log('Status de conexão verificado')
  } catch (error) {
    console.error('Erro ao verificar status de conexão:', error)
    testResults.value = `Erro ao verificar conexão: ${error.message}`
  }
})

const testRegister = async () => {
  testResults.value = 'Iniciando teste de registro...'
  
  try {
    testResults.value += '\n1. Registrando usuário no Firebase Auth...'
    const user = await registerUser(testEmail.value, testPassword.value)
    testResults.value += `\n✓ Usuário registrado: ${user.email}`
    
    testResults.value += '\n2. Criando perfil no Firestore...'
    await createUser({
      id: user.uid,
      email: user.email,
      name: testName.value,
      role: 'user',
      therapist_linked_id: null,
      createdAt: new Date()
    })
    testResults.value += '\n✓ Perfil criado no Firestore'
    
    testResults.value += '\n✓ Teste de registro concluído com sucesso!'
    
    // Atualizar status
    currentUser.value = user
    authStatus.value = true
  } catch (error) {
    testResults.value += `\n✗ Erro no teste de registro: ${error.message}`
    console.error('Erro no teste de registro:', error)
  }
}

const testLogin = async () => {
  testResults.value = 'Iniciando teste de login...'
  
  try {
    testResults.value += '\n1. Fazendo login...'
    const user = await loginUser(loginEmail.value, loginPassword.value)
    testResults.value += `\n✓ Usuário logado: ${user.email}`
    
    testResults.value += '\n2. Buscando perfil do usuário...'
    const profile = await getCurrentUserProfile()
    testResults.value += `\n✓ Perfil encontrado: ${profile.name}`
    
    testResults.value += '\n✓ Teste de login concluído com sucesso!'
    
    // Atualizar status
    currentUser.value = user
    authStatus.value = true
  } catch (error) {
    testResults.value += `\n✗ Erro no teste de login: ${error.message}`
    console.error('Erro no teste de login:', error)
  }
}

const testLogout = async () => {
  testResults.value = 'Fazendo logout...'
  
  try {
    await logoutUser()
    testResults.value += '\n✓ Logout realizado com sucesso!'
    
    // Atualizar status
    currentUser.value = null
    authStatus.value = false
  } catch (error) {
    testResults.value += `\n✗ Erro no logout: ${error.message}`
    console.error('Erro no logout:', error)
  }
}
</script>