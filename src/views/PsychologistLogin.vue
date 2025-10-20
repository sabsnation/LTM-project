<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-20 w-72 h-72 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute bottom-20 right-20 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>

    <div class="w-full max-w-md relative z-10 px-4 sm:px-0 font-serif">
      <router-link
        to="/"
        class="mb-8 flex items-center text-amber-100 hover:text-amber-300 transition-colors group"
      >
        <ArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform sm:w-6 sm:h-6 sm:mr-3" />
        <span class="text-base font-medium sm:text-lg">Voltar</span>
      </router-link>

      <div class="bg-amber-900/90 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-2xl p-6 sm:p-10 border border-amber-700">
        <div class="text-center mb-8 sm:mb-10">
          <div class="bg-gradient-to-br from-amber-600 to-amber-800 w-20 h-20 sm:w-24 sm:h-24 rounded-sm flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg border border-amber-500">
            <Brain class="w-10 h-10 sm:w-12 sm:h-12 text-amber-100" />
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold text-amber-100 mb-2 sm:mb-3">
            Câmara do Sábio
          </h2>
          <p class="text-amber-200 text-base sm:text-lg">Acesso exclusivo para curadores da mente</p>
        </div>

        <div class="space-y-5 sm:space-y-6">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">Selo de Registro (CRP)</label>
            <input
              v-model="crp"
              type="text"
              placeholder="XX/XXXXX"
              class="w-full px-4 py-3 sm:py-4 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-amber-900 text-sm sm:text-base bg-amber-100/90 font-serif"
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">Símbolo Profissional</label>
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
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">Senha Secreta</label>
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

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-2 sm:gap-0">
            <label class="flex items-center cursor-pointer group">
              <input v-model="remember" type="checkbox" class="rounded text-amber-600 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 border-amber-500" />
              <span class="text-amber-200 text-sm sm:text-base group-hover:text-amber-100">Manter selo ativo</span>
            </label>
            <button class="text-amber-300 hover:text-amber-100 font-semibold text-sm sm:text-base underline">Recuperar acesso</button>
          </div>

          <button
            @click="handleLogin"
            class="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 py-3 sm:py-4 rounded-sm font-bold text-base sm:text-lg hover:from-amber-600 hover:to-amber-800 transition-all shadow-lg hover:shadow-amber-500/50 transform hover:-translate-y-0.5 border border-amber-600"
          >
            Selo de Acesso ao Sábio
          </button>
        </div>

        <div class="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-amber-700">
          <p class="text-amber-200 text-center text-sm sm:text-base">
            Ainda não é credenciado?{' '}
            <router-link to="/solicitar-cadastro" class="text-amber-300 hover:text-amber-100 font-bold underline">Solicitar selo profissional</router-link>
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