<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-amber-50 rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-amber-300 font-serif">
      <!-- Header -->
      <div class="bg-gradient-to-r from-amber-700 to-amber-900 p-6 text-amber-100">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Novo Pergaminho para o Futuro</h2>
            <p class="text-sm opacity-90 mt-1">Etapa {{ step }} de 4</p>
          </div>
          <button @click="$emit('close')" class="hover:bg-amber-700 hover:bg-opacity-20 p-2 rounded-full transition-all">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div class="mt-4 bg-amber-900 bg-opacity-20 rounded-sm h-2 overflow-hidden">
          <div 
            class="bg-amber-100 h-full rounded-sm transition-all duration-300"
            :style="{ width: `${(step / 4) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Body -->
      <div class="p-8 overflow-y-auto" style="max-height: calc(90vh - 240px)">
        <!-- Step 1: Título e Categoria -->
        <div v-if="step === 1" class="space-y-6">
          <div>
            <label class="block text-lg font-bold text-amber-900 mb-3">
              Dê um título para seu pergaminho ✍️
            </label>
            <input
              v-model="letterData.title"
              type="text"
              placeholder="Ex: Pergaminho de reflexão sobre 2025"
              class="w-full px-4 py-4 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-lg text-amber-900 bg-amber-100"
            />
          </div>

          <div>
            <label class="block text-lg font-bold text-amber-900 mb-4">
              Escolha uma categoria (opcional)
            </label>
            <div class="grid md:grid-cols-2 gap-4">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="letterData.category = cat.id"
                :class="letterData.category === cat.id ? 'border-amber-600 bg-amber-200 shadow-lg scale-105' : 'border-amber-400 hover:border-amber-600 hover:shadow-md'"
                class="p-6 rounded-sm border-2 transition-all text-left"
              >
                <div class="flex items-start gap-4">
                  <div :class="`bg-amber-200 p-3 rounded-sm border border-amber-400`">
                    <component :is="cat.icon" :class="`w-6 h-6 text-amber-700`" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-amber-900 text-lg">{{ cat.name }}</h3>
                    <p class="text-sm text-amber-800 mt-1">{{ cat.description }}</p>
                  </div>
                  <div v-if="letterData.category === cat.id" class="bg-amber-700 text-amber-100 rounded-full p-1 border border-amber-500">
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
            <h3 class="text-2xl font-bold text-amber-900 mb-2">Como você está se sentindo hoje?</h3>
            <p class="text-amber-700">Escolha o símbolo que melhor representa seu humor</p>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <button
              v-for="mood in moods"
              :key="mood.emoji"
              @click="letterData.mood = mood.id"
              :class="letterData.mood === mood.id ? 'border-amber-700 bg-amber-200 shadow-lg scale-110' : 'border-amber-400 hover:border-amber-600'"
              class="p-6 rounded-sm border-2 transition-all hover:scale-110">
              <div class="text-center">
                    <img 
                          :src="mood.img" 
                          :alt="mood.label"
                          class="w-16 h-16 mx-auto mb-2 object-contain"
                        />
                <span class="text-sm font-semibold text-amber-800">{{ mood.label }}</span>
              </div>
            </button>
          </div>

          <div v-if="letterData.mood" class="mt-6 p-4 bg-amber-200 border border-amber-400 rounded-sm text-center">
            <p class="text-amber-800 font-semibold flex items-center justify-center gap-2">
              Ótimo! Seu humor foi registrado: 
              <img 
                v-if="selectedMoodImage" 
                :src="selectedMoodImage" 
                alt="humor selecionado" 
                class="w-8 h-8 inline-block object-contain" 
              />
            </p>
          </div>
        </div>

        <!-- Step 3: Escrever a Carta -->
        <div v-if="step === 3" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-amber-900 mb-2">Escreva seu pergaminho 📜</h3>
            <p class="text-amber-700">Compartilhe seus pensamentos, sentimentos e reflexões</p>
          </div>

          <div class="relative">
            <textarea
              v-model="letterData.content"
              placeholder="Caríssimo eu do futuro,&#10;&#10;Nesta data eu..."
              class="w-full h-80 px-6 py-6 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none text-lg leading-relaxed text-amber-900 bg-amber-100 font-serif"
            ></textarea>
            <div class="absolute bottom-4 right-4 text-sm text-amber-600">
              {{ letterData.content.length }} caracteres
            </div>
          </div>

          <!-- Media Upload Options -->
          <div class="bg-amber-100 rounded-sm p-6 border-2 border-dashed border-amber-400">
            <p class="font-semibold text-amber-900 mb-4">Adicionar selos (opcional)</p>
            <div class="flex flex-wrap gap-3">
              <button
                @click="handleMediaUpload('imagem')"
                class="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-400 rounded-sm hover:border-amber-600 hover:bg-amber-200 transition-all"
              >
                <Image class="w-5 h-5 text-amber-700" />
                <span class="text-sm font-semibold text-amber-800">Desenho</span>
              </button>
              <button
                @click="handleMediaUpload('video')"
                class="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-400 rounded-sm hover:border-amber-600 hover:bg-amber-200 transition-all"
              >
                <Video class="w-5 h-5 text-amber-700" />
                <span class="text-sm font-semibold text-amber-800">Gravação</span>
              </button>
              <button
                @click="handleMediaUpload('audio')"
                class="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-400 rounded-sm hover:border-amber-600 hover:bg-amber-200 transition-all"
              >
                <Mic class="w-5 h-5 text-amber-700" />
                <span class="text-sm font-semibold text-amber-800">Voz</span>
              </button>
              <button
                @click="handleMediaUpload('arquivo')"
                class="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-400 rounded-sm hover:border-amber-600 hover:bg-amber-200 transition-all"
              >
                <Paperclip class="w-5 h-5 text-amber-700" />
                <span class="text-sm font-semibold text-amber-800">Documento</span>
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
      <div class="bg-amber-100 px-8 py-6 border-t border-amber-300 flex items-center justify-between">
        <button
          @click="handleBack"
          :disabled="step === 1"
          :class="step === 1 ? 'bg-amber-300 text-amber-500 cursor-not-allowed' : 'bg-amber-50 border border-amber-400 text-amber-800 hover:bg-amber-200'"
          class="px-6 py-3 rounded-sm font-semibold transition-all"
        >
          Voltar
        </button>

        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="px-6 py-3 border border-amber-400 rounded-sm font-semibold text-amber-800 hover:bg-amber-200 transition-all"
          >
            Cancelar
          </button>
          
          <button
            v-if="step < 4"
            @click="handleNext"
            :disabled="!canProceed"
            :class="!canProceed ? 'bg-amber-300 text-amber-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 hover:from-amber-600 hover:to-amber-800 shadow-lg'"
            class="px-8 py-3 rounded-sm font-semibold transition-all"
          >
            Próximo
          </button>

          <button
            v-else
            @click="handleSubmit"
            :disabled="!letterData.openDate"
            :class="!letterData.openDate ? 'bg-amber-300 text-amber-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 hover:from-amber-600 hover:to-amber-800 shadow-lg'"
            class="px-8 py-3 rounded-sm font-semibold transition-all flex items-center gap-2"
          >
            <Send class="w-5 h-5" />
            Lacrar Pergaminho
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

const selectedMoodImage = computed(() => {
  const mood = moods.find(m => m.id === letterData.value.mood);
  return mood ? mood.img : null;
});


const moods = [
  { id: 'feliz', label: 'Feliz', img: '@/assets/gatodesconfiado.jpeg'},
  { id: 'calmo', label: 'Cansado', img: '@/assets/gato cansado.webp' },
  { id: 'triste', label: 'Triste', img: '@/assets/gato triste.jpg' },
  { id: 'ansioso', label: 'Ansioso', img: '@/assets/gato existencial.jpeg' },
  { id: 'irritado', label: 'Normal', img: '@/assets/gato besta.avif' },
  { id: 'apaixonado', label: 'Pensativo', img: '@/assets/gato pensativo.jpeg' },
  { id: 'pensativo', label: 'Raiva', img: '@/assets/gatodesconfiado.jpeg' }
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