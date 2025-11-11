<template>
  <div class="relative w-full h-screen overflow-hidden text-white fundo-personalizado">
    
    <!-- Botão de logout -->
    <button 
      @click="handleLogout"
      class="absolute top-6 left-6 p-2 bg-amber-700/50 hover:bg-amber-700 text-white rounded-full transition-colors border border-amber-500 z-20"
      title="Sair"
    >
      <LogOut class="w-5 h-5" />
    </button>
    
    <!-- Nome do usuário -->
    <header class="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
      <h2 class="text-3xl font-bold drop-shadow-lg">{{ userName }}</h2>
    </header>

    <!-- Vilinha principal -->
    <main class="relative w-full h-full z-10">
   <!-- SVG da Trilha que conecta as construções -->


<!-- Labels das construções -->
<div class="absolute bottom-16 left-24 text-center" style="width: 192px;">
  <p class="text-sm font-bold text-amber-900 drop-shadow-md">Torre do Conhecimento</p>
</div>

<div class="absolute bottom-28 left-1/2 transform -translate-x-1/2 text-center" style="width: 192px;">
  <p class="text-sm font-bold text-amber-900 drop-shadow-md">Seu Perfil</p>
</div>

<div class="absolute bottom-24 right-28 text-center" style="width: 224px;">
  <p class="text-sm font-bold text-amber-900 drop-shadow-md">Casa do Sábio</p>
</div>

<div class="absolute top-28 right-10 text-center">
  <p class="text-sm font-bold text-amber-900 drop-shadow-md">Criar Carta</p>
</div>
      
      <!-- Torre do Conhecimento -->
      <router-link
        to="/patient/knowledge-tower"
        class="absolute bottom-28 left-24 hover:scale-105 transition-transform duration-300"
      >
        <img
          src="@/assets/torre_do_conhecimento-removebg-preview.png"
          alt="Torre do Conhecimento"
          class="w-48 h-auto drop-shadow-lg hover:brightness-110"
        />
      </router-link>

      <!-- Casa do Sábio -->
      <router-link
        to="/patient/sage-house"
        class="absolute bottom-36 right-28 hover:scale-105 transition-transform duration-300"
      >
        <img
          src="@/assets/casa_do_sábio-removebg-preview.png"
          alt="Casa do Sábio"
          class="w-56 h-auto drop-shadow-lg hover:brightness-110"
        />
      </router-link>

      <!-- Minha Casa (Perfil) -->
      <div
        class="absolute bottom-40 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <router-link to="/patient/profile" class="hover:scale-105 transition-transform duration-300">
          <img
            src="@/assets/minha_casa-removebg-preview.png"
            alt="Minha Casa"
            class="w-48 h-auto drop-shadow-lg hover:brightness-110"
          />
        </router-link>

        <!-- Sino de notificações -->
        <router-link
          to="/patient/notifications"
          class="absolute -top-6 -right-6 transition-transform duration-300"
        >
          <div class="relative">
            <img
              src="@/assets/sino-removebg-preview.png"
              alt="Sino"
              class="w-14 h-14"
              :class="{ 'animate-bell': hasNotifications }"
            />
            <div 
              v-if="hasNotifications"
              class="absolute -top-1 -right-1 w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-amber-100 text-xs font-bold border-2 border-amber-400 shadow-md"
            >
              {{ notificationCount }}
            </div>
          </div>
        </router-link>
      </div>

      <!-- Botão Criar Carta (com efeito de “respirar”) -->
      <div class="absolute top-6 right-10">
        <router-link
          to="/patient/letters"
          class="hover:scale-110 transition-transform duration-300"
        >
          <img
            src="@/assets/escrever carta.png"
            alt="Criar Carta"
            class="w-20 h-20 drop-shadow-lg animate-breathe"
          />
        </router-link>
      </div>
    </main>

    <!-- Camada de brilho suave -->
    <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-gradient-move"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { logoutUser } from '@/firebase/authService';
import { getCurrentUserProfile } from '@/firebase/userProfileService';
import { getUserLetters } from '@/firebase/firestoreService';
import { getCurrentUser } from '@/firebase/authService';
import { hasPendingInvitations } from '@/firebase/invitationService';

const hasNotifications = ref(false);
const notificationCount = ref(0);
const router = useRouter();
const userName = ref("Carregando...");
let authUnsubscribe = null;

// Check for unlocked letters (letters with openDate in the past or no openDate)
const checkUnlockedLetters = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return 0;
    
    const letters = await getUserLetters(user.uid);
    const today = new Date();
    
    // Count letters that are ready to be opened (either no openDate or openDate in the past)
    const unlockedLetters = letters.filter(letter => {
      if (!letter.openDate) return true; // No open date means it's immediately available
      
      // Compare dates only (ignore time)
      const letterDate = new Date(letter.openDate);
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const letterDateOnly = new Date(letterDate.getFullYear(), letterDate.getMonth(), letterDate.getDate());
      
      return letterDateOnly <= todayDate;
    });
    
    return unlockedLetters.length;
  } catch (error) {
    console.error('Error checking unlocked letters:', error);
    return 0;
  }
};

// Check for psychologist link requests
const checkPsychologistLinkRequests = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return 0;

    // Check for pending invitations
    const hasInvites = await hasPendingInvitations(user.uid);
    return hasInvites ? 1 : 0; // Return 1 if there are pending invitations, 0 otherwise
    
  } catch (error) {
    console.error('Error checking psychologist link requests:', error);
    return 0;
  }
};

// Update notification count based on unlocked letters and psychologist link requests
const updateNotifications = async () => {
  try {
    const unlockedLettersCount = await checkUnlockedLetters();
    const psychologistRequestsCount = await checkPsychologistLinkRequests();
    
    const totalNotifications = unlockedLettersCount + psychologistRequestsCount;
    notificationCount.value = totalNotifications;
    hasNotifications.value = totalNotifications > 0;
    
    console.log(`Notificações atualizadas - Cartas desbloqueadas: ${unlockedLettersCount}, Solicitações de psicólogo: ${psychologistRequestsCount}, Total: ${totalNotifications}`);
  } catch (error) {
    console.error('Error updating notifications:', error);
    notificationCount.value = 0;
    hasNotifications.value = false;
  }
};

onMounted(async () => {
  // Load user profile
  try {
    console.log('Carregando perfil do usuário...');
    const profile = await getCurrentUserProfile();
    console.log('Perfil do usuário carregado:', profile);
    if (profile) {
      userName.value = profile.name || profile.email.split('@')[0];
      console.log('Nome do usuário definido como:', userName.value);
      
      // Check for notifications after loading profile
      await updateNotifications();
    } else {
      console.log('Nenhum perfil encontrado, redirecionando para login');
      // If no profile, redirect to login
      router.push('/login-paciente');
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    router.push('/login-paciente');
  }
});

// Update notifications when the component mounts
onMounted(updateNotifications);

onUnmounted(() => {
  if (authUnsubscribe) {
    authUnsubscribe();
  }
});

const handleLogout = async () => {
  try {
    console.log('Realizando logout...');
    await logoutUser();
    console.log('Logout realizado com sucesso');
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
/* 🔔 Animação do sino */
@keyframes bell-swing {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(15deg); }
  20% { transform: rotate(-10deg); }
  30% { transform: rotate(8deg); }
  40% { transform: rotate(-6deg); }
  50% { transform: rotate(4deg); }
  60% { transform: rotate(-2deg); }
  70% { transform: rotate(1deg); }
  100% { transform: rotate(0deg); }
}

.animate-bell {
  animation: bell-swing 1.5s ease-in-out infinite;
  transform-origin: top center;
}

/* 🌬️ Efeito de "respirar" da carta */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-breathe {
  animation: breathe 4s ease-in-out infinite;
}

/* ✨ Gradiente suave no fundo */
@keyframes gradient-move {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.animate-gradient-move {
  animation: gradient-move 6s ease-in-out infinite;
}

/* Fundo personalizado */
.fundo-personalizado {
  background-image: url('@/assets/fundo do usuario.jpg');
  background-size: cover;
  background-position: center;
}
</style>

