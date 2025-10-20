<template>
  <div class="relative w-full h-screen overflow-hidden text-white fundo-personalizado">
    
    <!-- Nome do usuário -->
    <header class="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
      <h2 class="text-3xl font-bold drop-shadow-lg">{{ userName }}</h2>
    </header>

    <!-- Vilinha principal -->
    <main class="relative w-full h-full z-10">
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

const hasNotifications = ref(false);

onMounted(() => {
  setTimeout(() => {
    hasNotifications.value = true;
  }, 3000);
});

const userName = ref("Sabsy Brazz");
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

