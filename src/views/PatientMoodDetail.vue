<template>
  <div class="relative w-full min-h-screen font-serif bg-gradient-to-r from-blue-900 to-amber-700">
    <!-- Lua -->
    <div class="absolute top-8 left-8">
      <div class="relative">
        <img src="@/assets/lua.png" alt="Lua" class="w-24 h-24 opacity-80" />
        <div class="absolute inset-0 bg-blue-300 rounded-full filter blur-3xl opacity-50 animate-pulse-blue"></div>
      </div>
    </div>
    
    <!-- Sol -->
    <div class="absolute top-8 right-8">
      <div class="relative">
        <img src="@/assets/sol.png" alt="Sol" class="w-24 h-24 opacity-80" />
        <div class="absolute inset-0 bg-yellow-300 rounded-full filter blur-3xl opacity-30 animate-pulse-yellow"></div>
      </div>
    </div>
    
    <!-- Conteúdo Central -->
    <div class="relative z-10 flex items-center justify-center min-h-screen p-4">
      <div v-if="patient" class="max-w-4xl w-full bg-amber-50 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl p-6 border-2 border-amber-300">
        <h1 class="text-4xl font-bold text-amber-900 mb-6 text-center">{{ patient.name }}</h1>
        
        <div class="mb-6">
          <h2 class="text-3xl font-semibold text-amber-800 mb-4 border-b-2 border-amber-300 pb-2">Histórico de Humor</h2>
          
          <div v-if="patient.moodHistory && patient.moodHistory.length > 0" class="space-y-4 max-h-96 overflow-y-auto pr-2">
            <div 
              v-for="moodEntry in patient.moodHistory" 
              :key="moodEntry.date.seconds" 
              class="p-4 bg-amber-100 rounded-lg shadow border border-amber-200"
            >
              <p class="text-lg font-medium text-amber-900"><strong>Humor:</strong> {{ moodEntry.mood }}</p>
              <p class="text-sm text-amber-700"><strong>Data:</strong> {{ formatDate(moodEntry.date) }}</p>
              <p v-if="moodEntry.comment" class="mt-2 text-amber-800 italic">"{{ moodEntry.comment }}"</p>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <p class="text-amber-700 italic">Nenhum histórico de humor encontrado para este paciente.</p>
          </div>
        </div>
        
        <div class="text-center">
          <button @click="goBack" class="px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors shadow-lg">
            Voltar ao Painel
          </button>
        </div>
      </div>

      <div v-else class="text-center text-white text-xl">
        <p>Carregando dados do paciente...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPatientProfileById } from '@/firebase/userProfileService';

const route = useRoute();
const router = useRouter();
const patient = ref(null);

onMounted(async () => {
  const patientId = route.params.id;
  if (patientId) {
    try {
      const patientData = await getPatientProfileById(patientId);
      patient.value = patientData;
    } catch (error) {
      console.error('Erro ao buscar perfil do paciente:', error);
    }
  }
});

const formatDate = (timestamp) => {
  if (!timestamp) return 'Data não disponível';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const goBack = () => {
  router.push({ name: 'psychologist-dashboard' });
};
</script>

<style scoped>
@keyframes pulse-blue {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes pulse-yellow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.animate-pulse-blue {
  animation: pulse-blue 4s ease-in-out infinite;
}

.animate-pulse-yellow {
  animation: pulse-yellow 4s ease-in-out infinite;
}
</style>
