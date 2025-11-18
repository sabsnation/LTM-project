<template>
  <div class="relative w-full h-screen overflow-hidden text-white fundo-personalizado">
    <!-- Botão de sair -->
    <router-link
      to="/patient/dashboard"
      class="absolute top-6 left-6 p-2 bg-amber-700/50 hover:bg-amber-700 text-white rounded-full transition-colors border border-amber-500 z-30"
      title="Voltar ao Dashboard"
    >
      <ArrowLeft class="w-5 h-5" />
    </router-link>
    
    <!-- Nome da seção -->
    <header class="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-30">
      <h2 class="text-3xl font-bold drop-shadow-lg">Casa do Sábio</h2>
    </header>
    
    <!-- Imagem do mago na lateral esquerda -->
    <div class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
      <img 
        src="@/assets/mago.png" 
        alt="Mago"
        class="w-64 h-auto object-contain max-w-[40vw] max-h-[80vh]"
      />
    </div>

    <!-- Mensagem quando não há psicólogo -->
    <div 
      v-if="!hasPsychologist"
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
    >
      <p class="text-2xl font-bold text-amber-100 mb-3 drop-shadow-lg">nenhum sábio reside aqui.</p>
      <p class="text-lg text-amber-200 drop-shadow-md">Para acessar os recursos da Casa do Sábio, você precisa estar vinculado a um psicólogo.</p>
    </div>
    
    <!-- Conteúdo exibido quando o usuário tem vinculação com um psicólogo -->
    <main 
      v-else
      class="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 max-w-md w-full"
    >
      <p class="text-amber-700 mb-6">
        Bem-vindo à Casa do Sábio! Aqui você encontrará recursos e conteúdos relacionados ao seu processo terapêutico.
      </p>
      
      <!-- Futuramente, esta seção conterá recursos e conteúdos relacionados ao psicólogo -->
      <div class="bg-amber-100/50 border border-amber-300 rounded-lg p-4">
        <h2 class="text-xl font-semibold text-amber-800 mb-3">Em Desenvolvimento</h2>
        <p class="text-amber-700">
          Este espaço será personalizado com base em seu vínculo terapêutico. 
          Em breve, você encontrará aqui materiais, exercícios e recursos específicos 
          fornecidos pelo seu psicólogo.
        </p>
      </div>
    </main>

    <!-- Camada de brilho suave -->
    <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-gradient-move"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import { getCurrentUserProfile } from '@/firebase/userProfileService';

// Verifica se o usuário tem vinculação com um psicólogo
const hasPsychologist = ref(false);

onMounted(async () => {
  try {
    const profile = await getCurrentUserProfile();
    if (profile && profile.therapist_linked_id) {
      hasPsychologist.value = true;
    }
  } catch (error) {
    console.error('Error checking psychologist association:', error);
    hasPsychologist.value = false;
  }
});
</script>

<style scoped>
/* Fundo personalizado - mais escuro */
.fundo-personalizado {
  background-image: linear-gradient(135deg, #3c1e0d 0%, #5a3d29 50%, #7a5d39 100%);
  background-size: cover;
  background-position: center;
}

/* ✨ Gradiente suave no fundo */
@keyframes gradient-move {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}

.animate-gradient-move {
  animation: gradient-move 8s ease-in-out infinite;
}
</style>