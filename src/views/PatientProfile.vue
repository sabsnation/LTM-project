<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-amber-900">Seu Perfil</h1>
        <router-link 
          to="/patient/dashboard" 
          class="bg-amber-700 text-amber-100 px-4 py-2 rounded-sm hover:bg-amber-600 transition-colors border border-amber-500"
        >
          Voltar
        </router-link>
      </div>
      
      <div class="bg-amber-100 rounded-lg shadow-lg p-8 mb-8 border border-amber-300">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="bg-amber-200 p-2 rounded-full border-4 border-amber-300">
            <img 
              src="@/assets/gato perfil.webp" 
              alt="Imagem do Paciente" 
              class="w-32 h-32 rounded-full object-cover border-2 border-amber-400"
            />
          </div>
          
          <div class="text-center md:text-left">
            <h2 class="text-2xl font-bold text-amber-900 mb-2">{{ userProfile.name || 'Carregando...' }}</h2>
            <p class="text-amber-800 mb-1">ID: {{ userProfile.id || 'N/A' }}</p>
            <p class="text-amber-800 mb-4">{{ userProfile.role === 'patient' ? 'Paciente' : 'Usuário Comum' }}</p>
            
            <div class="flex flex-wrap gap-4 justify-center md:justify-start">
              <div class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm">
                <p class="font-bold">{{ lettersCount }}</p>
                <p class="text-sm">Cartas Escritas</p>
              </div>
              <div class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm">
                <p class="font-bold">{{ userProfile.age || 'N/A' }}</p>
                <p class="text-sm">Anos</p>
              </div>
              <div class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm">
                <p class="font-bold">{{ userProfile.progress || '0' }}%</p>
                <p class="text-sm">Progresso</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-amber-100 rounded-lg shadow-lg p-6 border border-amber-300">
        <h3 class="text-xl font-bold text-amber-900 mb-4">Informações Pessoais</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Nome Completo</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2 text-amber-900">{{ userProfile.name || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Idade</label>
              <input 
                v-model.number="editingProfile.age" 
                type="number" 
                min="1" 
                max="120"
                class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50"
                placeholder="Digite sua idade"
              />
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Data de Nascimento</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2 text-amber-900">{{ formatBirthDate(userProfile.birthDate) || 'Não informada' }}</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Email</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2 text-amber-900">{{ userProfile.email || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Biografia</label>
              <textarea 
                v-model="editingProfile.bio"
                rows="4"
                class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50"
                placeholder="Escreva sobre você, sua jornada e objetivos..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Data de Registro</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2 text-amber-900">{{ formatDate(userProfile.createdAt) || 'N/A' }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <button 
            @click="saveProfile"
            :disabled="saving"
            class="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 py-3 rounded-sm font-semibold hover:from-amber-500 hover:to-amber-700 transition-all border border-amber-500 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUserProfile, updateCurrentUserProfile } from '@/firebase/userProfileService';
import { getUserLetters } from '@/firebase/firestoreService';

// Dados do usuário
const userProfile = ref({
  name: '',
  email: '',
  age: null,
  birthDate: '',
  bio: '',
  role: '',
  progress: 0,
  createdAt: null
});

// Dados para edição
const editingProfile = ref({
  age: null,
  bio: ''
});

const lettersCount = ref(0);
const saving = ref(false);

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

// Função para formatar data de nascimento
const formatBirthDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('pt-BR');
};

// Função para salvar o perfil
const saveProfile = async () => {
  if (saving.value) return;
  
  saving.value = true;
  
  try {
    console.log('Salvando perfil com dados:', editingProfile.value);
    
    // Atualizar apenas os campos que estão sendo editados
    const updates = {};
    if (editingProfile.value.age !== undefined && editingProfile.value.age !== null) {
      updates.age = editingProfile.value.age;
    }
    if (editingProfile.value.bio) {
      updates.bio = editingProfile.value.bio.trim();
    }
    
    await updateCurrentUserProfile(updates);
    
    // Atualizar o perfil principal com os novos dados
    userProfile.value.age = editingProfile.value.age;
    userProfile.value.bio = editingProfile.value.bio;
    
    alert('Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    alert('Erro ao salvar perfil. Por favor, tente novamente.');
  } finally {
    saving.value = false;
  }
};

// Carregar perfil do usuário ao montar o componente
onMounted(async () => {
  try {
    console.log('Carregando perfil do usuário...');
    const profile = await getCurrentUserProfile();
    console.log('Perfil carregado:', profile);
    
    if (profile) {
      // Copiar os dados do perfil para o estado reativo
      userProfile.value = {
        ...profile,
        name: profile.name || profile.email?.split('@')[0] || 'Usuário',
        email: profile.email || 'N/A',
        age: profile.age || null,
        birthDate: profile.birthDate || '',
        bio: profile.bio || '',
        role: profile.role || 'patient',
        progress: profile.progress || 0,
        createdAt: profile.createdAt
      };
      
      // Atualizar os dados de edição com os valores atuais
      editingProfile.value = {
        age: profile.age || null,
        bio: profile.bio || ''
      };
      
      // Carregar a contagem de cartas
      loadLettersCount();
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
});

// Função para carregar a contagem de cartas
const loadLettersCount = async () => {
  try {
    console.log('Carregando contagem de cartas...');
    const letters = await getUserLetters(userProfile.value.id);
    lettersCount.value = letters.length;
    console.log('Número de cartas:', lettersCount.value);
  } catch (error) {
    console.error('Erro ao carregar cartas:', error);
    lettersCount.value = 0;
  }
};
</script>