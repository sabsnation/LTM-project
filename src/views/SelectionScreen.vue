<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="max-w-5xl w-full relative z-10">
      <div class="text-center mb-16">
        <div class="flex items-center justify-center mb-6">
          <Sparkles class="w-8 h-8 text-yellow-300 mr-3 animate-pulse" />
          <h1 class="text-6xl font-bold text-white tracking-tight">Letter Matter</h1>
          <Sparkles class="w-8 h-8 text-yellow-300 ml-3 animate-pulse" />
        </div>
        <p class="text-xl text-purple-100">Sua escrita é a chave da sua cura.</p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-8">
        <router-link
          to="/login-paciente"
          class="group bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/20"
        >
          <div class="flex flex-col items-center">
            <div class="bg-gradient-to-br from-cyan-400 to-blue-600 p-8 rounded-full mb-6 shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-500 group-hover:rotate-12">
              <User class="w-14 h-14 text-white" />
            </div>
            <h2 class="text-3xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">Usuário</h2>
            <p class="text-purple-100 text-center text-lg leading-relaxed">
              Acesse sua jornada de bem-estar e agende suas consultas com facilidade
            </p>
            <div class="mt-6 flex items-center text-cyan-300 font-semibold">
              <span>Entrar agora</span>
              <ArrowLeft class="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </router-link>

        <router-link
          to="/login-psicologo"
          class="group bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/20"
        >
          <div class="flex flex-col items-center">
            <div class="bg-gradient-to-br from-pink-400 to-purple-600 p-8 rounded-full mb-6 shadow-lg group-hover:shadow-pink-500/50 transition-all duration-500 group-hover:rotate-12">
              <Brain class="w-14 h-14 text-white" />
            </div>
            <h2 class="text-3xl font-bold text-white mb-4 group-hover:text-pink-300 transition-colors">Psicólogo</h2>
            <p class="text-purple-100 text-center text-lg leading-relaxed">
              Portal profissional para gerenciar seus pacientes e consultório
            </p>
            <div class="mt-6 flex items-center text-pink-300 font-semibold">
              <span>Acessar área</span>
              <ArrowLeft class="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Brain, ArrowLeft, Sparkles } from 'lucide-vue-next';

// MUDANÇA AQUI: Não precisamos mais do defineEmits, pois o router-link cuida da navegação.
</script>