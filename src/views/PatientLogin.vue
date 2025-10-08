<template>
  <div class="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute bottom-20 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </div>

    <div class="max-w-md w-full relative z-10">
      <router-link
        to="/"
        class="mb-8 flex items-center text-white hover:text-cyan-200 transition-colors group"
      >
        <ArrowLeft class="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span class="text-lg font-medium">Voltar</span>
      </router-link>

      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
        <div class="text-center mb-10">
          <div class="bg-gradient-to-br from-cyan-400 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart class="w-12 h-12 text-white animate-pulse" />
          </div>
          <h2 class="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Bem-vindo!
          </h2>
          <p class="text-gray-600 text-lg">Entre no seu refúgio de escritas.</p>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">E-mail</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-600 transition-colors" />
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-gray-800"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Senha</label>
            <div class="relative group">
              <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-600 transition-colors" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-gray-800"
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <label class="flex items-center cursor-pointer group">
              <input v-model="remember" type="checkbox" class="rounded text-cyan-600 mr-3 w-5 h-5" />
              <span class="text-gray-600 group-hover:text-gray-800">Lembrar-me</span>
            </label>
            <button class="text-cyan-600 hover:text-cyan-700 font-semibold">Esqueceu a senha?</button>
          </div>

          <button
            @click="handleLogin"
            class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5"
          >
            Entrar na minha área
          </button>
        </div>

        <div class="mt-8 text-center">
          <p class="text-gray-600">
            Primeira vez aqui?{' '}
            <router-link to="/registro-paciente" class="text-cyan-600 hover:text-cyan-700 font-bold">Criar conta gratuita</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
</script>