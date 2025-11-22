<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-amber-50 rounded-sm shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col border border-amber-300">
      <div class="bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-amber-100">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">Vincular ao Sábio</h2>
          <button @click="$emit('close')" class="hover:bg-amber-700 hover:bg-opacity-20 p-2 rounded-full transition-all">
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <div class="p-6 overflow-y-auto flex-grow">
        <p class="text-amber-800 mb-4">Insira o código de vínculo fornecido pelo sábio para estabelecer o vínculo entre vocês.</p>
        
        <form @submit.prevent="submitLinkRequest">
          <div class="mb-4">
            <label class="block text-amber-800 font-semibold mb-2">Código do Sábio</label>
            <input 
              v-model="codeInput" 
              type="text" 
              class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50 uppercase"
              placeholder="Digite o código do sábio"
              required
            />
          </div>

          <div v-if="error" class="text-red-500 text-sm mb-4">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 rounded-sm font-semibold hover:from-amber-500 hover:to-amber-700 transition-all border border-amber-500 disabled:opacity-50"
          >
            <span v-if="!loading">Enviar Pedido de Vínculo</span>
            <span v-else>Processando...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { getCurrentUser } from '@/firebase/authService';
import { getTherapistByCode } from '@/firebase/userProfileService';
import { createInvitation } from '@/firebase/invitationService';

const emit = defineEmits(['close']);
const codeInput = ref('');
const error = ref('');
const loading = ref(false);

const submitLinkRequest = async () => {
  if (!codeInput.value.trim()) {
    error.value = 'Por favor, digite o código do sábio.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Obter o perfil do usuário para obter informações necessárias
    const { getCurrentUserProfile } = await import('@/firebase/userProfileService');
    const userInfo = await getCurrentUserProfile();

    // Procurar pelo psicólogo usando o código de vínculo
    const therapist = await getTherapistByCode(codeInput.value.trim().toUpperCase());
    if (!therapist) {
      throw new Error('Código de sábio inválido. Por favor, verifique o código e tente novamente.');
    }

    // Criar um convite/pedido de vínculo
    const invitationData = {
      id: `${user.uid}_${therapist.id}_${Date.now()}`, // ID único
      patientId: user.uid,
      therapistId: therapist.id,
      patientName: userInfo.name || userInfo.email.split('@')[0],
      therapistName: therapist.name || 'Sábio',
      status: 'pending',
      createdAt: new Date()
    };

    await createInvitation(invitationData);

    alert('Pedido de vínculo enviado com sucesso! O sábio receberá sua solicitação nas notificações.');
    emit('close');
  } catch (err) {
    console.error('Erro ao enviar pedido de vínculo:', err);
    error.value = err.message || 'Erro ao enviar pedido de vínculo. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};
</script>