<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-amber-900">Perfil do Sábio</h1>
        <router-link 
          to="/psychologist/dashboard" 
          class="bg-amber-700 text-amber-100 px-4 py-2 rounded-sm hover:bg-amber-600 transition-colors border border-amber-500"
        >
          Voltar
        </router-link>
      </div>
      
      <div class="bg-amber-100 rounded-lg shadow-lg p-8 mb-8 border border-amber-300">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="bg-amber-200 p-2 rounded-full border-4 border-amber-300">
            <img 
              src="@/assets/sábio.jpeg" 
              alt="Foto do Sábio" 
              class="w-32 h-32 rounded-full object-cover border-2 border-amber-400"
            />
          </div>
          
          <div class="text-center md:text-left">
            <h2 class="text-2xl font-bold text-amber-900 mb-2">{{ userName }}</h2>
            <p class="text-amber-800 mb-1">CRP: {{ crp }}</p>
            <p class="text-amber-800 mb-4">Especialista em Saúde Mental</p>
            
            <div class="flex flex-wrap gap-4 justify-center md:justify-start">
              <div class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm text-center">
                <p class="font-bold text-lg">{{ linkedPatientsCount }}</p>
                <p class="text-sm">Pacientes</p>
              </div>
              <div class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm text-center">
                <input 
                  type="number"
                  min="0"
                  v-model="yearsOfExperience" 
                  class="font-bold text-lg bg-transparent text-amber-100 w-20 text-center outline-none border-b-2 border-amber-400 focus:border-amber-200 transition-colors"
                />
                <p class="text-sm">Anos de Experiência</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-amber-100 rounded-lg shadow-lg p-6 border border-amber-300">
          <h3 class="text-xl font-bold text-amber-900 mb-4">Informações Profissionais</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Nome Completo</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">{{ userName }}</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Registro Profissional (CRP)</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">{{ crp }}</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Especialidades</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">{{ specialties.join(', ') || 'Não informado' }}</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Formação Acadêmica</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">{{ education }}</p>
            </div>
          </div>
        </div>

        <div class="bg-amber-100 rounded-lg shadow-lg p-6 border border-amber-300">
          <h3 class="text-xl font-bold text-amber-900 mb-4">Configurações da Conta</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Email de Contato</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">{{ userEmail }}</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Telefone</label>
               <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">{{ phoneNumber }}</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Biografia</label>
              <textarea 
                v-model="biography"
                rows="4"
                class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50"
                placeholder="Escreva sobre sua prática e experiência..."
              ></textarea>
            </div>
          </div>
          
          <button 
            @click="handleSaveProfile"
            class="mt-6 w-full bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 py-3 rounded-sm font-semibold hover:from-amber-500 hover:to-amber-700 transition-all border border-amber-500"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getLinkedPatients } from '@/firebase/userProfileService';
import { getTherapistById, updateTherapist } from '@/firebase/firestoreService';
import { getCurrentUser } from '@/firebase/authService';

// Variáveis reativas
const userName = ref('Carregando...');
const crp = ref('Não informado');
const specialties = ref([]);
const education = ref('Não informado');
const userEmail = ref('');
const phoneNumber = ref('(00) 00000-0000');
const biography = ref('');
const linkedPatientsCount = ref(0);
const yearsOfExperience = ref(0);

let userId = null;

// Carregar as informações do perfil ao montar o componente
onMounted(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.error('Nenhum usuário autenticado');
      return;
    }
    userId = user.uid; // Armazena o ID do usuário

    // Armazenar o email do usuário
    userEmail.value = user.email || 'Email não fornecido';

    // Carregar informações específicas do psicólogo do documento 'therapists'
    const therapistProfile = await getTherapistById(userId);
    if (therapistProfile) {
      userName.value = therapistProfile.name || user.email.split('@')[0];
      crp.value = therapistProfile.crp || 'Não informado';
      specialties.value = therapistProfile.specialties || [];
      education.value = therapistProfile.education || 'Informação não fornecida';
      biography.value = therapistProfile.biography || 'Escreva sobre sua prática e experiência...';
      yearsOfExperience.value = therapistProfile.yearsOfExperience || 0;
      // O número de telefone pode vir do perfil do terapeuta também
      phoneNumber.value = therapistProfile.phoneNumber || '(00) 00000-0000';
    }

    // Carregar a contagem de pacientes vinculados
    const patients = await getLinkedPatients(userId);
    linkedPatientsCount.value = patients.length;

  } catch (error) {
    console.error('Erro ao carregar perfil do psicólogo:', error);
    userName.value = 'Erro ao carregar';
  }
});

// Função para salvar o perfil
const handleSaveProfile = async () => {
  if (!userId) {
    alert('Erro: ID do usuário não encontrado.');
    return;
  }
  
  const exp = Number(yearsOfExperience.value);
  if (exp < 0) {
    alert('Os anos de experiência não podem ser um número negativo.');
    yearsOfExperience.value = 0; // Reseta para 0
    return;
  }

  try {
    const dataToUpdate = {
      biography: biography.value,
      yearsOfExperience: exp,
    };
    await updateTherapist(userId, dataToUpdate);
    alert('Perfil salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar o perfil:', error);
    alert('Ocorreu um erro ao salvar o perfil.');
  }
};
</script>