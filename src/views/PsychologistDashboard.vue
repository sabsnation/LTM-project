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
    
    <!-- Nome do psicólogo e mensagem de boas-vindas -->
    <header class="absolute top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20">
      <h2 class="text-3xl font-bold drop-shadow-lg">{{ userName }}</h2>
      <p class="text-xl font-bold drop-shadow-lg text-amber-200">tens uma bela missão a fazer.</p>
    </header>

    <!-- Imagem papel-fundo-cima no canto superior esquerdo -->
    <img
      src="@/assets/papel-fundo-cima.png"
      alt="Papel fundo cima"
      class="absolute top-0 left-0 w-40 h-auto z-10"
    />
    
    <!-- Contêiner para sol e lua com animação de transição -->
    <div class="absolute top-0 left-20" style="margin-top: 10px; margin-left: 10px; z-index: 40; width: 8rem; height: auto;">
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
    
    <!-- Vila do Psicólogo -->
    <main class="relative w-full h-full z-10">

      
      <!-- Livro dos Pacientes (Centro da tela) -->
<div class="absolute inset-0 flex flex-col items-center justify-center">
  <img
    :src="livroAberto ? livroAbertoRealImg : livroFechadoImg"
    alt="Livro dos Pacientes"
    class="w-[300px] md:w-[380px] lg:w-[450px] h-auto cursor-pointer transition-transform duration-500 hover:scale-105 drop-shadow-2xl"
    @click="toggleLivro"
  />
  <p class="mt-4 text-lg font-semibold text-amber-900 drop-shadow-md">
    Livro dos Pacientes
  </p>
  
  <!-- Conteúdo do livro aberto com múltiplas páginas -->
  <div 
    v-if="livroAberto" 
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
  >
    <!-- Container principal para o livro e conteúdo -->
    <div class="relative w-full h-full">
      <!-- Imagem do livro com tamanho aumentado -->
      <img
        :src="livroAbertoRealImg"
        alt="Livro Aberto"
        class="w-[800px] h-auto object-contain drop-shadow-2xl relative z-10"
      />
      
      <!-- Setas de navegação -->
      <!-- Seta para a página anterior -->
      <button
        @click="paginaAnterior"
        v-if="paginaAtual > 0"
        class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full z-20 shadow-lg"
      >
        ←
      </button>
      
      <!-- Seta para a próxima página -->
      <button
        @click="proximaPagina"
        v-if="paginaAtual < numPaginas - 1"
        class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full z-20 shadow-lg"
      >
        →
      </button>
      
      <!-- Página 0: Convites pendentes -->
      <div v-if="paginaAtual === 0" class="absolute inset-0 z-20 pointer-events-none">
        <!-- Informações sobre o código de vínculo estática na página esquerda -->
        <div class="absolute top-1/3 left-1/4 transform -translate-y-1/2 -translate-x-1/2 w-2/5 max-w-[220px] pointer-events-auto">
          <h3 class="text-xl font-bold mb-4 text-amber-900">Código de Vínculo</h3>
          
          <div class="mb-4 p-3 bg-amber-50/80 rounded border border-amber-300">
            <p class="font-semibold text-amber-800 mb-2">Compartilhe:</p>
            <div class="flex flex-col items-center">
              <span class="font-mono text-lg bg-amber-200 px-3 py-2 rounded break-all">{{ codeVinculo }}</span>
              <button 
                @click="copiarCodigoVinculo"
                class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm mt-2"
              >
                Copiar
              </button>
            </div>
            <p class="mt-2 text-xs text-amber-700">Código para pacientes se vincularem a você.</p>
          </div>
        </div>
        
        <!-- Convites pendentes na página direita -->
        <div class="absolute top-1/3 right-1/4 transform -translate-y-1/2 translate-x-1/2 w-2/5 max-w-[220px] max-h-64 overflow-y-auto pointer-events-auto">
          <h3 class="text-xl font-bold mb-4 text-amber-900">Solicitações</h3>
          
          <div v-if="pendingInvitations.length === 0" class="text-center py-4">
            <p class="text-amber-700 text-sm">Nenhuma solicitação pendente.</p>
          </div>
          
          <div 
            v-for="invitation in pendingInvitations" 
            :key="invitation.id"
            class="mb-3 p-2 bg-amber-50/80 rounded border border-amber-300"
          >
            <p class="font-semibold text-amber-800 text-sm">Pac: {{ invitation.patientName }}</p>
            <p class="text-xs text-amber-700">Req: {{ formatDate(invitation.createdAt) }}</p>
            <div class="mt-2 flex gap-1">
              <button 
                @click="aceitarConvite(invitation.id)"
                class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
              >
                ✓
              </button>
              <button 
                @click="recusarConvite(invitation.id)"
                class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Página 1: Pacientes vinculados -->
      <div v-if="paginaAtual === 1" class="absolute inset-0 z-20 pointer-events-none">
        <!-- Informações sobre os pacientes vinculados -->
        <div class="absolute top-1/3 left-1/4 transform -translate-y-1/2 -translate-x-1/2 w-2/5 max-w-[220px] pointer-events-auto">
          <h3 class="text-xl font-bold mb-4 text-amber-900">Pacientes</h3>
          
          <div v-if="linkedPatients.length === 0" class="text-center py-4">
            <p class="text-amber-700 text-sm">Nenhum paciente vinculado.</p>
          </div>
          
          <div 
            v-for="patient in linkedPatients" 
            :key="patient.id"
            class="mb-3 p-2 bg-amber-50/80 rounded border border-amber-300"
          >
            <p class="font-semibold text-amber-800 text-sm">{{ patient.name }}</p>
            <p class="text-xs text-amber-700 mt-1">Vinculado em: {{ formatDate(patient.linkedAt) }}</p>
          </div>
        </div>
        
        <!-- Informações adicionais na página direita -->
        <div class="absolute top-1/3 right-1/4 transform -translate-y-1/2 translate-x-1/2 w-2/5 max-w-[220px] pointer-events-auto">
          <h3 class="text-xl font-bold mb-4 text-amber-900">Estatísticas</h3>
          
          <div class="bg-amber-50/80 rounded border border-amber-300 p-3">
            <p class="text-sm text-amber-800">Total de pacientes: <strong>{{ linkedPatients.length }}</strong></p>
            <p class="text-sm text-amber-800 mt-1">Solicitações pendentes: <strong>{{ pendingInvitations.length }}</strong></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      <!-- Label da casa -->
      <div class="absolute bottom-28 right-6 text-center" style="width: 192px;">
        <p class="text-sm font-bold text-amber-900 drop-shadow-md">Meu Perfil</p>
      </div>

      <!-- Templo do Sábio (Perfil) -->
      <router-link
        to="/psychologist/profile"
        class="absolute bottom-36 right-6 hover:scale-105 transition-transform duration-300"
      >
        <img
          src="@/assets/casa_do_sábio-removebg-preview.png" 
          alt="Templo do Sábio"
          class="w-60 h-auto drop-shadow-lg hover:brightness-110"
        />
      </router-link>
    </main>

    <!-- Camada de brilho suave -->
    <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-gradient-move"></div>
    
    <!-- Luz na extrema esquerda da tela, centralizada verticalmente, levemente fora da tela à esquerda -->
    <div class="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 w-32 h-32">
      <div 
        :class="isDarkMode ? 
          'absolute inset-0 bg-blue-300 rounded-full filter blur-3xl opacity-80 w-full h-full -left-12 -top-12 animate-pulse' : 
          'absolute inset-0 bg-yellow-300 rounded-full filter blur-3xl opacity-30 animate-pulse w-full h-full -left-12 -top-12'"
      ></div>
      <img
        src="@/assets/luz.png"
        alt="Luz"
        class="absolute -left-4 top-1/2 transform -translate-y-1/2 w-28 h-28 object-contain z-50 cursor-pointer"
        @click="toggleDarkMode"
      />
    </div>
    
    <!-- Imagem terra.png na parte inferior -->
    <img
      src="@/assets/terra.png"
      alt="Terra"
      class="absolute bottom-0 left-0 w-full h-auto object-cover z-15"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { logoutUser, getCurrentUser } from '@/firebase/authService';
import { getCurrentUserProfile } from '@/firebase/userProfileService';
import { getTherapistById } from '@/firebase/firestoreService';

// Estados para controlar o modo escuro e transições
const isDarkMode = ref(false);
const showSol = ref(true);
const showLua = ref(false);
const shouldAnimateSol = ref(false);
const shouldAnimateLua = ref(false);

// CORREÇÃO: Importar as imagens corretamente
import livroFechadoImg from '@/assets/livro-.png';
import livroAbertoRealImg from '@/assets/livroaberto.png';
import papelFundoCima from '@/assets/papel-fundo-cima.png';

const router = useRouter();
const userName = ref("Carregando...");
const livroAberto = ref(false);
const codeVinculo = ref('CARREGANDO...');
const pendingInvitations = ref([]);
const linkedPatients = ref([]);
const paginaAtual = ref(0);
const numPaginas = ref(2); // Página 0: Convites pendentes, Página 1: Pacientes vinculados
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

onMounted(async () => {
  // Load psychologist profile
  try {
    const profile = await getCurrentUserProfile();
    if (profile) {
      userName.value = profile.name || profile.email.split('@')[0];
    } else {
      // If no profile, redirect to login
      router.push('/login-psicologo');
      return;
    }
    
    // Carregar o código de vínculo do psicólogo
    const user = await getCurrentUser();
    if (user) {
      const therapistProfile = await getTherapistById(user.uid);
      if (therapistProfile) {
        codeVinculo.value = therapistProfile.code_vinculo || 'CÓDIGO NÃO ENCONTRADO';
      } else {
        codeVinculo.value = 'PERFIL NÃO ENCONTRADO';
      }
      
      // Carregar convites pendentes
      await loadPendingInvitations(user.uid);
      // Carregar pacientes vinculados
      await loadLinkedPatients(user.uid);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    router.push('/login-psicologo');
  }
});

// Função para carregar convites pendentes
const loadPendingInvitations = async (therapistId) => {
  try {
    // Usando a abordagem sem ordenação para evitar erro de índice
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const { db } = await import('@/firebase/init');
    
    // Query para encontrar todos os convites do terapeuta
    const q = query(
      collection(db, 'invitations'),
      where('therapistId', '==', therapistId)
    );
    
    const querySnapshot = await getDocs(q);
    const allInvitations = [];
    
    for (const docSnap of querySnapshot.docs) {
      allInvitations.push({ id: docSnap.id, ...docSnap.data() });
    }
    
    // Filtrar apenas os convites pendentes
    pendingInvitations.value = allInvitations.filter(inv => inv.status === 'pending');
  } catch (error) {
    console.error('Error loading pending invitations:', error);
  }
};

// Função para carregar pacientes vinculados
const loadLinkedPatients = async (therapistId) => {
  try {
    // Buscar primeiro os convites aceitos para encontrar os pacientes vinculados
    // Como não podemos usar a consulta diretamente, vamos buscar todos os convites do terapeuta
    // e filtrar os aceitos localmente
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const { db } = await import('@/firebase/init');
    
    // Query para encontrar todos os convites do terapeuta
    const q = query(
      collection(db, 'invitations'),
      where('therapistId', '==', therapistId)
    );
    
    const querySnapshot = await getDocs(q);
    const allInvitations = [];
    
    for (const docSnap of querySnapshot.docs) {
      allInvitations.push({ id: docSnap.id, ...docSnap.data() });
    }
    
    // Filtrar apenas os convites aceitos
    const acceptedInvites = allInvitations.filter(inv => inv.status === 'accepted');
    
    const pacientes = [];
    
    for (const invite of acceptedInvites) {
      // Pegar informações do paciente de forma mais segura
      try {
        const { getDoc, doc } = await import('firebase/firestore');
        const { db } = await import('@/firebase/init');
        
        const patientDocRef = doc(db, 'users', invite.patientId);
        const patientDoc = await getDoc(patientDocRef);
        
        if (patientDoc.exists()) {
          const userData = patientDoc.data();
          pacientes.push({
            id: patientDoc.id,
            name: userData.name || userData.email?.split('@')[0] || 'Paciente Anônimo',
            email: userData.email,
            linkedAt: invite.updatedAt || invite.createdAt || new Date() // Data do aceite do convite
          });
        }
      } catch (patientError) {
        console.error('Erro ao carregar dados do paciente:', patientError);
        // Adiciona o paciente com informações mínimas mesmo com erro
        pacientes.push({
          id: invite.patientId,
          name: 'Paciente (dados restritos)',
          email: 'N/A',
          linkedAt: invite.updatedAt || invite.createdAt || new Date()
        });
      }
    }
    
    linkedPatients.value = pacientes;
  } catch (error) {
    console.error('Error loading linked patients:', error);
    // Se não conseguir carregar os pacientes, manter a lista vazia
  }
};

onUnmounted(() => {
  if (authUnsubscribe) {
    authUnsubscribe();
  }
});

// Função para obter apenas o primeiro nome
const getFirstName = () => {
  if (!userName.value || userName.value === "Carregando...") {
    return "amigo";
  }
  
  // Separar o nome e pegar apenas o primeiro
  const firstName = userName.value.split(' ')[0];
  return firstName;
};

// Função para copiar o código de vínculo
const copiarCodigoVinculo = async () => {
  try {
    await navigator.clipboard.writeText(codeVinculo.value);
    alert('Código de vínculo copiado para a área de transferência!');
  } catch (err) {
    console.error('Erro ao copiar código: ', err);
    alert('Erro ao copiar código. Por favor, selecione manualmente e copie.');
  }
};

//Função para aceitar um convite
const aceitarConvite = async (invitationId) => {
  try {
    const { acceptInvitation } = await import('@/firebase/invitationService');
    await acceptInvitation(invitationId);
    alert('Convite aceito com sucesso!');
    // Recarregar os convites pendentes
    const user = await getCurrentUser();
    if (user) {
      await loadPendingInvitations(user.uid);
    }
  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    alert('Erro ao aceitar convite: ' + error.message);
  }
};

//Função para recusar um convite
const recusarConvite = async (invitationId) => {
  try {
    const { declineInvitation } = await import('@/firebase/invitationService');
    await declineInvitation(invitationId);
    alert('Convite recusado com sucesso!');
    // Recarregar os convites pendentes
    const user = await getCurrentUser();
    if (user) {
      await loadPendingInvitations(user.uid);
    }
  } catch (error) {
    console.error('Erro ao recusar convite:', error);
    alert('Erro ao recusar convite: ' + error.message);
  }
};

//Função para formatar datas
const formatDate = (date) => {
  if (!date) return 'N/A';
  if (date instanceof Date) {
    return date.toLocaleDateString('pt-BR');
  }
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('pt-BR');
  }
  if (date && typeof date.toDate === 'function') {
    return date.toDate().toLocaleDateString('pt-BR');
  }
  return 'N/A';
};

//Funções de navegação das páginas do livro
const paginaAnterior = () => {
  if (paginaAtual.value > 0) {
    paginaAtual.value--;
  }
};

const proximaPagina = () => {
  if (paginaAtual.value < numPaginas.value - 1) {
    paginaAtual.value++;
  }
};

const toggleLivro = () => {
  livroAberto.value = !livroAberto.value;
  // Resetar para a primeira página quando o livro é aberto
  if (livroAberto.value) {
    paginaAtual.value = 0;
  }
};

const handleLogout = async () => {
  try {
    console.log('Realizando logout do psicólogo...');
    await logoutUser();
    console.log('Logout do psicólogo realizado com sucesso');
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

/* Estilo para o conteúdo sobreposto ao livro aberto */
.livro-conteudo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.livro-conteudo > * {
  pointer-events: auto;
}
</style>
