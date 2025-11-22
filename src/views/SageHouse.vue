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
      class="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 max-w-md w-full"
    >
      <div v-if="hasPsychologist" class="mb-6">
        <h3 class="text-2xl font-bold text-amber-800 mb-2">Sábio Associado</h3>
        <div class="bg-amber-100/70 border border-amber-300 rounded-lg p-4">
          <p class="text-lg font-semibold text-amber-900">{{ therapistInfo.name }}</p>
          <p class="text-amber-800">CRP: {{ therapistInfo.crp }}</p>
          <p v-if="therapistInfo.specialties && therapistInfo.specialties.length" class="text-amber-800 mt-1">
            Especialidades: {{ therapistInfo.specialties.join(', ') }}
          </p>
        </div>
      </div>
      
      <p class="text-amber-700 mb-6">
        Bem-vindo à Casa do Sábio! Aqui você encontrará recursos e conteúdos relacionados ao seu processo terapêutico.
      </p>
      
      <!-- Futuramente, esta seção conterá recursos e conteúdos relacionados ao psicólogo -->
      <div class="bg-amber-100/50 border border-amber-300 rounded-lg p-4">
        <h2 class="text-xl font-semibold text-amber-800 mb-3">Recursos do Sábio</h2>
        <p class="text-amber-700">
          Este espaço está personalizado com base em seu vínculo terapêutico. 
          Aqui você encontrará materiais, exercícios e recursos específicos 
          fornecidos pelo seu psicólogo.
        </p>
      </div>
    </main>
    
    <!-- Botão para vincular-se a um sábio, visível independentemente do estado de vínculo -->
    <div 
      class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
    >
      <button
        @click="showLinkModal = true"
        class="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 rounded-sm font-bold hover:from-amber-500 hover:to-amber-700 transition-all border border-amber-500"
      >
        {{ hasPsychologist ? 'Alterar Sábio Associado' : 'Vincular-se a um Sábio' }}
      </button>
    </div>
    
    <!-- Modal para vincular ao sábio -->
    <div v-if="showLinkModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <LinkToTherapistModal @close="showLinkModal = false" />
    </div>

    <!-- Camada de brilho suave -->
    <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-gradient-move"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import { getCurrentUserProfile, getTherapistById } from '@/firebase/userProfileService';
import LinkToTherapistModal from '@/components/LinkToTherapistModal.vue';

// Verifica se o usuário tem vinculação com um psicólogo
const hasPsychologist = ref(false);
const showLinkModal = ref(false);
const therapistInfo = ref({});

// Observar mudanças na variável hasPsychologist para depuração
watch(hasPsychologist, (newValue, oldValue) => {
  console.log('hasPsychologist mudou de', oldValue, 'para', newValue);
});

onMounted(async () => {
  try {
    console.log('Carregando perfil do usuário na Casa do Sábio...');
    const profile = await getCurrentUserProfile();
    console.log('Perfil do usuário:', profile);
    
    if (profile && profile.therapist_linked_id) {
      console.log('Usuário tem vínculo com terapeuta ID:', profile.therapist_linked_id);
      hasPsychologist.value = true;
      console.log('Valor de hasPsychologist após definir como true:', hasPsychologist.value);
      
      // Carregar informações do psicólogo vinculado
      const therapist = await getTherapistById(profile.therapist_linked_id);
      console.log('Dados do terapeuta:', therapist);
      
      if (therapist) {
        therapistInfo.value = {
          name: therapist.name || 'Sábio não identificado',
          crp: therapist.crp || 'CRP não informado',
          specialties: therapist.specialties || []
        };
        console.log('Informações do terapeuta definidas:', therapistInfo.value);
        console.log('Estado final - hasPsychologist:', hasPsychologist.value, 'therapistInfo:', therapistInfo.value);
      } else {
        console.log('Terapeuta não encontrado no banco de dados');
        therapistInfo.value = {
          name: 'Sábio não encontrado',
          crp: 'CRP não disponível',
          specialties: []
        };
      }
    } else {
      console.log('Nenhum vínculo com terapeuta encontrado no perfil do usuário');
      hasPsychologist.value = false;
      console.log('Valor de hasPsychologist após definir como false:', hasPsychologist.value);
      console.log('Estado final - hasPsychologist:', hasPsychologist.value, 'therapistInfo:', therapistInfo.value);
    }
  } catch (error) {
    console.error('Erro ao verificar associação com psicólogo:', error);
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