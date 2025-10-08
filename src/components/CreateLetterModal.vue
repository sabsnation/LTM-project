<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-orange-500 to-rose-500 p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Nova Carta para o Futuro</h2>
            <p class="text-sm opacity-90 mt-1">Etapa {{ step }} de 4</p>
          </div>
          <button @click="$emit('close')" class="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div class="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div 
            class="bg-white h-full rounded-full transition-all duration-300"
            :style="{ width: `${(step / 4) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Body -->
      <div class="p-8 overflow-y-auto" style="max-height: calc(90vh - 240px)">
        <!-- Step 1: Título e Categoria -->
        <div v-if="step === 1" class="space-y-6">
          <div>
            <label class="block text-lg font-bold text-gray-800 mb-3">
              Dê um título para sua carta ✍️
            </label>
            <input
              v-model="letterData.title"
              type="text"
              placeholder="Ex: Carta de reflexão sobre 2025"
              class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-lg"
            />
          </div>

          <div>
            <label class="block text-lg font-bold text-gray-800 mb-4">
              Escolha uma categoria (opcional)
            </label>
            <div class="grid md:grid-cols-2 gap-4">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="letterData.category = cat.id"
                :class="letterData.category === cat.id ? 'border-orange-500 bg-orange-50 shadow-lg scale-105' : 'border-gray-200 hover:border-orange-300 hover:shadow-md'"
                class="p-6 rounded-2xl border-2 transition-all text-left"
              >
                <div class="flex items-start gap-4">
                  <div :class="`bg-${cat.color}-100 p-3 rounded-xl`">
                    <component :is="cat.icon" :class="`w-6 h-6 text-${cat.color}-600`" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">{{ cat.name }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ cat.description }}</p>
                  </div>
                  <div v-if="letterData.category === cat.id" class="bg-orange-500 text-white rounded-full p-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Humor do Dia -->
        <div v-if="step === 2" class="space-y-6">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Como você está se sentindo hoje?</h3>
            <p class="text-gray-600">Escolha o emoji que melhor representa seu humor</p>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <button
              v-for="mood in moods"
              :key="mood.emoji"
              @click="letterData.mood = mood.emoji"
              :class="letterData.mood === mood.emoji ? 'border-orange-500 bg-orange-50 shadow-lg scale-110' : 'border-gray-200 hover:border-orange-300'"
              class="p-6 rounded-2xl border-2 transition-all hover:scale-110"
            >
              <div class="text-center">
                <span class="text-5xl block mb-2">{{ mood.emoji }}</span>
                <span class="text-sm font-semibold text-gray-700">{{ mood.label }}</span>
              </div>
            </button>
          </div>

          <div v-if="letterData.mood" class="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
            <p class="text-green-700 font-semibold">
              Ótimo! Seu humor foi registrado: {{ letterData.mood }}
            </p>
          </div>
        </div>

        <!-- Step 3: Escrever a Carta -->
        <div v-if="step === 3" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Escreva sua carta 💌</h3>
            <p class="text-gray-600">Compartilhe seus pensamentos, sentimentos e reflexões</p>
          </div>

          <div class="relative">
            <textarea
              v-model="letterData.content"
              placeholder="Querido eu do futuro,&#10;&#10;Hoje eu..."
              class="w-full h-80 px-6 py-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none text-lg leading-relaxed"
              style="font-family: Georgia, serif"
            ></textarea>
            <div class="absolute bottom-4 right-4 text-sm text-gray-400">
              {{ letterData.content.length }} caracteres
            </div>
          </div>

          <!-- Media Upload Options -->
          <div class="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300">
            <p class="font-semibold text-gray-800 mb-4">Adicionar mídia (opcional)</p>
            <div class="flex flex-wrap gap-3">
              <button
                @click="handleMediaUpload('imagem')"
                class="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <Image class="w-5 h-5 text-blue-600" />
                <span class="text-sm font-semibold">Foto</span>
              </button>
              <button
                @click="handleMediaUpload('video')"
                class="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                <Video class="w-5 h-5 text-purple-600" />
                <span class="text-sm font-semibold">Vídeo</span>
              </button>
              <button
                @click="handleMediaUpload('audio')"
                class="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all"
              >
                <Mic class="w-5 h-5 text-green-600" />
                <span class="text-sm font-semibold">Áudio</span>
              </button>
              <button
                @click="handleMediaUpload('arquivo')"
                class="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all"
              >
                <Paperclip class="w-5 h-5 text-orange-600" />
                <span class="text-sm font-semibold">Arquivo</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 4: Data de Abertura -->
        <div v-if="step === 4" class="space-y-6">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Quando você quer abrir essa carta?</h3>
            <p class="text-gray-600">Escolha uma data no futuro para receber sua mensagem</p>
          </div>

          <div class="max-w-md mx-auto space-y-6">
            <!-- Quick Options -->
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="setQuickDate(1)"
                class="p-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl border-2 border-orange-200 hover:shadow-lg transition-all"
              >
                <Calendar class="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p class="font-bold text-gray-800">1 mês</p>
                <p class="text-sm text-gray-600 mt-1">Daqui 30 dias</p>
              </button>
              <button
                @click="setQuickDate(6)"
                class="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all"
              >
                <Calendar class="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p class="font-bold text-gray-800">6 meses</p>
                <p class="text-sm text-gray-600 mt-1">Daqui 180 dias</p>
              </button>
              <button
                @click="setQuickDate(12)"
                class="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-all"
              >
                <Calendar class="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p class="font-bold text-gray-800">1 ano</p>
                <p class="text-sm text-gray-600 mt-1">Daqui 365 dias</p>
              </button>
              <button
                @click="setQuickDate(60)"
                class="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all"
              >
                <Calendar class="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p class="font-bold text-gray-800">5 anos</p>
                <p class="text-sm text-gray-600 mt-1">Daqui 1825 dias</p>
              </button>
            </div>

            <!-- Custom Date Picker -->
            <div class="relative">
              <label class="block font-semibold text-gray-800 mb-3 text-center">
                Ou escolha uma data específica:
              </label>
              <input
                v-model="letterData.openDate"
                type="date"
                :min="minDate"
                class="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-center text-lg font-semibold"
              />
            </div>

            <div v-if="letterData.openDate" class="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
              <div class="text-center">
                <p class="text-green-700 font-semibold text-lg mb-2">✅ Data confirmada!</p>
                <p class="text-gray-700">
                  Sua carta será aberta em:{' '}
                  <strong class="text-green-700">{{ formatDate(letterData.openDate) }}</strong>
                </p>
                <p class="text-sm text-gray-600 mt-2">
                  Você receberá uma notificação quando chegar o dia!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-8 py-6 border-t flex items-center justify-between">
        <button
          @click="handleBack"
          :disabled="step === 1"
          :class="step === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100'"
          class="px-6 py-3 rounded-xl font-semibold transition-all"
        >
          Voltar
        </button>

        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>
          
          <button
            v-if="step < 4"
            @click="handleNext"
            :disabled="!canProceed"
            :class="!canProceed ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 shadow-lg'"
            class="px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Próximo
          </button>

          <button
            v-else
            @click="handleSubmit"
            :disabled="!letterData.openDate"
            :class="!letterData.openDate ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg'"
            class="px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <Send class="w-5 h-5" />
            Lacrar Carta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, Heart, MessageCircle, Target, Sparkles, Mail, Calendar, Image, Video, Mic, Paperclip, Send } from 'lucide-vue-next';

const emit = defineEmits(['close', 'submit']);

const step = ref(1);
const letterData = ref({
  title: '',
  category: '',
  mood: '',
  content: '',
  openDate: '',
  media: []
});

const categories = [
  { id: 'gratidao', name: 'Gratidão', icon: Heart, color: 'pink', description: 'Agradeça pelas coisas boas' },
  { id: 'desabafo', name: 'Desabafo', icon: MessageCircle, color: 'blue', description: 'Expresse seus sentimentos' },
  { id: 'objetivos', name: 'Objetivos', icon: Target, color: 'green', description: 'Defina suas metas' },
  { id: 'reflexao', name: 'Reflexão', icon: Sparkles, color: 'purple', description: 'Reflita sobre sua vida' },
  { id: 'sem-categoria', name: 'Livre', icon: Mail, color: 'gray', description: 'Escreva livremente' }
];

const moods = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😌', label: 'Calmo' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '😰', label: 'Ansioso' },
  { emoji: '😴', label: 'Cansado' },
  { emoji: '😡', label: 'Irritado' },
  { emoji: '🥰', label: 'Apaixonado' },
  { emoji: '🤔', label: 'Pensativo' }
];

const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
});

const canProceed = computed(() => {
  if (step.value === 1) return letterData.value.title.trim() !== '';
  if (step.value === 2) return letterData.value.mood !== '';
  if (step.value === 3) return letterData.value.content.trim() !== '';
  return true;
});

const handleNext = () => {
  if (step.value < 4 && canProceed.value) {
    step.value++;
  }
};

const handleBack = () => {
  if (step.value > 1) {
    step.value--;
  }
};

const setQuickDate = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  letterData.value.openDate = date.toISOString().split('T')[0];
};

const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const handleMediaUpload = (type) => {
  alert(`Upload de ${type} será implementado com Firebase Storage`);
  // TODO: Implementar upload com Firebase
};

const handleSubmit = () => {
  if (!letterData.value.openDate) return;
  
  console.log('Carta criada:', letterData.value);
  emit('submit', letterData.value);
  emit('close');
};
</script>