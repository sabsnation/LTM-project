<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute bottom-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </div>

    <div class="max-w-md w-full relative z-10">
      <router-link
        to="/"
        class="mb-8 flex items-center text-white hover:text-pink-200 transition-colors group"
      >
        <ArrowLeft class="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span class="text-lg font-medium">Voltar</span>
      </router-link>

      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
        <div class="text-center mb-10">
          <div class="bg-gradient-to-br from-pink-400 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Brain class="w-12 h-12 text-white" />
          </div>
          <h2 class="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Área Profissional
          </h2>
          <p class="text-gray-600 text-lg">Acesso exclusivo para psicólogos</p>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">CRP (Registro Profissional)</label>
            <input
              v-model="crp"
              type="text"
              placeholder="XX/XXXXX"
              class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none text-gray-800"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">E-mail Profissional</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-pink-600 transition-colors" />
              <input
                v-model="email"
                type="email"
                placeholder="profissional@email.com"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none text-gray-800"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Senha</label>
            <div class="relative group">
              <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-pink-600 transition-colors" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none text-gray-800"
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <label class="flex items-center cursor-pointer group">
              <input v-model="remember" type="checkbox" class="rounded text-pink-600 mr-3 w-5 h-5" />
              <span class="text-gray-600 group-hover:text-gray-800">Manter conectado</span>
            </label>
            <button class="text-pink-600 hover:text-pink-700 font-semibold">Recuperar acesso</button>
          </div>

          <button
            @click="handleLogin"
            class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/50 transform hover:-translate-y-0.5"
          >
            Acessar painel profissional
          </button>
        </div>

        <div class="mt-8 pt-8 border-t-2 border-gray-200">
          <p class="text-gray-600 text-center">
            Ainda não é credenciado?{' '}
            <router-link to="/solicitar-cadastro" class="text-pink-600 hover:text-pink-700 font-bold">Solicitar cadastro profissional</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
</script>