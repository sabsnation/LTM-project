<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-amber-900 mb-6">Casa do Sábio</h1>
      
      <!-- Mensagem exibida quando o usuário não tem vinculação com nenhum psicólogo -->
      <div 
        v-if="!hasPsychologist" 
        class="bg-amber-200/70 border-2 border-amber-400 rounded-xl p-6 text-center max-w-2xl mx-auto shadow-lg"
      >
        <div class="text-4xl mb-4">🏠</div>
        <p class="text-xl font-bold text-amber-900 mb-2">Moradia bloqueada, nenhum sábio reside aqui.</p>
        <p class="text-amber-700">
          Para acessar os recursos da Casa do Sábio, você precisa estar vinculado a um psicólogo.
        </p>
      </div>
      
      <!-- Conteúdo exibido quando o usuário tem vinculação com um psicólogo -->
      <div v-else>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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