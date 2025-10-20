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
                <div class="flex gap-2">
                  <button 
                    v-for="mood in moods"
                    :key="mood.emoji"
                    type="button"
                    @click="newLetter.mood = mood.emoji"
                    :class="newLetter.mood === mood.emoji ? 'ring-2 ring-amber-700 bg-amber-200' : 'bg-amber-200 hover:bg-amber-300'"
                    class="w-12 h-12 text-2xl rounded-sm border border-amber-400"
                  >
                    {{ mood.emoji }}
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
              class="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 rounded-sm font-semibold hover:from-amber-500 hover:to-amber-700 transition-all border border-amber-500"
            >
              Salvar Escritura
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { LogOut, X, Image as ImageIcon } from 'lucide-vue-next';

const showCreateLetterModal = ref(false);
const newLetter = ref({
  title: '',
  category: 'gratidao',
  mood: '😊',
  openDate: '',
  content: '',
  hasMedia: false
});

const moods = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😌', label: 'Calmo' },
  { emoji: '🥰', label: 'Agradecido' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '😠', label: 'Bravo' },
  { emoji: '😴', label: 'Cansado' }
];

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
};

const submitLetter = () => {
  // Aqui você pode adicionar a lógica para salvar a carta
  console.log('Nova carta:', newLetter.value);
  
  // Por enquanto, apenas fechamos o modal
  closeCreateLetterModal();
};
</script>