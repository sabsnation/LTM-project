<template>
  <div class="relative w-full h-screen overflow-hidden text-white fundo-psicologo">
    
    <!-- Botão de logout -->
    <button 
      @click="handleLogout"
      class="absolute top-6 left-6 p-2 bg-amber-700/50 hover:bg-amber-700 text-white rounded-full transition-colors border border-amber-500 z-20"
      title="Sair"
    >
      <LogOut class="w-5 h-5" />
    </button>
    
    <!-- Nome do psicólogo -->
    <header class="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
      <h2 class="text-3xl font-bold drop-shadow-lg">{{ userName }}</h2>
    </header>

    <!-- Vila do Psicólogo -->
    <main class="relative w-full h-full z-10">

      
      <!-- Livro dos Pacientes (Centro da tela) -->
<div class="absolute inset-0 flex flex-col items-center justify-center">
  <img
  :src="livroAberto ? livroAbertoImg : livroFechadoImg"
  alt="Livro dos Pacientes"
  class="w-[300px] md:w-[380px] lg:w-[450px] h-auto cursor-pointer transition-transform duration-500 hover:scale-105 drop-shadow-2xl"
  @click="toggleLivro"
/>
  <p class="mt-4 text-lg font-semibold text-amber-900 drop-shadow-md">
    Livro dos Pacientes
  </p>
</div>

      <!-- Label da casa -->
      <div class="absolute bottom-28 left-24 text-center" style="width: 192px;">
        <p class="text-sm font-bold text-amber-900 drop-shadow-md">Meu Perfil</p>
      </div>

      <!-- Templo do Sábio (Perfil) -->
      <router-link
        to="/psychologist/profile"
        class="absolute bottom-36 left-24 hover:scale-105 transition-transform duration-300"
      >
        <img
          src="@/assets/casa_do_sábio-removebg-preview.png" 
          alt="Templo do Sábio"
          class="w-60 h-auto drop-shadow-lg hover:brightness-110"
        />
      </router-link>
    </main>

    <!-- Efeito de brilho -->
    <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-gradient-move"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

// CORREÇÃO: Importar as imagens corretamente
import livroFechadoImg from '@/assets/livro-.png';
import livroAbertoImg from '@/assets/livraberto-.png';

const router = useRouter();
const userName = ref("Sábio Mentor");

const livroAberto = ref(false);

const toggleLivro = () => {
  livroAberto.value = !livroAberto.value;
};

const handleLogout = () => {
  router.push('/');
};
</script>

<style scoped>
@keyframes gradient-move {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.animate-gradient-move {
  animation: gradient-move 6s ease-in-out infinite;
}

/* Fundo exclusivo do psicólogo */
.fundo-psicologo {
  background-image: url('@/assets/fundo do usuario.jpg');
  background-size: cover;
  background-position: center;
}
</style>
