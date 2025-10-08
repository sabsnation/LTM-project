<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
    <!-- Header -->
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <Brain class="w-8 h-8 text-purple-600 mr-3" />
          <h1 class="text-2xl font-bold text-gray-800">LetterMatter</h1>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-gray-700">Dr(a). <strong>{{ psychologistName }}</strong></span>
          <button @click="handleLogout" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Sair
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Consultas Hoje</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">5</p>
            </div>
            <Calendar class="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-pink-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Pacientes Ativos</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">28</p>
            </div>
            <Users class="w-10 h-10 text-pink-500" />
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-rose-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Pendências</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">3</p>
            </div>
            <AlertCircle class="w-10 h-10 text-rose-500" />
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-indigo-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Taxa de Sucesso</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">92%</p>
            </div>
            <TrendingUp class="w-10 h-10 text-indigo-500" />
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Agenda do Dia - 2 colunas -->
        <div class="md:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">Agenda de Hoje</h2>
            <button class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
              <Plus class="w-5 h-5" />
              Nova Consulta
            </button>
          </div>

          <div class="space-y-3">
            <div v-for="appointment in todayAppointments" :key="appointment.id"
              class="flex items-center justify-between p-4 border-l-4 rounded-r-xl"
              :class="appointment.status === 'em-andamento' ? 'border-green-500 bg-green-50' : 'border-purple-500 bg-purple-50'">
              <div class="flex items-center gap-4">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-800">{{ appointment.time }}</p>
                  <p class="text-xs text-gray-500">{{ appointment.duration }}</p>
                </div>
                <div class="h-12 w-px bg-gray-300"></div>
                <div>
                  <p class="font-semibold text-gray-800">{{ appointment.patient }}</p>
                  <p class="text-gray-600 text-sm">{{ appointment.type }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span :class="appointment.status === 'em-andamento' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'"
                      class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ appointment.statusText }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                  <FileText class="w-5 h-5 text-gray-600" />
                </button>
                <button class="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                  <MessageCircle class="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notificações - 1 coluna -->
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">Notificações</h2>
            <Bell class="w-6 h-6 text-purple-500" />
          </div>

          <div class="space-y-3">
            <div v-for="notification in notifications" :key="notification.id"
              class="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
              <div class="flex items-start gap-3">
                <div :class="notification.type === 'urgent' ? 'bg-red-500' : 'bg-purple-500'"
                  class="w-2 h-2 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 font-medium">{{ notification.title }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ notification.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Pacientes -->
        <div class="md:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">Pacientes Recentes</h2>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Buscar paciente..."
                class="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paciente</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Última Consulta</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Próxima</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="patient in patients" :key="patient.id" class="hover:bg-gray-50">
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-3">
                      <div class="bg-gradient-to-br from-purple-400 to-pink-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                        {{ patient.name.charAt(0) }}
                      </div>
                      <div>
                        <p class="font-semibold text-gray-800">{{ patient.name }}</p>
                        <p class="text-xs text-gray-500">{{ patient.id }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-600">{{ patient.lastSession }}</td>
                  <td class="px-4 py-4 text-sm text-gray-600">{{ patient.nextSession }}</td>
                  <td class="px-4 py-4">
                    <span :class="patient.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                      class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ patient.status }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <button class="text-purple-600 hover:text-purple-800 font-semibold text-sm">
                      Ver Prontuário
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Estatísticas -->
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Estatísticas</h2>
          
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">Consultas realizadas</span>
                <span class="text-sm font-bold text-gray-800">87%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style="width: 87%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">Taxa de presença</span>
                <span class="text-sm font-bold text-gray-800">92%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style="width: 92%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">Satisfação média</span>
                <span class="text-sm font-bold text-gray-800">4.8/5</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style="width: 96%"></div>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <p class="text-sm text-gray-700">
              <strong>Dica:</strong> Seus pacientes estão mostrando ótima evolução este mês! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Brain, Calendar, Users, AlertCircle, TrendingUp, Plus, FileText, MessageCircle, Bell, Search } from 'lucide-vue-next';

const router = useRouter();

const psychologistName = ref('Carlos Silva');

const todayAppointments = ref([
  { id: 1, time: '09:00', duration: '50min', patient: 'Maria Santos', type: 'Terapia Cognitiva', status: 'em-andamento', statusText: 'Em andamento' },
  { id: 2, time: '10:00', duration: '50min', patient: 'João Silva', type: 'Primeira Consulta', status: 'agendado', statusText: 'Agendado' },
  { id: 3, time: '14:00', duration: '50min', patient: 'Ana Costa', type: 'Acompanhamento', status: 'agendado', statusText: 'Agendado' },
  { id: 4, time: '15:00', duration: '50min', patient: 'Pedro Oliveira', type: 'Terapia Familiar', status: 'agendado', statusText: 'Agendado' },
  { id: 5, time: '16:00', duration: '50min', patient: 'Carla Mendes', type: 'Sessão de Grupo', status: 'agendado', statusText: 'Agendado' }
]);

const notifications = ref([
  { id: 1, title: 'Maria Santos cancelou consulta de amanhã', time: '5 min atrás', type: 'urgent' },
  { id: 2, title: 'Novo paciente aguardando aprovação', time: '1h atrás', type: 'normal' },
  { id: 3, title: 'Lembrete: Supervisão clínica às 18h', time: '2h atrás', type: 'normal' }
]);

const patients = ref([
  { id: '#001', name: 'Maria Santos', lastSession: '05/Out/2025', nextSession: '12/Out/2025', status: 'ativo' },
  { id: '#002', name: 'João Silva', lastSession: '06/Out/2025', nextSession: '13/Out/2025', status: 'ativo' },
  { id: '#003', name: 'Ana Costa', lastSession: '30/Set/2025', nextSession: '14/Out/2025', status: 'ativo' },
  { id: '#004', name: 'Pedro Oliveira', lastSession: '01/Out/2025', nextSession: '15/Out/2025', status: 'em espera' }
]);

const handleLogout = () => {
  // Aqui você limparia o token de autenticação do Firebase
  router.push('/');
};
</script>