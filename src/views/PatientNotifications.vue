<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-amber-900">Pergaminhos de Notificação</h1>
        <router-link 
          to="/patient/dashboard" 
          class="bg-amber-700 text-amber-100 px-4 py-2 rounded-sm hover:bg-amber-600 transition-colors border border-amber-500"
        >
          Voltar
        </router-link>
      </div>
      
      <div class="space-y-4">
        <div 
          v-for="(notification, index) in notifications" 
          :key="index"
          class="bg-amber-50 rounded-lg shadow-lg p-6 border border-amber-300"
        >
          <div class="flex items-start">
            <img 
              :src="getNotificationIcon(notification.type)" 
              :alt="notification.type" 
              class="w-12 h-12 mr-4"
            />
            <div class="flex-1">
              <h2 class="text-xl font-bold text-amber-900">{{ notification.title }}</h2>
              <p class="text-amber-800 mt-2">{{ notification.message }}</p>
              <p class="text-sm text-amber-700 mt-2">{{ notification.date }}</p>
              <div class="mt-3 flex gap-2">
                <button
                  v-if="notification.type === 'letter'"
                  @click="openLetter(notification.letterId)"
                  class="text-sm bg-amber-600 text-white px-3 py-1 rounded-sm hover:bg-amber-700 transition-colors"
                >
                  Acessar Carta
                </button>
                <button
                  v-if="notification.type === 'psychologist_invite'"
                  @click="acceptPsychologistInvite(notification.inviteId)"
                  class="text-sm bg-amber-600 text-white px-3 py-1 rounded-sm hover:bg-amber-700 transition-colors mr-2"
                >
                  Aceitar Convite
                </button>
                <button
                  v-if="notification.type === 'psychologist_invite'"
                  @click="declinePsychologistInvite(notification.inviteId)"
                  class="text-sm bg-amber-200 text-amber-800 px-3 py-1 rounded-sm hover:bg-amber-300 transition-colors"
                >
                  Recusar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div 
          v-if="notifications.length === 0" 
          class="text-center py-12 bg-amber-50 rounded-lg shadow-lg border border-amber-300"
        >
          <img 
            src="@/assets/pergaminho.png" 
            alt="Pergaminho Vazio" 
            class="w-16 h-16 mx-auto mb-4 opacity-50"
          />
          <p class="text-amber-800 italic">Nenhum pergaminho de notificação no momento.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { getCurrentUser } from '@/firebase/authService';
import { getCurrentUserProfile } from '@/firebase/userProfileService';
import { getUserLetters } from '@/firebase/firestoreService';
import { getInvitationsByPatientId, acceptInvitation, declineInvitation } from '@/firebase/invitationService';
import cartaIcon from '@/assets/criar_carta-removebg-preview.png';
import sinoIcon from '@/assets/sino-removebg-preview.png';
import livroIcon from '@/assets/livro-.png';

const router = useRouter();
const notifications = ref([]);

// Function to get appropriate icon based on notification type
const getNotificationIcon = (type) => {
  switch(type) {
    case 'letter':
      return cartaIcon;
    case 'psychologist_invite':
      return sinoIcon;
    case 'session_reminder':
    case 'general':
    default:
      return livroIcon;
  }
};

// Function to check for unlocked letters
const checkUnlockedLetters = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const letters = await getUserLetters(user.uid);
    const today = new Date();
    
    // Filter letters that are ready to be opened
    const unlockedLetters = letters.filter(letter => {
      if (!letter.openDate) return true;
      const letterDate = letter.openDate.toDate ? letter.openDate.toDate() : new Date(letter.openDate);
      return letterDate <= today;
    });
    
    return unlockedLetters.map(letter => ({
      type: 'letter',
      title: `Carta Desbloqueada: ${letter.title}`,
      message: `Sua carta "${letter.title}" está pronta para ser lida!`,
      date: formatDate(letter.openDate),
      notificationDate: letter.openDate.toDate ? letter.openDate.toDate() : new Date(letter.openDate),
      letterId: letter.id
    }));
  } catch (error) {
    console.error('Error checking unlocked letters:', error);
    return [];
  }
};

// Function to check for psychologist link invitations
const checkPsychologistInvites = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const invitations = await getInvitationsByPatientId(user.uid);
    const pendingInvites = invitations.filter(inv => inv.status === 'pending');

    return pendingInvites.map(invite => ({
      type: 'psychologist_invite',
      title: 'Convite para Vincular-se a um Psicólogo',
      message: `Você recebeu um convite para se vincular ao psicólogo: ${invite.therapistName || 'Psicólogo'}`,
      date: formatDate(invite.createdAt),
      notificationDate: invite.createdAt.toDate ? invite.createdAt.toDate() : new Date(invite.createdAt),
      inviteId: invite.id
    }));
  } catch (error) {
    console.error('Error checking psychologist invites:', error);
    return [];
  }
};

// Format date for display
const formatDate = (date) => {
  if (!date) return 'N/A';
  // Check if it's a Firebase Timestamp
  if (date && typeof date.toDate === 'function') {
    return date.toDate().toLocaleDateString('pt-BR');
  }
  // Check if it's a Date object
  if (date instanceof Date) {
    return date.toLocaleDateString('pt-BR');
  }
  // Check if it's a string
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('pt-BR');
  }
  return 'N/A';
};

// Function to open a letter
const openLetter = (letterId) => {
  console.log(`Opening letter with ID: ${letterId}`);
  router.push(`/patient/letters/${letterId}`);
};

// Function to accept psychologist invite
const acceptPsychologistInvite = async (inviteId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    await acceptInvitation(inviteId, user.uid);
    alert('Convite aceito com sucesso! Você agora está vinculado ao psicólogo.');

    await loadNotifications();
  } catch (error) {
    console.error('Error accepting psychologist invite:', error);
    alert('Erro ao aceitar convite de psicólogo: ' + error.message);
  }
};

// Function to decline psychologist invite
const declinePsychologistInvite = async (inviteId) => {
  try {
    await declineInvitation(inviteId);
    alert('Convite recusado com sucesso.');

    await loadNotifications();
  } catch (error) {
    console.error('Error declining psychologist invite:', error);
    alert('Erro ao recusar convite de psicólogo: ' + error.message);
  }
};

// Function to load all notifications
const loadNotifications = async () => {
  const unlockedLetters = await checkUnlockedLetters();
  const psychologistInvites = await checkPsychologistInvites();
  
  const allNotifications = [
    ...unlockedLetters,
    ...psychologistInvites
  ];

  // Sort notifications by notificationDate in descending order (newest first)
  allNotifications.sort((a, b) => b.notificationDate - a.notificationDate);
  
  notifications.value = allNotifications;
};

// Load notifications on component mount
onMounted(async () => {
  await loadNotifications();
});
</script>