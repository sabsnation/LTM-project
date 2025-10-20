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
<svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 5;">
  <!-- Trilha completa ondulada da Torre até Casa do Sábio -->
  <path 
    d="M 200 610 Q 300 620, 400 615 Q 500 610, 600 625 Q 700 640, 800 635 Q 900 630, 1000 640 Q 1100 650, 1200 640 Q 1300 630, 1380 635"
    stroke="#A0826D" 
    stroke-width="35" 
    fill="none" 
    opacity="0.5"
    stroke-linecap="round"
  />
  <!-- Contorno escuro da trilha -->
  <path 
    d="M 200 610 Q 300 620, 400 615 Q 500 610, 600 625 Q 700 640, 800 635 Q 900 630, 1000 640 Q 1100 650, 1200 640 Q 1300 630, 1380 635"
    stroke="#6B5744" 
    stroke-width="40" 
    fill="none" 
    opacity="0.3"
    stroke-linecap="round"
  />

  <!-- Detalhes decorativos: pequenas pedras/pegadas ao longo da trilha -->
  <g opacity="0.4" fill="#5C4A3A">
    <circle cx="300" cy="620" r="4"/>
    <circle cx="350" cy="617" r="3"/>
    <circle cx="450" cy="612" r="4"/>
    <circle cx="550" cy="616" r="3"/>
    <circle cx="650" cy="630" r="4"/>
    <circle cx="750" cy="638" r="3"/>
    <circle cx="850" cy="633" r="4"/>
    <circle cx="950" cy="632" r="3"/>
    <circle cx="1050" cy="643" r="4"/>
    <circle cx="1150" cy="647" r="3"/>
    <circle cx="1250" cy="638" r="4"/>
    <circle cx="1320" cy="633" r="3"/>
  </g>
</svg>

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
          class="absolute -top-4 -right-8 transition-transform duration-300"
        >
          <img
            src="@/assets/sino-removebg-preview.png"
            alt="Sino"
            class="w-12 h-12"
            :class="{ 'animate-bell': hasNotifications }"
          />
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
import { ref, onMounted } from "vue";
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const hasNotifications = ref(false);
const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    hasNotifications.value = true;
  }, 3000);
});

const userName = ref("Sabsy Brazz");

const handleLogout = () => {
  router.push('/');
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

