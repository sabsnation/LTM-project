<template>
  <div class="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute bottom-20 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </div>

    <div class="w-full max-w-md relative z-10 px-4 sm:px-0">
      <router-link
        to="/"
        class="mb-8 flex items-center text-white hover:text-cyan-200 transition-colors group"
      >
        <ArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform sm:w-6 sm:h-6 sm:mr-3" />
        <span class="text-base font-medium sm:text-lg">Voltar</span>
      </router-link>

      <div class="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/50">
        <div class="text-center mb-8 sm:mb-10">
          <div class="bg-gradient-to-br from-cyan-400 to-blue-600 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg">
            <Heart class="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Bem-vindo!
          </h2>
          <p class="text-gray-600 text-base sm:text-lg">Entre no seu refúgio de escritas.</p>
        </div>

        <div class="space-y-5 sm:space-y-6">
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">E-mail</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-cyan-600 transition-colors" />
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="w-full pl-11 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-gray-800 text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Senha</label>
            <div class="relative group">
              <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-cyan-600 transition-colors" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full pl-11 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-gray-800 text-sm sm:text-base"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-2 sm:gap-0">
            <label class="flex items-center cursor-pointer group">
              <input v-model="remember" type="checkbox" class="rounded text-cyan-600 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
              <span class="text-gray-600 text-sm sm:text-base group-hover:text-gray-800">Lembrar-me</span>
            </label>
            <button class="text-cyan-600 hover:text-cyan-700 font-semibold text-sm sm:text-base">Esqueceu a senha?</button>
          </div>

          <button
            @click="handleLogin"
            class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5"
          >
            Entrar na minha área
          </button>
        </div>

        <div class="mt-6 sm:mt-8 text-center">
          <p class="text-gray-600 text-sm sm:text-base">
            Primeira vez aqui?{' '}
            <router-link to="/registro-paciente" class="text-cyan-600 hover:text-cyan-700 font-bold">Criar conta gratuita</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // MUDANÇA 3: Importar o useRouter
import { ArrowLeft, Heart, Mail, Lock } from 'lucide-vue-next';

const email = ref('');
const password = ref('');
const remember = ref(false);

const router = useRouter(); // MUDANÇA 4: Inicializar o router

// MUDANÇA 5: Não precisamos mais de defineEmits ou da constante 'emit'

const handleLogin = () => {
  console.log('Tentando logar com:', {
    email: email.value,
    password: password.value,
  });
  
  router.push('/patient/dashboard');
};

const goBack = () => {
  router.push('/');
};

// Garantir que o cursor normal esteja ativo nesta tela
onMounted(() => {
  document.body.classList.remove('selection-screen-body');
});
</script>