<template>
  <div class="relative w-full h-screen overflow-hidden text-white fundo-personalizado-psi flex items-center justify-center">
    <!-- Container central -->
    <div class="w-full max-w-md px-4 sm:px-0 relative z-10 font-serif">
      
      <!-- Botão Voltar -->
      <router-link
        to="/"
        class="mb-6 flex items-center text-amber-100 hover:text-amber-300 transition-colors group"
      >
        <ArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform sm:w-6 sm:h-6 sm:mr-3" />
        <span class="text-base font-medium sm:text-lg">Voltar</span>
      </router-link>

      <!-- Card de Solicitação com rolagem interna -->
      <div class="bg-amber-900/90 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-2xl p-6 sm:p-10 border border-amber-700 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-700/60 scrollbar-track-transparent max-h-[80vh]">
        
        <div class="text-center mb-8 sm:mb-10">
          <!-- Imagem com aura dourada -->
          <div class="aura w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6 shadow-lg border border-amber-500 rounded-sm overflow-hidden relative">
            <img 
              src="@/assets/sábio.jpeg" 
              alt="Sábio" 
              class="w-full h-full object-cover"
            />
          </div>

          <h2 class="text-2xl sm:text-4xl font-bold text-amber-100 mb-2 sm:mb-3">
            Solicitar Credenciamento
          </h2>
          <p class="text-amber-200 text-base sm:text-lg">
            Preencha os dados para solicitar seu selo profissional
          </p>
        </div>

        <!-- Formulário -->
        <div class="space-y-5 sm:space-y-6">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">
              Nome Completo
            </label>
            <input
              v-model="nome"
              type="text"
              placeholder="Seu nome completo"
              class="w-full px-4 py-3 sm:py-4 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-amber-900 text-sm sm:text-base bg-amber-100/90 font-serif"
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">
              Selo de Registro (CRP)
            </label>
            <input
              v-model="crp"
              type="text"
              placeholder="XX/XXXXX"
              class="w-full px-4 py-3 sm:py-4 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-amber-900 text-sm sm:text-base bg-amber-100/90 font-serif"
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">
              Símbolo Profissional
            </label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-amber-300 transition-colors" />
              <input
                v-model="email"
                type="email"
                placeholder="curador@selo.com"
                class="w-full pl-11 pr-4 py-3 sm:py-4 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-amber-900 text-sm sm:text-base bg-amber-100/90 font-serif"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">
              Senha Secreta
            </label>
            <div class="relative group">
              <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-amber-300 transition-colors" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full pl-11 pr-4 py-3 sm:py-4 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-amber-900 text-sm sm:text-base bg-amber-100/90 font-serif"
              />
            </div>
          </div>

          <div v-if="error" class="error-message text-red-500 text-sm">
            {{ error }}
          </div>

          <button
            @click="handleSubmit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 py-3 sm:py-4 rounded-sm font-bold text-base sm:text-lg hover:from-amber-600 hover:to-amber-800 transition-all shadow-lg hover:shadow-amber-500/50 transform hover:-translate-y-0.5 border border-amber-600 disabled:opacity-50"
          >
            <span v-if="!loading">Solicitar Credenciamento</span>
            <span v-else>Processando...</span>
          </button>
        </div>

        <div class="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-amber-700">
          <p class="text-amber-200 text-center text-sm sm:text-base">
            Já é credenciado?
            <router-link to="/login-psicologo" class="text-amber-300 hover:text-amber-100 font-bold underline">
              Acesse seu pergaminho sábio
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Mail, Lock } from 'lucide-vue-next';
import { registerUser, loginUser } from '@/firebase/authService';
import { createTherapist } from '@/firebase/firestoreService';

const nome = ref('');
const crp = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const handleSubmit = async () => {
  if (!nome.value || !crp.value || !email.value || !password.value) {
    error.value = 'Por favor, preencha todos os campos.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Registrar usuário no Firebase Auth
    const user = await registerUser(email.value, password.value);
    console.log('Usuário psicólogo registrado com sucesso:', user);

    // Criar perfil de terapeuta no Firestore
    await createTherapist({
      id: user.uid,
      email: user.email,
      name: nome.value,
      crp: crp.value,
      status_verification: 'pending', // Status pendente para aprovação
      code_vinculo: generateCodeVinculo(), // Gerar código único para vinculação
      createdAt: new Date()
    });

    // Fazer login com as credenciais recém-criadas
    await loginUser(email.value, password.value);
    console.log('Psicólogo logado automaticamente após cadastro');
    
    // O router guard irá redirecionar automaticamente para o dashboard correto
    router.push('/psychologist/dashboard');
  } catch (err) {
    console.error('Erro na solicitação de credenciamento:', err);
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'Este e-mail já está em uso.';
    } else {
      error.value = 'Erro ao solicitar credenciamento. Por favor, tente novamente.';
    }
  } finally {
    loading.value = false;
  }
};

// Gerar código único para vinculação
const generateCodeVinculo = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};
</script>

<style scoped>
.fundo-personalizado-psi {
  background-image: url('@/assets/back medieval.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* 🌟 Efeito de aura dourada pulsante */
.aura::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 0.25rem;
  box-shadow: 0 0 15px 5px rgba(255, 191, 0, 0.4);
  animation: pulseAura 3s ease-in-out infinite;
  z-index: 0;
}

@keyframes pulseAura {
  0%, 100% {
    box-shadow: 0 0 10px 3px rgba(255, 191, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px 8px rgba(255, 215, 0, 0.6);
  }
}
</style>