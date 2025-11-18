<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-amber-900">Visualizar Escritura</h1>
        <router-link 
          to="/patient/letters" 
          class="bg-amber-700 text-amber-100 px-4 py-2 rounded-sm hover:bg-amber-600 transition-colors border border-amber-500"
        >
          Voltar
        </router-link>
      </div>

      <!-- Loader enquanto carrega a carta -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-amber-800 text-lg">Carregando escritura...</p>
      </div>

      <!-- Mensagem de erro se não encontrar a carta -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 text-lg">{{ error }}</p>
      </div>

      <!-- Conteúdo da carta -->
      <div v-else class="bg-amber-50 rounded-lg shadow-lg p-8 border border-amber-300">
        <div class="flex items-start mb-6">
          <img 
            :src="getMoodImage(letter.mood)" 
            :alt="getMoodLabel(letter.mood)"
            class="w-16 h-16 object-cover mr-4"
          />
          <div>
            <h2 class="text-2xl font-bold text-amber-900">{{ letter.title }}</h2>
            <div class="flex items-center mt-2 text-sm text-amber-700">
              <img 
                :src="getCategoryIcon(letter.category)" 
                :alt="getCategoryLabel(letter.category)"
                class="w-6 h-6 object-cover mr-2"
              />
              <span>{{ getCategoryLabel(letter.category) }}</span>
              <span class="mx-2">•</span>
              <span>{{ formatDate(letter.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="prose max-w-none text-lg text-amber-800 leading-relaxed whitespace-pre-line bg-amber-100 p-6 rounded border border-amber-200">
          {{ letter.content }}
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <button
            @click="editLetter"
            class="px-4 py-2 bg-amber-600 text-white rounded-sm hover:bg-amber-700 transition-colors border border-amber-500"
          >
            Editar
          </button>
          <button
            @click="deleteLetter"
            class="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors border border-red-500"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentUser } from '@/firebase/authService';
import { getLetterById, deleteDocument } from '@/firebase/firestoreService';

// Importar as imagens necessárias
import sinoIcon from '@/assets/sino-removebg-preview.png';
import cartaIcon from '@/assets/criar_carta-removebg-preview.png';
import livroIcon from '@/assets/livro-.png';
import objetivoIcon from '@/assets/livraberto-.png';
import pergaminhoIcon from '@/assets/pergaminho.png';
import gatoFeliz from '@/assets/gato feliz.webp';
import gatoPensativo from '@/assets/gato pensativo.jpeg';
import gatoComLivro from '@/assets/gato com livro.jpg';
import gatoTriste from '@/assets/gato triste.jpg';
import gatoBesta from '@/assets/gato besta.avif';
import gatoCansado from '@/assets/gato cansado.webp';

const route = useRoute();
const router = useRouter();
const letter = ref(null);
const loading = ref(true);
const error = ref(null);

// Função para formatar data
const formatDate = (date) => {
  if (!date) return 'N/A';
  if (date instanceof Date) {
    return date.toLocaleDateString('pt-BR');
  }
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('pt-BR');
  }
  if (date && typeof date.toDate === 'function') {
    return date.toDate().toLocaleDateString('pt-BR');
  }
  return 'N/A';
};

// Função para obter o caminho da imagem do humor
const getMoodImage = (moodValue) => {
  const moods = [
    { image: gatoFeliz, label: 'Feliz', value: 'feliz' },
    { image: gatoPensativo, label: 'Calmo', value: 'calmo' },
    { image: gatoComLivro, label: 'Agradecido', value: 'agradecido' },
    { image: gatoTriste, label: 'Triste', value: 'triste' },
    { image: gatoBesta, label: 'Bravo', value: 'bravo' },
    { image: gatoCansado, label: 'Cansado', value: 'cansado' }
  ];
  const mood = moods.find(m => m.value === moodValue);
  return mood ? mood.image : gatoPensativo; // Imagem padrão
};

// Função para obter o rótulo do humor
const getMoodLabel = (moodValue) => {
  const moods = [
    { image: gatoFeliz, label: 'Feliz', value: 'feliz' },
    { image: gatoPensativo, label: 'Calmo', value: 'calmo' },
    { image: gatoComLivro, label: 'Agradecido', value: 'agradecido' },
    { image: gatoTriste, label: 'Triste', value: 'triste' },
    { image: gatoBesta, label: 'Bravo', value: 'bravo' },
    { image: gatoCansado, label: 'Cansado', value: 'cansado' }
  ];
  const mood = moods.find(m => m.value === moodValue);
  return mood ? mood.label : 'Desconhecido';
};

// Função para obter o ícone da categoria
const getCategoryIcon = (category) => {
  switch(category) {
    case 'gratidao':
      return sinoIcon;
    case 'desabafo':
      return cartaIcon;
    case 'objetivos':
      return objetivoIcon;
    case 'reflexao':
      return livroIcon;
    case 'sem-categoria':
    default:
      return pergaminhoIcon;
  }
};

// Função para obter o rótulo da categoria
const getCategoryLabel = (category) => {
  switch(category) {
    case 'gratidao':
      return 'Gratidão';
    case 'desabafo':
      return 'Desabafo';
    case 'objetivos':
      return 'Objetivos';
    case 'reflexao':
      return 'Reflexão';
    case 'sem-categoria':
    default:
      return 'Sem Categoria';
  }
};

// Função para carregar a carta específica
const loadLetter = async (letterId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Pegar a carta específica pelo ID
    const foundLetter = await getLetterById(letterId);
    if (!foundLetter) {
      throw new Error('Carta não encontrada');
    }
    
    // Verificar se a carta pertence ao usuário atual
    if (foundLetter.author_id !== user.uid) {
      throw new Error('Acesso negado: você não tem permissão para ver esta carta');
    }

    letter.value = foundLetter;
  } catch (err) {
    console.error('Erro ao carregar carta:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Função para editar a carta
const editLetter = () => {
  router.push(`/patient/letters/edit/${route.params.id}`);
};

// Função para excluir a carta
const deleteLetter = async () => {
  if (!confirm('Tem certeza que deseja excluir esta escritura?')) {
    return;
  }

  try {
    await deleteDocument('letters', route.params.id);
    alert('Escritura excluída com sucesso!');
    router.push('/patient/letters');
  } catch (err) {
    console.error('Erro ao excluir carta:', err);
    alert('Erro ao excluir escritura: ' + err.message);
  }
};

onMounted(async () => {
  await loadLetter(route.params.id);
});
</script>