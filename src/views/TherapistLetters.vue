<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-amber-900">Caixa de Entrada do Sábio</h1>
        <router-link 
          to="/psychologist/dashboard" 
          class="bg-amber-700 text-amber-100 px-4 py-2 rounded-sm hover:bg-amber-600 transition-colors border border-amber-500"
        >
          Voltar ao Painel
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-amber-800 text-lg">Carregando escrituras recebidas...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 text-lg">{{ error }}</p>
      </div>

      <div v-else-if="letters.length === 0" class="text-center py-12">
        <p class="text-amber-700 text-lg">Nenhuma escritura foi compartilhada com você ainda.</p>
      </div>

      <div v-else class="space-y-4">
        <router-link
          v-for="letter in letters"
          :key="letter.id"
          :to="`/patient/letters/${letter.id}`" 
          class="block bg-amber-50 rounded-lg shadow p-6 border border-amber-300 hover:shadow-md hover:border-amber-400 transition-all"
          :class="{ 'font-bold bg-amber-100': !letter.isReadByTherapist }"
        >
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold text-amber-900">{{ letter.title }}</h2>
              <p class="text-sm text-amber-700">De: {{ letter.authorName || 'Carregando...' }}</p>
            </div>
            <div class="text-right">
              <span 
                v-if="!letter.isReadByTherapist" 
                class="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full"
              >
                Nova
              </span>
              <p class="text-sm text-amber-600 mt-1">{{ formatDate(letter.createdAt) }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUser } from '@/firebase/authService';
import { getSharedLetters, getUserById } from '@/firebase/firestoreService';

const letters = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (date) => {
  if (!date) return 'N/A';
  if (date && date.toDate) {
    return date.toDate().toLocaleDateString('pt-BR');
  }
  return new Date(date).toLocaleDateString('pt-BR');
};

onMounted(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }
    
    const sharedLetters = await getSharedLetters(user.uid);
    
    // Para evitar múltiplas buscas para o mesmo autor, crio um mapa de autores
    const authorCache = new Map();
    
    const lettersWithAuthors = await Promise.all(
      sharedLetters.map(async (letter) => {
        let authorName = authorCache.get(letter.author_id);
        if (!authorName) {
          const authorProfile = await getUserById(letter.author_id);
          authorName = authorProfile ? authorProfile.name : 'Paciente Desconhecido';
          authorCache.set(letter.author_id, authorName);
        }
        return { ...letter, authorName };
      })
    );
    
    letters.value = lettersWithAuthors;

  } catch (err) {
    console.error("Erro ao buscar cartas compartilhadas:", err);
    error.value = "Não foi possível carregar as cartas.";
  } finally {
    loading.value = false;
  }
});
</script>
