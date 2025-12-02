<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div v-if="patient" class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ patient.name }}</h1>
      
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Histórico de Humor</h2>
        <div v-if="patient.moodHistory && patient.moodHistory.length > 0" class="space-y-4">
          <div v-for="(moodEntry, index) in patient.moodHistory" :key="index" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-lg font-medium text-gray-800"><strong>Humor:</strong> {{ moodEntry.mood }}</p>
            <p class="text-sm text-gray-500"><strong>Data:</strong> {{ formatDate(moodEntry.date) }}</p>
            <p v-if="moodEntry.comment" class="mt-2 text-gray-600"><strong>Comentário:</strong> {{ moodEntry.comment }}</p>
          </div>
        </div>
        <div v-else>
          <p class="text-gray-500">Nenhum histórico de humor encontrado para este paciente.</p>
        </div>
      </div>
      
      <button @click="goBack" class="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
        Voltar ao Painel
      </button>
    </div>
    <div v-else class="text-center">
      <p class="text-gray-500">Carregando dados do paciente...</p>
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
/* Estilos adicionais se necessário */
</style>
