<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
    <!-- Header -->
    <header class="bg-white shadow-md border-b-2 border-orange-100">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-gradient-to-br from-orange-400 to-rose-500 p-3 rounded-xl shadow-lg">
              <Mail class="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                LetterMatter
              </h1>
              <p class="text-sm text-gray-600">Olá, {{ userName }}! ✨</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button v-if="!isLinkedToPsychologist" class="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2">
              <TrendingUp class="w-4 h-4" />
              Vincular Psicólogo
            </button>
            <button 
              @click="showCreateLetterModal = true"
              class="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
              <Plus class="w-5 h-5" />
              Nova Carta
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-semibold">Total de Cartas</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.totalLetters }}</p>
            </div>
            <Mail class="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-rose-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-semibold">Aguardando</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.lockedLetters }}</p>
            </div>
            <Lock class="w-12 h-12 text-rose-500 opacity-50" />
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-semibold">Abertas</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.unlockedLetters }}</p>
            </div>
            <Unlock class="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl p-6 shadow-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white text-sm font-semibold opacity-90">Próxima Abertura</p>
              <p class="text-2xl font-bold mt-2">{{ stats.nextToOpen?.daysLeft }} dias</p>
              <p class="text-xs opacity-75 mt-1">{{ stats.nextToOpen?.title }}</p>
            </div>
            <Calendar class="w-12 h-12 text-white opacity-50" />
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-4 gap-6">
        <!-- Sidebar - Filtros e Conquistas -->
        <div class="space-y-6">
          <!-- Filtro por Categoria -->
          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <div class="flex items-center gap-2 mb-4">
              <Filter class="w-5 h-5 text-orange-600" />
              <h3 class="font-bold text-gray-800">Categorias</h3>
            </div>
            <div class="space-y-2">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="filterCategory = cat.id"
                :class="filterCategory === cat.id ? 'bg-orange-100 text-orange-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'"
                class="w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                <component :is="cat.icon" class="w-4 h-4" />
                <span class="text-sm">{{ cat.name }}</span>
              </button>
            </div>
          </div>

          <!-- Filtro por Status -->
          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <h3 class="font-bold text-gray-800 mb-4">Status</h3>
            <div class="space-y-2">
              <button
                @click="filterStatus = 'todas'"
                :class="filterStatus === 'todas' ? 'bg-orange-100 text-orange-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'"
                class="w-full text-left px-3 py-2 rounded-lg transition-all text-sm">
                Todas
              </button>
              <button
                @click="filterStatus = 'locked'"
                :class="filterStatus === 'locked' ? 'bg-orange-100 text-orange-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'"
                class="w-full text-left px-3 py-2 rounded-lg transition-all text-sm flex items-center gap-2">
                <Lock class="w-4 h-4" />
                Lacradas
              </button>
              <button
                @click="filterStatus = 'unlocked'"
                :class="filterStatus === 'unlocked' ? 'bg-orange-100 text-orange-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'"
                class="w-full text-left px-3 py-2 rounded-lg transition-all text-sm flex items-center gap-2">
                <Unlock class="w-4 h-4" />
                Abertas
              </button>
            </div>
          </div>

          <!-- Conquistas -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 shadow-lg border-2 border-orange-200">
            <div class="flex items-center gap-2 mb-4">
              <Award class="w-5 h-5 text-orange-600" />
              <h3 class="font-bold text-gray-800">Conquistas</h3>
            </div>
            <div class="space-y-3">
              <div
                v-for="achievement in achievements"
                :key="achievement.id"
                :class="achievement.unlocked ? 'bg-white border-2 border-orange-300' : 'bg-gray-100 border-2 border-gray-200 opacity-60'"
                class="p-3 rounded-lg">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">{{ achievement.icon }}</span>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">{{ achievement.name }}</p>
                    <div v-if="!achievement.unlocked && achievement.progress" class="mt-1">
                      <div class="bg-gray-300 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-orange-500 h-full rounded-full" :style="{ width: `${(achievement.progress / 10) * 100}%` }"></div>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">{{ achievement.progress }}/10</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid de Cartas -->
        <div class="md:col-span-3">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Minhas Cartas</h2>
            <p class="text-gray-600">
              {{ filteredLetters.length }} {{ filteredLetters.length === 1 ? 'carta encontrada' : 'cartas encontradas' }}
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="letter in filteredLetters"
              :key="letter.id"
              :class="letter.status === 'locked' ? 'border-gray-200' : 'border-green-200'"
              class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2">
              
              <!-- Header do Card -->
              <div :class="letter.status === 'locked' ? 'from-gray-100 to-gray-200' : 'from-green-50 to-emerald-50'" class="p-4 bg-gradient-to-r">
                <div class="flex items-start justify-between mb-2">
                  <div class="bg-orange-100 p-2 rounded-lg">
                    <component :is="getCategoryIcon(letter.category)" class="w-5 h-5 text-orange-600" />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{{ letter.mood }}</span>
                    <Lock v-if="letter.status === 'locked'" class="w-5 h-5 text-gray-500" />
                    <Unlock v-else class="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h3 class="font-bold text-gray-800 text-lg">{{ letter.title }}</h3>
              </div>

              <!-- Body do Card -->
              <div class="p-4">
                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2 text-gray-600">
                    <Calendar class="w-4 h-4" />
                    <span>Escrita em {{ letter.createdAt }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600">
                    <Clock class="w-4 h-4" />
                    <span>Abre em {{ letter.openDate }}</span>
                  </div>
                  <div v-if="letter.status === 'locked'" class="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p class="text-orange-700 font-semibold text-center">
                      🔒 Faltam {{ letter.daysLeft }} dias
                    </p>
                  </div>
                  <div v-if="letter.hasMedia" class="flex gap-2 mt-3">
                    <div class="bg-blue-50 p-2 rounded">
                      <Image class="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>

                <button v-if="letter.status === 'unlocked'" class="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all">
                  Ler Carta
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredLetters.length === 0" class="text-center py-16">
            <Mail class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-gray-600 mb-2">Nenhuma carta encontrada</h3>
            <p class="text-gray-500">Tente ajustar os filtros ou escreva sua primeira carta!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Criar Carta (vou criar depois) -->
    <CreateLetterModal 
  v-if="showCreateLetterModal" 
  @close="showCreateLetterModal = false"
  @submit="handleLetterSubmit"
/>
  </div>
</template>

<script setup>
import CreateLetterModal from '@/components/CreateLetterModal.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, Plus, Calendar, Lock, Unlock, Heart, Target, MessageCircle, Sparkles, Award, Filter, Clock, Image, TrendingUp } from 'lucide-vue-next';

const router = useRouter();
const showCreateLetterModal = ref(false);

const userName = ref('Maria');
const isLinkedToPsychologist = ref(false);
const filterCategory = ref('todas');
const filterStatus = ref('todas');

const categories = [
  { id: 'todas', name: 'Todas', icon: Mail },
  { id: 'gratidao', name: 'Gratidão', icon: Heart },
  { id: 'desabafo', name: 'Desabafo', icon: MessageCircle },
  { id: 'objetivos', name: 'Objetivos', icon: Target },
  { id: 'reflexao', name: 'Reflexão', icon: Sparkles },
  { id: 'sem-categoria', name: 'Sem Categoria', icon: Mail }
];

const letters = ref([
  {
    id: 1,
    title: 'Carta de Ano Novo 2025',
    category: 'objetivos',
    createdAt: '01/Jan/2025',
    openDate: '01/Jan/2026',
    status: 'locked',
    daysLeft: 84,
    mood: '😊',
    hasMedia: true,
    sharedWithPsychologist: false
  },
  {
    id: 2,
    title: 'Reflexões sobre mudanças',
    category: 'reflexao',
    createdAt: '15/Set/2025',
    openDate: '15/Out/2025',
    status: 'locked',
    daysLeft: 7,
    mood: '😌',
    hasMedia: false,
    sharedWithPsychologist: false
  },
  {
    id: 3,
    title: 'Gratidão pelo mês',
    category: 'gratidao',
    createdAt: '01/Set/2025',
    openDate: '01/Out/2025',
    status: 'unlocked',
    mood: '🥰',
    hasMedia: true,
    sharedWithPsychologist: false
  },
  {
    id: 4,
    title: 'Desabafo sobre o trabalho',
    category: 'desabafo',
    createdAt: '20/Ago/2025',
    openDate: '20/Set/2025',
    status: 'unlocked',
    mood: '😢',
    hasMedia: false,
    sharedWithPsychologist: false
  }
]);

const achievements = ref([
  { id: 1, name: 'Primeira Carta', icon: '📝', unlocked: true },
  { id: 2, name: '10 Cartas', icon: '📬', unlocked: false, progress: 4 },
  { id: 3, name: 'Sequência de 7 dias', icon: '🔥', unlocked: false, progress: 3 }
]);

const stats = computed(() => ({
  totalLetters: letters.value.length,
  lockedLetters: letters.value.filter(l => l.status === 'locked').length,
  unlockedLetters: letters.value.filter(l => l.status === 'unlocked').length,
  nextToOpen: letters.value.filter(l => l.status === 'locked').sort((a, b) => a.daysLeft - b.daysLeft)[0]
}));

const filteredLetters = computed(() => {
  return letters.value.filter(letter => {
    const matchCategory = filterCategory.value === 'todas' || letter.category === filterCategory.value;
    const matchStatus = filterStatus.value === 'todas' || letter.status === filterStatus.value;
    return matchCategory && matchStatus;
  });
});

const getCategoryIcon = (categoryId) => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.icon : Mail;
};

const handleLetterSubmit = (letterData) => {
  console.log('Nova carta:', letterData);
  // Aqui você salvará no Firebase
  showCreateLetterModal.value = false;
};

</script>