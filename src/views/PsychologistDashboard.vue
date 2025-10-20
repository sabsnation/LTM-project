<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 font-serif">
    <div class="flex justify-end p-4">
      <button 
        @click="handleLogout"
        class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm hover:bg-amber-800 transition-colors border border-amber-700">
        Sair
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  // Aqui você limparia o token de autenticação do Firebase
  router.push('/');
};
</script>