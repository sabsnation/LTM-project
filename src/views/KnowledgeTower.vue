<template>
  <div class="relative w-full h-screen overflow-hidden text-white fundo-personalizado">
    <!-- Botão de voltar para o dashboard -->
    <router-link
      to="/patient/dashboard"
      class="absolute top-6 left-6 p-2 bg-amber-700/50 hover:bg-amber-700 text-white rounded-full transition-colors border border-amber-500 z-20"
      title="Voltar ao Dashboard"
    >
      <ArrowLeft class="w-5 h-5" />
    </router-link>
    
    <!-- Nome da seção -->
    <header class="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
      <h2 class="text-3xl font-bold drop-shadow-lg">Torre do Conhecimento</h2>
    </header>

    <!-- Conteúdo principal com a imagem em grande escala e chat na lateral direita -->
    <main class="relative w-full h-full z-10 flex items-center justify-center">
      <div class="flex items-center justify-center w-full px-4">
        <!-- Imagem da torre -->
        <div class="text-center">
          <img
            src="@/assets/torre_do_conhecimento-removebg-preview.png"
            alt="Torre do Conhecimento"
            class="w-4/5 max-w-3xl mx-auto drop-shadow-lg object-contain"
          />
          <p class="mt-8 text-xl text-amber-100 drop-shadow-md max-w-2xl mx-auto">
            Local seguro para moradores da vila.
          </p>
          
          <!-- Botão para abrir o chat -->
          <button
            v-if="!showChat"
            @click="showChat = true"
            class="mt-4 bg-amber-700/80 hover:bg-amber-700 text-white px-4 py-2 rounded-full transition-colors border border-amber-500 z-30 flex items-center gap-2"
          >
            <MessageCircle class="w-5 h-5" />
            Entrar no Salão de Conversas
          </button>
        </div>
        
        <!-- Componente de chat na lateral direita -->
        <div class="ml-8" v-if="showChat">
          <ChatBox @close="showChat = false" />
        </div>
      </div>
    </main>

    <!-- Camada de brilho suave -->
    <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-gradient-move"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ArrowLeft, MessageCircle } from 'lucide-vue-next';
import ChatBox from '@/components/ChatBox.vue';

const showChat = ref(false);
</script>

<style scoped>
/* ✨ Gradiente suave no fundo */
@keyframes gradient-move {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.animate-gradient-move {
  animation: gradient-move 6s ease-in-out infinite;
}

/* Fundo personalizado */
.fundo-personalizado {
  background-image: url('@/assets/fundo do usuario.jpg');
  background-size: cover;
  background-position: center;
}
</style>