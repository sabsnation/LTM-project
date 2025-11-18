<template>
  <div 
    :class="isDarkMode ? 'relative w-full h-screen overflow-hidden text-white dark-mode-background' : 'relative w-full h-screen overflow-hidden text-white fundo-personalizado'"
  >

    <!-- Nuvens flutuantes ao fundo -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <img
        src="@/assets/nuvem.png"
        alt="Nuvem pequena"
        class="absolute top-1/4 opacity-40 animate-float"
        style="width: 80px; left: -80px; animation-duration: 40s;"
      />
      <img
        src="@/assets/nuvem.png"
        alt="Nuvem média"
        class="absolute top-1/3 opacity-45 animate-float"
        style="width: 120px; left: -120px; animation-duration: 35s; animation-delay: 3s;"
      />
      <img
        src="@/assets/nuvem.png"
        alt="Nuvem grande"
        class="absolute top-1/2 opacity-40 animate-float"
        style="width: 160px; left: -160px; animation-duration: 45s; animation-delay: 6s;"
      />
      <img
        src="@/assets/nuvem.png"
        alt="Nuvem média 2"
        class="absolute top-1/5 opacity-45 animate-float"
        style="width: 100px; left: -100px; animation-duration: 50s; animation-delay: 9s;"
      />
      <img
        src="@/assets/nuvem.png"
        alt="Nuvem pequena 2"
        class="absolute top-2/3 opacity-40 animate-float"
        style="width: 70px; left: -70px; animation-duration: 40s; animation-delay: 12s;"
      />
       <img
        src="@/assets/nuvem.png"
        alt="Nuvem média 2"
        class="absolute top-1/5 opacity-40 animate-float"
        style="width: 100px; left: -100px; animation-duration: 50s; animation-delay: 9s;"
      />
      <img
        src="@/assets/nuvem.png"
        alt="Nuvem pequena 2"
        class="absolute top-2/3 opacity-40 animate-float"
        style="width: 70px; left: -70px; animation-duration: 40s; animation-delay: 12s;"
      />
      <img
        src="@/assets/nuvem.png"
        alt="Nuvem grande 2"
        class="absolute top-3/4 opacity-40 animate-float"
        style="width: 140px; left: -140px; animation-duration: 42s; animation-delay: 15s;"
      />
    </div>
    
    <!-- Botão de logout -->
    <button 
      @click="handleLogout"
      class="absolute top-6 left-6 p-2 bg-amber-700/50 hover:bg-amber-700 text-white rounded-full transition-colors border border-amber-500 z-20"
      title="Sair"
    >
      <LogOut class="w-5 h-5" />
    </button>
    
    <!-- Imagem papel-fundo-cima no canto superior esquerdo -->
    <img
      src="@/assets/papel-fundo-cima.png"
      alt="Papel fundo cima"
      class="absolute top-0 left-0 w-40 h-auto z-10"
    />
    
    <!-- Contêiner para sol e lua com animação de transição -->
    <div class="absolute top-0 left-0" style="margin-top: 10px; margin-left: 10px; z-index: 40; width: 8rem; height: auto;">
      <!-- Sol e Lua - ambos no DOM para permitir animações -->
      <img
        v-if="showSol"
        src="@/assets/sol.png"
        alt="Sol"
        class="w-32 h-auto absolute top-0 left-0"
        :class="{ 'animate-sol-descendo': shouldAnimateSol }"
        @animationend="onSolAnimationEnd"
      />
      <img
        v-if="showLua"
        src="@/assets/lua.png"
        alt="Lua"
        class="w-28 h-auto absolute top-0 left-0"
        :class="{ 'animate-lua-descendo': shouldAnimateLua }"
        @animationend="onLuaAnimationEnd"
      />
    </div>
    
    <!-- Imagem papel-fundo-baixo no canto inferior direito -->
    <img
      src="@/assets/papel-fundo-baixo.png"
      alt="Papel fundo baixo"
      class="absolute bottom-0 right-0 w-60 h-auto z-10"
    />
    
    <!-- Nome do usuário e mensagem de boas-vindas -->
    <div class="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 text-center pt-4">
      <h2 
        ref="userNameRef"
        class="text-4xl font-bold drop-shadow-lg text-amber-100 whitespace-nowrap mb-2"
        :style="userNameStyle"
      >
        {{ userName }}
      </h2>
      <p class="text-xl font-bold drop-shadow-lg text-amber-200">
        bem vindo a sua nova vila.
      </p>
    </div>

    <!-- Vilinha principal -->
    <main class="relative w-full h-full z-10">
   
<!-- Labels das construções -->
<div class="absolute bottom-16 left-24 text-center" style="width: 192px;">
  <p class="text-sm font-bold text-amber-900 drop-shadow-md">Biblioteca</p>
</div>

<div class="absolute bottom-28 left-1/2 transform -translate-x-1/2 text-center" style="width: 192px;">
  <p class="text-sm font-bold text-amber-900 drop-shadow-md">Sua casa</p>
</div>

<div class="absolute bottom-24 right-28 text-center" style="width: 224px;">
  <p class="text-sm font-bold text-amber-900 drop-shadow-md">Casa do Sábio</p>
</div>

<div class="absolute top-28 right-10 text-center">
  <p class="text-sm font-bold text-amber-900 drop-shadow-md">Criar Carta</p>
</div>
      
      <!-- Biblioteca -->
      <router-link
        to="/patient/village-library"
        class="absolute bottom-28 left-24 hover:scale-105 transition-transform duration-300"
      >
        <!-- Aumentado de w-48 para w-64 -->
        <img
          src="@/assets/torre_do_conhecimento-removebg-preview.png"
          alt="Biblioteca"
          class="w-64 h-auto drop-shadow-lg hover:brightness-110"
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

      <!-- Botão Criar Carta (com efeito de "respirar") -->
      <div class="absolute top-6 right-10">
        <router-link
          to="/patient/letters"
          class="hover:scale-110 transition-transform duration-300"
        >
          <img
            src="@/assets/criar_carta-removebg-preview.png"
            alt="Criar Carta"
            class="w-20 h-20 drop-shadow-lg animate-breathe"
          />
        </router-link>
      </div>
    </main>

    <!-- Camada de brilho suave -->
    <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-gradient-move"></div>
    
    <!-- Luz na extrema esquerda da tela, centralizada verticalmente, levemente fora da tela à esquerda -->
    <div class="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 w-32 h-32">
      <div 
        :class="isDarkMode ? 
          'absolute inset-0 bg-blue-300 rounded-full filter blur-3xl opacity-30 w-full h-full -left-12 -top-12' : 
          'absolute inset-0 bg-yellow-300 rounded-full filter blur-3xl opacity-30 animate-pulse w-full h-full -left-12 -top-12'"
      ></div>
      <img
        src="@/assets/luz.png"
        alt="Luz"
        class="absolute -left-4 top-1/2 transform -translate-y-1/2 w-28 h-28 object-contain z-50 cursor-pointer"
        @click="toggleDarkMode"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { logoutUser } from '@/firebase/authService';
import { getCurrentUserProfile } from '@/firebase/userProfileService';
import { getUserLetters } from '@/firebase/firestoreService';
import { getCurrentUser } from '@/firebase/authService';
import { hasPendingInvitations } from '@/firebase/invitationService';

// Estados para controlar o modo escuro e transições
const isDarkMode = ref(false);
const showSol = ref(true);
const showLua = ref(false);
const shouldAnimateSol = ref(false);
const shouldAnimateLua = ref(false);
const hasNotifications = ref(false);
const notificationCount = ref(0);
const router = useRouter();
const userName = ref("Carregando...");
const userNameRef = ref(null);
let authUnsubscribe = null;

// Função para alternar entre sol e lua (modo claro/escuro) com animação
const toggleDarkMode = () => {
  if (!isDarkMode.value) {
    // Ativando modo escuro: sol desce, lua aparece do topo
    shouldAnimateSol.value = true;
    setTimeout(() => {
      showSol.value = false;
      showLua.value = true;
      shouldAnimateLua.value = true;
    }, 10); // Pequeno delay para garantir que a animação comece
  } else {
    // Desativando modo escuro: lua desce, sol aparece do topo
    shouldAnimateLua.value = true;
    setTimeout(() => {
      showLua.value = false;
      showSol.value = true;
      shouldAnimateSol.value = true;
    }, 10); // Pequeno delay para garantir que a animação comece
  }
  
  // Alternar o modo
  isDarkMode.value = !isDarkMode.value;
};

// Funções para lidar com o fim das animações
const onSolAnimationEnd = () => {
  shouldAnimateSol.value = false;
};

const onLuaAnimationEnd = () => {
  shouldAnimateLua.value = false;
};

// Função para calcular o estilo do nome do usuário com base no comprimento
const userNameStyle = computed(() => {
  if (!userName.value || userName.value === "Carregando...") {
    return { fontSize: '2.5rem' }; // text-4xl
  }
  
  const nameLength = userName.value.length;
  if (nameLength > 30) {
    return { fontSize: '1.5rem' }; // text-xl - tamanho menor para nomes muito longos
  } else if (nameLength > 20) {
    return { fontSize: '1.75rem' }; // text-2xl - tamanho médio para nomes longos
  } else if (nameLength > 15) {
    return { fontSize: '2rem' }; // text-3xl - tamanho grande para nomes médios
  } else {
    return { fontSize: '2.5rem' }; // text-4xl - tamanho padrão para nomes curtos
  }
});

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

/* ☁️ Animação universal das nuvens */
@keyframes float {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 200px));
  }
}

.animate-float {
  animation: float linear infinite;
}

/* Fundo personalizado (modo claro) */
.fundo-personalizado {
  background-image: url('@/assets/fundo do usuario.jpg');
  background-size: cover;
  background-position: center;
}

/* Fundo para modo escuro */
.dark-mode-background {
  background: linear-gradient(135deg, #2d2d5a 0%, #1a1a2e 50%, #16213e 100%), url('@/assets/fundo do usuario.jpg') center/cover;
}

/* Animações para transição entre sol e lua */
@keyframes sol-descendo {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100vh);
    opacity: 0;
  }
}

@keyframes lua-descendo {
  from {
    transform: translateY(-100vh);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-sol-descendo {
  animation: sol-descendo 0.8s ease-in-out forwards;
}

.animate-lua-descendo {
  animation: lua-descendo 0.8s ease-in-out forwards;
}

</style>
