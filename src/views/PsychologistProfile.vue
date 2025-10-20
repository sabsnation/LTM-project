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
            <h2 class="text-2xl font-bold text-amber-900 mb-2">Dr. Nome do Psicólogo</h2>
            <p class="text-amber-800 mb-1">CRP: XX/XXXXX</p>
            <p class="text-amber-800 mb-4">Especialista em Saúde Mental</p>
            
            <div class="flex flex-wrap gap-4 justify-center md:justify-start">
              <div class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm">
                <p class="font-bold">120</p>
                <p class="text-sm">Pacientes</p>
              </div>
              <div class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm">
                <p class="font-bold">5+</p>
                <p class="text-sm">Anos de Experiência</p>
              </div>
              <div class="bg-amber-900 text-amber-100 px-4 py-2 rounded-sm">
                <p class="font-bold">98%</p>
                <p class="text-sm">Satisfação</p>
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
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">Nome Completo do Psicólogo</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Registro Profissional (CRP)</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">XX/XXXXX</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Especialidades</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">Terapia Cognitivo-Comportamental, Terapia de Casal</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Formação Acadêmica</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">Psicologia - Universidade X, Especialização em Y</p>
            </div>
          </div>
        </div>

        <div class="bg-amber-100 rounded-lg shadow-lg p-6 border border-amber-300">
          <h3 class="text-xl font-bold text-amber-900 mb-4">Configurações da Conta</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Email de Contato</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">sabio@curador.com</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Telefone</label>
              <p class="bg-amber-50 border border-amber-300 rounded-sm px-4 py-2">(00) 00000-0000</p>
            </div>
            
            <div>
              <label class="block text-amber-800 font-semibold mb-1">Biografia</label>
              <textarea 
                rows="4"
                class="w-full px-4 py-2 border-2 border-amber-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 bg-amber-50"
                placeholder="Escreva sobre sua prática e experiência..."
              >Psicólogo com mais de 5 anos de experiência em terapia cognitivo-comportamental. Especialista em ansiedade, depressão e terapias de casal. Acredito no poder da escuta ativa e no fortalecimento das habilidades emocionais como ferramentas para transformar vidas.</textarea>
            </div>
          </div>
          
          <button class="mt-6 w-full bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 py-3 rounded-sm font-semibold hover:from-amber-500 hover:to-amber-700 transition-all border border-amber-500">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente de Perfil do Psicólogo
// Aqui estarão as informações e configurações do perfil do psicólogo
</script>