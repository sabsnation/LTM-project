<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-200 via-pink-200 to-purple-300">
    <div class="max-w-lg w-full bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Notificações 🔔</h1>

      <div v-if="notifications.length > 0" class="space-y-4">
        <div
          v-for="(note, index) in notifications"
          :key="index"
          class="p-4 bg-gradient-to-r from-orange-100 to-rose-100 rounded-xl shadow-md text-left"
        >
          <h2 class="font-semibold text-gray-800">{{ note.title }}</h2>
          <p class="text-sm text-gray-600">{{ note.message }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ note.date }}</p>
        </div>
      </div>

      <div v-else class="text-gray-600 italic">Nenhuma notificação no momento.</div>

      <router-link
        to="/patient/dashboard"
        class="inline-block mt-8 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:scale-105 transition-transform"
      >
        Voltar à Vila
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const notifications = ref([
  {
    title: "Nova Carta Recebida 💌",
    message: "Você recebeu uma nova carta de reflexão enviada por seu psicólogo.",
    date: "19 de outubro de 2025"
  },
  {
    title: "Lembrete de Sessão 🧠",
    message: "Sua próxima sessão está marcada para amanhã às 14h.",
    date: "19 de outubro de 2025"
  }
])
</script>

<style scoped>
body {
  overflow: hidden;
}
</style>
