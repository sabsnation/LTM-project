<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-amber-900">Escrituras Secretas</h1>
        <router-link 
          to="/patient/dashboard" 
          class="bg-amber-700 text-amber-100 px-4 py-2 rounded-sm hover:bg-amber-600 transition-colors border border-amber-500"
        >
          Voltar
        </router-link>
      </div>
      
      <!-- Botão para abrir o modal de criação de carta -->
      <div class="text-center mb-12">
        <button 
          @click="showCreateLetterModal = true"
          class="bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 px-8 py-4 rounded-sm font-bold hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl border border-amber-500 text-lg"
        >
          Criar Nova Escritura
        </button>
      </div>
      
      <!-- Exibição condicional das cartas ou mensagem de carregamento/vazio -->
      <div v-if="loadingLetters" class="text-center py-12">
        <p class="text-amber-800 text-lg">Carregando suas escrituras...</p>
      </div>
      <div v-else-if="letters.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-amber-900 mb-6">Suas Escrituras</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="letter in letters" 
            :key="letter.id"
            class="bg-amber-50 rounded-sm shadow-md p-4 border border-amber-300 hover:shadow-lg transition-shadow relative"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-amber-900 text-lg truncate">{{ letter.title }}</h3>
              <img 
                :src="getMoodImage(letter.mood)" 
                :alt="getMoodLabel(letter.mood)"
                class="w-8 h-8 object-cover ml-2"
              />
            </div>
            
            <div class="text-sm text-amber-700 mb-2 flex items-center">
              <img 
                :src="getCategoryIcon(letter.category)" 
                :alt="getCategoryLabel(letter.category)"
                class="w-5 h-5 object-cover mr-1"
              />
              <span class="font-semibold">{{ getCategoryLabel(letter.category) }}</span>
              <span class="mx-2">•</span>
              <span>{{ formatDate(letter.createdAt) }}</span>
            </div>
            
            <!-- Conteúdo da carta bloqueada -->
            <div v-if="isLetterLocked(letter)" class="relative">
              <div class="opacity-40">
                <p class="text-amber-800 text-sm line-clamp-3 mb-3">{{ letter.content }}</p>
              </div>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <img 
                  :src="seloIcon" 
                  alt="Selo de Bloqueio"
                  class="w-44 h-44 object-contain opacity-80 cursor-pointer"
                  @click="showSeloModal = true"
                />
                <p class="text-amber-600 text-sm font-semibold text-center mt-2">Desbloqueio em: {{ formatUnlockDate(letter.openDate) }}</p>
              </div>
            </div>
            
            <!-- Conteúdo da carta desbloqueada -->
            <div v-else class="relative z-10">
              <p class="text-amber-800 text-sm line-clamp-3 mb-3">{{ letter.content }}</p>
              
              <div class="flex justify-end gap-2">
                <button 
                  @click="viewLetter(letter.id)"
                  class="text-amber-700 hover:text-amber-900 text-sm font-medium"
                >
                  Acessar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-amber-800 text-lg">Você ainda não tem escrituras salvas.</p>
        <p class="text-amber-600 mt-2">Crie sua primeira escritura usando o botão acima!</p>
      </div>

      <!-- Modal de Criar Carta -->
      <div v-if="showCreateLetterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-amber-50 rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-amber-300">
          <div class="bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-amber-100">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold">Nova Escritura</h2>
              <button @click="closeCreateLetterModal" class="hover:bg-amber-700 hover:bg-opacity-20 p-2 rounded-full transition-all">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <div class="p-6 overflow-y-auto flex-grow">
            <form @submit.prevent="submitLetter" class="space-y-4">
              <div>
                <label class="block text-amber-800 font-semibold mb-2">Título</label>
                <input 
                  v-model="newLetter.title" 
                  type="text" 
                  class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50"
                  placeholder="Dê um título à sua escritura..."
                  required
                />
              </div>

              <div>
                <label class="block text-amber-800 font-semibold mb-2">Categoria</label>
                <select 
                  v-model="newLetter.category"
                  class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50"
                >
                  <option value="gratidao">Gratidão</option>
                  <option value="desabafo">Desabafo</option>
                  <option value="objetivos">Objetivos</option>
                  <option value="reflexao">Reflexão</option>
                  <option value="sem-categoria">Sem Categoria</option>
                </select>
              </div>

              <div>
                <label class="block text-amber-800 font-semibold mb-2">Humor</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="mood in moods"
                    :key="mood.value"
                    type="button"
                    @click="newLetter.mood = mood.value"
                    :class="newLetter.mood === mood.value ? 'ring-2 ring-amber-700 bg-amber-200' : 'bg-amber-200 hover:bg-amber-300'"
                    class="w-16 h-16 rounded-sm border border-amber-400 flex items-center justify-center overflow-hidden"
                    :title="mood.label"
                  >
                    <img 
                      :src="mood.image" 
                      :alt="mood.label"
                      class="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-amber-800 font-semibold mb-2">Data de Abertura</label>
                <input 
                  v-model="newLetter.openDate" 
                  type="date" 
                  class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50"
                />
              </div>

              <div>
                <label class="block text-amber-800 font-semibold mb-2">Conteúdo</label>
                <textarea 
                  v-model="newLetter.content"
                  rows="6"
                  class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50"
                  placeholder="Escreva sua escritura secreta aqui..."
                  required
                ></textarea>
              </div>

              <div v-if="newLetter.hasMedia" class="p-4 bg-amber-100 rounded-sm border border-amber-300">
                <label class="block text-amber-800 font-semibold mb-2">Mídia Anexada</label>
                <div class="flex gap-2">
                  <div class="bg-amber-200 p-2 rounded-sm">
                    <ImageIcon class="w-6 h-6 text-amber-700" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div class="bg-amber-100 px-8 py-6 border-t border-amber-300 flex justify-end gap-4">
            <button
              @click="closeCreateLetterModal"
              class="px-6 py-3 bg-amber-200 text-amber-900 rounded-sm font-semibold hover:bg-amber-300 transition-all border border-amber-400"
            >
              Cancelar
            </button>
            <button
              @click="submitLetter"
              :disabled="saving"
              class="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 rounded-sm font-semibold hover:from-amber-500 hover:to-amber-700 transition-all border border-amber-500 disabled:opacity-50"
            >
              <span v-if="!saving">Salvar Escritura</span>
              <span v-else>Salvando...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal do Selo -->
  <div v-if="showSeloModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" @click="closeSeloModal">
    <div class="bg-amber-100 rounded-lg shadow-2xl p-8 max-w-md w-full flex flex-col items-center border-4 border-amber-500" @click.stop>
      <img 
        :src="seloIcon" 
        alt="Selo LetterMatter"
        class="w-64 h-64 object-contain mx-auto mb-6"
      />
      <h3 class="text-2xl font-bold text-amber-900 mb-4 text-center">Selo LetterMatter</h3>
      <button
        @click="closeSeloModal"
        class="mt-4 px-6 py-2 bg-amber-700 text-amber-100 rounded-sm hover:bg-amber-800 transition-colors border border-amber-500"
      >
        Fechar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { LogOut, X, Image as ImageIcon } from 'lucide-vue-next';
import { getCurrentUser } from '@/firebase/authService';
import { createLetter, getUserLetters, updateLetter, deleteDocument } from '@/firebase/firestoreService';

const router = useRouter();

// Importar as imagens de humor
import gatoFeliz from '@/assets/gato feliz.webp';
import gatoPensativo from '@/assets/gato pensativo.jpeg';
import gatoComLivro from '@/assets/gato com livro.jpg';
import gatoTriste from '@/assets/gato triste.jpg';
import gatoBesta from '@/assets/gato besta.avif';
import gatoCansado from '@/assets/gato cansado.webp';
import sinoIcon from '@/assets/sino-removebg-preview.png';
import cartaIcon from '@/assets/criar_carta-removebg-preview.png';
import livroIcon from '@/assets/livro-.png';
import objetivoIcon from '@/assets/livraberto-.png';
import pergaminhoIcon from '@/assets/pergaminho.png';
import seloIcon from '@/assets/selo-ltm.png';

const showCreateLetterModal = ref(false);
const newLetter = ref({
  title: '',
  category: 'gratidao',
  mood: '😊',
  openDate: '',
  content: '',
  hasMedia: false
});

const saving = ref(false);
const loadingLetters = ref(true);
const letters = ref([]);
const editingLetterId = ref(null);

const moods = [
  { image: gatoFeliz, label: 'Feliz', value: 'feliz' },
  { image: gatoPensativo, label: 'Calmo', value: 'calmo' },
  { image: gatoComLivro, label: 'Agradecido', value: 'agradecido' },
  { image: gatoTriste, label: 'Triste', value: 'triste' },
  { image: gatoBesta, label: 'Bravo', value: 'bravo' },
  { image: gatoCansado, label: 'Cansado', value: 'cansado' }
];

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

// Função para carregar as cartas do usuário
const loadLetters = async () => {
  loadingLetters.value = true;
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const userLetters = await getUserLetters(user.uid);
    letters.value = userLetters;
    console.log('Cartas carregadas:', userLetters);
  } catch (error) {
    console.error('Erro ao carregar cartas:', error);
    alert('Erro ao carregar cartas: ' + error.message);
  } finally {
    loadingLetters.value = false;
  }
};

// Função para obter o caminho da imagem do humor
const getMoodImage = (moodValue) => {
  const mood = moods.find(m => m.value === moodValue);
  return mood ? mood.image : gatoPensativo; // Imagem padrão
};

// Função para obter o rótulo do humor
const getMoodLabel = (moodValue) => {
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

// Função para verificar se a carta está bloqueada
const isLetterLocked = (letter) => {
  if (!letter.openDate) {
    return false; // Se não houver data de abertura, a carta não está bloqueada
  }

  const openDate = new Date(letter.openDate);
  const today = new Date();
  // Comparar apenas as datas (ignorar hora)
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const letterDate = new Date(openDate.getFullYear(), openDate.getMonth(), openDate.getDate());

  return letterDate > todayDate;
};

// Função para formatar a data de desbloqueio
const formatUnlockDate = (date) => {
  if (!date) return 'N/A';
  if (typeof date === 'string') {
    // Verificar se é uma string de data
    return new Date(date).toLocaleDateString('pt-BR');
  } else if (date && typeof date.toDate === 'function') {
    // Se for um objeto Firebase Timestamp
    return date.toDate().toLocaleDateString('pt-BR');
  } else if (date instanceof Date) {
    return date.toLocaleDateString('pt-BR');
  }
  return 'N/A';
};

// Função para editar carta
const editLetter = (letter) => {
  newLetter.value = { ...letter };
  editingLetterId.value = letter.id;
  showCreateLetterModal.value = true;
};

// Função para visualizar carta
const viewLetter = (letterId) => {
  router.push(`/patient/letters/${letterId}`);
};

// Função para excluir carta
const deleteLetter = async (letterId) => {
  if (!confirm('Tem certeza que deseja excluir esta escritura?')) {
    return;
  }
  
  try {
    await deleteDocument('letters', letterId);
    // Atualizar a lista de cartas
    await loadLetters();
    alert('Escritura excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir carta:', error);
    alert('Erro ao excluir escritura: ' + error.message);
  }
};

// Ref para modal do selo
const showSeloModal = ref(false);

const closeCreateLetterModal = () => {
  showCreateLetterModal.value = false;
  // Reset do formulário
  newLetter.value = {
    title: '',
    category: 'gratidao',
    mood: '😊',
    openDate: '',
    content: '',
    hasMedia: false
  };
  editingLetterId.value = null;
};

const closeSeloModal = () => {
  showSeloModal.value = false;
};

const submitLetter = async () => {
  if (!newLetter.value.title || !newLetter.value.content) {
    alert('Por favor, preencha o título e o conteúdo da carta.');
    return;
  }
  
  saving.value = true;
  
  try {
    // Obter usuário atual
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    if (editingLetterId.value) {
      // Atualizar carta existente
      await updateLetter(editingLetterId.value, {
        title: newLetter.value.title,
        category: newLetter.value.category,
        mood: newLetter.value.mood,
        openDate: newLetter.value.openDate,
        content: newLetter.value.content,
        hasMedia: newLetter.value.hasMedia
      });
      
      console.log('Carta atualizada com sucesso!');
      alert('Escritura atualizada com sucesso!');
    } else {
      // Criar nova carta
      // Obter o usuário novamente para garantir que o token esteja atualizado
      const currentUser = await getCurrentUser();
      if (!currentUser || !currentUser.uid) {
        throw new Error('Usuário não autenticado corretamente no momento da operação');
      }
      
      // Normalizar os dados da carta
      const letterData = {
        author_id: currentUser.uid,
        therapist_id: null,
        title: newLetter.value.title?.trim() || '',  // Garantir string válida
        category: newLetter.value.category || 'sem-categoria',
        mood: newLetter.value.mood || '😊',
        openDate: newLetter.value.openDate ? new Date(newLetter.value.openDate).toISOString() : null, // Converter para ISO se existir
        content: newLetter.value.content?.trim() || '',  // Garantir string válida
        hasMedia: Boolean(newLetter.value.hasMedia),  // Garantir booleano
        status: 'private'
      };
      
      console.log('Dados da carta antes de salvar (normalizados):', letterData);
      console.log('UID do usuário autenticado no momento da operação:', currentUser.uid);
      console.log('Dados completos do usuário:', { uid: currentUser.uid, email: currentUser.email });
      
      // Salvar carta no Firestore
      await createLetter(letterData);
      
      console.log('Carta salva com sucesso!');
      alert('Carta salva com sucesso!');
    }
    
    // Fechar modal e resetar formulário
    closeCreateLetterModal();
    
    // Atualizar a lista de cartas
    await loadLetters();
  } catch (error) {
    console.error('Erro ao salvar carta:', error);
    alert('Erro ao salvar carta: ' + error.message);
  } finally {
    saving.value = false;
  }
};
// Carregar cartas ao montar o componente
onMounted(() => {
  loadLetters();
});
</script>