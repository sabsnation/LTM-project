<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute bottom-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </div>

    <div class="w-full max-w-md relative z-10 px-4 sm:px-0">
      <router-link
        to="/"
        class="mb-8 flex items-center text-white hover:text-pink-200 transition-colors group"
      >
        <ArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform sm:w-6 sm:h-6 sm:mr-3" />
        <span class="text-base font-medium sm:text-lg">Voltar</span>
      </router-link>

      <div class="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/50">
        <div class="text-center mb-8 sm:mb-10">
          <div class="bg-gradient-to-br from-pink-400 to-purple-600 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg">
            <Brain class="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Área Profissional
          </h2>
          <p class="text-gray-600 text-base sm:text-lg">Acesso exclusivo para psicólogos</p>
        </div>

        <div class="space-y-5 sm:space-y-6">
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">CRP (Registro Profissional)</label>
            <input
              v-model="crp"
              type="text"
              placeholder="XX/XXXXX"
              class="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none text-gray-800 text-sm sm:text-base"
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">E-mail Profissional</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-pink-600 transition-colors" />
              <input
                v-model="email"
                type="email"
                placeholder="profissional@email.com"
                class="w-full pl-11 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none text-gray-800 text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Senha</label>
            <div class="relative group">
              <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-pink-600 transition-colors" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full pl-11 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none text-gray-800 text-sm sm:text-base"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-2 sm:gap-0">
            <label class="flex items-center cursor-pointer group">
              <input v-model="remember" type="checkbox" class="rounded text-pink-600 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
              <span class="text-gray-600 text-sm sm:text-base group-hover:text-gray-800">Manter conectado</span>
            </label>
            <button class="text-pink-600 hover:text-pink-700 font-semibold text-sm sm:text-base">Recuperar acesso</button>
          </div>

          <button
            @click="handleLogin"
            class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/50 transform hover:-translate-y-0.5"
          >
            Acessar painel profissional
          </button>
        </div>

        <div class="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
          <p class="text-gray-600 text-center text-sm sm:text-base">
            Ainda não é credenciado?{' '}
            <router-link to="/solicitar-cadastro" class="text-pink-600 hover:text-pink-700 font-bold">Solicitar cadastro profissional</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // MUDANÇA 3: Importar o useRouter
import { ArrowLeft, Brain, Mail, Lock } from 'lucide-vue-next';

const crp = ref('');
const email = ref('');
const password = ref('');
const remember = ref(false);

const router = useRouter(); // MUDANÇA 4: Inicializar o router


const handleLogin = () => {
  console.log('Login do psicólogo:', {
    crp: crp.value,
    email: email.value,
  });
  
  router.push('/psychologist/dashboard');
};

const goBack = () => {
  router.push('/');
};

// Garantir que o cursor normal esteja ativo nesta tela
onMounted(() => {
  document.body.classList.remove('selection-screen-body');
});
</script>