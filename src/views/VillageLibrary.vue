<template>
  <div class="relative w-full h-screen overflow-hidden text-white">
    <!-- Fundo personalizado da biblioteca -->
    <div class="absolute inset-0 fundo-personalizado"></div>
    
    <!-- Botão de voltar para o Dashboard -->
    <router-link
      to="/patient/dashboard"
      class="absolute top-6 left-6 p-2 bg-amber-700/50 hover:bg-amber-700 text-white rounded-full transition-colors border border-amber-500 z-30"
      title="Voltar ao Dashboard"
      v-if="!showWelcomeMessage"
    >
      <ArrowLeft class="w-5 h-5" />
    </router-link>
    
    <!-- Nome da seção -->
    <header class="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-30" v-if="!showWelcomeMessage">
      <h2 class="text-3xl font-bold drop-shadow-lg">Minha Biblioteca</h2>
    </header>

    <!-- Mensagem de boas-vindas com pergaminho e carta -->
    <div 
      v-if="showWelcomeMessage && !messageRead" 
      class="absolute inset-0 flex items-center justify-center z-40"
    >
      <!-- Fundo desfocado durante a apresentação da mensagem -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm z-40"></div>
      
      <!-- Pergaminho do SPAM com leve balançar -->
      <div 
        class="relative w-[700px] h-[500px] cursor-pointer bounce-animation z-50"
        @click="showCarta"
      >
        <img 
          src="@/assets/pergaminho do spam.png" 
          alt="Pergaminho do SPAM" 
          class="w-full h-full object-contain"
        >
      </div>
    </div>
    
    <!-- Carta aberta com mensagem -->
    <div 
      v-if="showWelcomeMessage && messageRead" 
      class="absolute inset-0 flex items-center justify-center z-40"
    >
      <!-- Fundo desfocado durante a apresentação da mensagem -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm z-40"></div>
      
      <div class="relative w-[700px] h-[500px] z-50 bg-amber-100 rounded-lg shadow-2xl border-4 border-amber-300 p-8 flex flex-col justify-center items-center">
        <!-- Mensagem centralizada -->
        <h2 class="text-3xl font-bold mb-6 text-amber-900 text-center">Olá, {{ userNameDisplay }}.</h2>
        <div class="text-amber-800 text-lg leading-relaxed text-justify flex-grow w-full max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100 p-2">
          <p>
            Seja muito bem-vindo à Biblioteca da Vila.<br>
            Como és novo entre nós, permita-me contar-te uma história...<br><br>
            
            Houve um tempo em que nossas prateleiras eram cheias de vida — livros, memórias, poesias e sonhos repousavam aqui. Mas um terrível incêndio devastou tudo. As chamas levaram nossas palavras, e por um longo período reinou o silêncio.<br><br>
            
            Contudo, os moradores decidiram unir-se em um propósito: reconstruir a Biblioteca com suas próprias histórias. Cada relato, cada lembrança e cada verso agora ajudam a reacender as chamas da imaginação — não mais as do fogo destruidor, mas as do renascimento.<br><br>
            
            Agora, é tua vez, viajante.<br>
            Sente-te, pega tua pena e escreve.<br>
            Tua história também merece viver entre as nossas.
          </p>
        </div>
        
        <!-- Botão para fechar a mensagem e continuar -->
        <button 
          @click="closeWelcomeMessage" 
          class="mt-8 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white rounded-full transition-colors border border-amber-500 z-60 font-bold text-lg"
        >
          Continuar
        </button>
      </div>
    </div>

    <!-- Conteúdo principal da biblioteca (aparece após ler a mensagem ou se já leu antes) -->
    <main v-if="!showWelcomeMessage" class="relative w-full h-full z-20">
      <!-- Quadros na parte superior da tela -->
      <div class="flex flex-col items-center pt-32 space-y-4">
        <!-- Primeira linha de quadros -->
        <div class="flex justify-center items-start space-x-8">
          <img
            :src="quadro1"
            alt="Quadro 1"
            class="w-32 h-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
            @click="abrirModal(quadro1, 'Quadro pintado por mestres anônimos - Obra de 1567')"
          />
          <img
            :src="quadro2"
            alt="Quadro 2"
            class="w-32 h-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
            @click="abrirModal(quadro2, 'Quadro pintado por artista renascentista - Obra de 1623')"
          />
          <img
            :src="quadro3"
            alt="Quadro 3"
            class="w-32 h-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
            @click="abrirModal(quadro3, 'Quadro pintado por Arturo Delacroix - Obra de 1701')"
          />
        </div>
        
        <!-- Segunda linha de quadros -->
        <div class="flex justify-center items-start space-x-8">
          <img
            :src="quadro4"
            alt="Quadro 4"
            class="w-24 h-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
            @click="abrirModal(quadro4, 'Quadro pintado por Elena Vasquez - Obra de 1789')"
          />
        </div>
        
        <!-- Imagem prateleira aumentada adicionada abaixo do quadro4 -->
        <div class="flex justify-center items-start pt-4 relative">
          <!-- Prateleira única no centro -->
          <img
            src="@/assets/prateleira-2.png"
            alt="Prateleira 2"
            class="w-96 h-auto object-contain"
          />
          
          <!-- Imagem de papeis para escrever em cima da prateleira-2 com efeito de movimento -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
               @click="abrirFolhaEscrever">
            <img
              src="@/assets/papeis-escrever-lbry.png"
              alt="Papeis para Escrever"
              class="w-32 h-auto object-contain animate-bounce-smoother cursor-pointer"
            />
          </div>
          
          <!-- Imagem de tinteiro em cima da prateleira-2, mais para a direita e mais acima -->
          <div class="absolute top-[40%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 z-11">
            <img
              src="@/assets/tinteiro-lbry.png"
              alt="Tinteiro"
              class="w-24 h-auto object-contain"
            />
          </div>
        </div>
      </div>
      
      <!-- Prateleiras organizadas em duas colunas com 3 prateleiras cada em lados opostos -->
      <div class="absolute top-1/2 left-1/4 transform -translate-y-1/2 -translate-x-1/2">
        <!-- Primeira coluna de prateleiras (lado esquerdo) -->
        <div class="flex flex-col items-center space-y-12">
          <img
            src="@/assets/prateleira-1.png"
            alt="Prateleira de livros"
            class="w-80 h-auto object-contain"
          />
          <img
            src="@/assets/prateleira-1.png"
            alt="Prateleira de livros"
            class="w-80 h-auto object-contain"
          />
          <img
            src="@/assets/prateleira-1.png"
            alt="Prateleira de livros"
            class="w-80 h-auto object-contain"
          />
        </div>
      </div>
      
      <div class="absolute top-1/2 right-1/4 transform -translate-y-1/2 translate-x-1/2">
        <!-- Segunda coluna de prateleiras (lado direito) -->
        <div class="flex flex-col items-center space-y-12">
          <img
            src="@/assets/prateleira-1.png"
            alt="Prateleira de livros"
            class="w-80 h-auto object-contain"
          />
          <img
            src="@/assets/prateleira-1.png"
            alt="Prateleira de livros"
            class="w-80 h-auto object-contain"
          />
          <img
            src="@/assets/prateleira-1.png"
            alt="Prateleira de livros"
            class="w-80 h-auto object-contain"
          />
        </div>
      </div>
    </main>

    <!-- Modal para exibir folha-escrever-lbry.png -->
    <div v-if="mostrarFolhaEscrever" 
         class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         @click="fecharFolhaEscrever">
      <div class="relative max-w-2xl max-h-[80vh]">
        <img 
          src="@/assets/folha-escrever-lbry.png"
          alt="Folha para Escrever"
          class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl rotated-paper"
          @click.stop
        />
        <!-- Área de edição de texto sobreposta à imagem -->
        <div 
          class="absolute top-[10%] left-[10%] right-[10%] bottom-[20%] p-8 text-amber-900 text-lg leading-relaxed"
          @click.stop
        >
          <textarea
            v-model="conteudoFolha"
            class="w-full h-full bg-transparent border-none outline-none resize-none font-serif text-amber-800 text-lg leading-relaxed textarea-overlay placeholder:text-amber-600 overflow-auto"
            placeholder="Escreva sua história aqui..."
          ></textarea>
        </div>
        
        <!-- Botão para salvar escritura -->
        <button 
          @click="salvarEscritura"
          :disabled="salvandoEscritura"
          class="absolute -top-10 left-0 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 transition-colors disabled:opacity-50"
          :title="salvandoEscritura ? 'Salvando...' : 'Salvar Escritura'">
          <Save class="w-6 h-6" />
        </button>
        
        <!-- Botão para fechar -->
        <button 
          @click="fecharFolhaEscrever"
          class="absolute -top-10 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
          title="Fechar">
          <X class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Modal para exibir quadros em tamanho maior -->
    <div v-if="imagemModal" 
         class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         @click="fecharModal">
      <div class="relative max-w-3xl max-h-[80vh]">
        <img :src="imagemModal" 
             :alt="descricaoModal" 
             class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border-4 border-amber-200"
             @click.stop>
        <button 
          @click="fecharModal"
          class="absolute -top-10 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
          title="Fechar">
          <X class="w-6 h-6" />
        </button>
        <div class="mt-4 text-center text-white bg-black/50 p-3 rounded-lg max-w-full break-words">
          {{ descricaoModal }}
        </div>
      </div>
    </div>

    <!-- Exibir escritas salvas como miniaturas em cima das prateleiras-1 -->
    
    <!-- Renderizar cada escrita em sua posição específica -->
    <div 
      v-for="(escrita, index) in escritasBiblioteca" 
      :key="escrita.id"
      :class="getPosicaoEscrita(index)"
    >
      <img 
        src="@/assets/historia-lbry.png"
        alt="Minha Escrita"
        class="w-24 h-auto object-contain drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 historia-lbry-image"
        @click="abrirModalLeitura(escrita)"
      />
    </div>

    <!-- Modal para leitura de escrita -->
    <div v-if="mostrarModalLeitura" 
         class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
         @click="fecharModalLeitura">
      <div class="relative max-w-2xl max-h-[80vh] bg-amber-50 rounded-lg shadow-2xl overflow-hidden"
           @click.stop>
        <!-- Conteúdo da escrita -->
        <div class="p-8 flex flex-col h-full">
          <h3 class="text-xl font-bold text-amber-900 mb-4 text-center">
            Minha Escrita
          </h3>
          <div class="flex-grow overflow-y-auto text-amber-800 text-lg leading-relaxed font-serif whitespace-pre-line">
            {{ escritaSelecionada?.content }}
          </div>
        </div>
        <button 
          @click="fecharModalLeitura"
          class="absolute -top-10 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
          title="Fechar">
          <X class="w-6 h-6" />
        </button>
      </div>
    </div>


    
    <!-- Camada de brilho suave -->
    <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-gradient-move"></div>
  </div>
</template>

<script setup>
import { ArrowLeft, X, Save } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { getCurrentUserProfile } from '@/firebase/userProfileService';
import { createLibraryWriting, getUserLibraryWritings } from '@/firebase/firestoreService';

// Variáveis para controlar a mensagem de boas-vindas
const showWelcomeMessage = ref(false);
const messageRead = ref(false);
const userNameDisplay = ref('Carregando...');

// Variável para controlar a exibição da folha para escrever
const mostrarFolhaEscrever = ref(false);

// Variável para armazenar o conteúdo da folha
const conteudoFolha = ref('');

// Variável para armazenar o nome do usuário
const userName = ref('');

// Variável para indicar se está salvando
const salvandoEscritura = ref(false);

// Variável para armazenar as escritas salvas
const escritasBiblioteca = ref([]);

// Variável para controlar se está carregando as escritas
const carregandoEscritas = ref(true);

// Variável para armazenar a escrita selecionada para leitura
const escritaSelecionada = ref(null);

// Variável para controlar a exibição do modal de leitura
const mostrarModalLeitura = ref(false);

// Carregar o nome do usuário quando o componente montar
onMounted(async () => {
  // Forçar exibição da mensagem de boas-vindas ao entrar na biblioteca
  showWelcomeMessage.value = true;
  // Remover o item do localStorage para garantir que a mensagem apareça novamente
  localStorage.removeItem('libraryWelcomeMessageRead');
  
  // Carregar o nome do usuário do perfil
  try {
    const profile = await getCurrentUserProfile();
    if (profile) {
      userNameDisplay.value = profile.name || profile.email.split('@')[0];
    }
  } catch (error) {
    console.error('Erro ao carregar o nome do usuário:', error);
    userNameDisplay.value = 'Visitante';
  }
});



const quadro1 = new URL('@/assets/quadro1.jpeg', import.meta.url).href;
const quadro2 = new URL('@/assets/quadro2.jpeg', import.meta.url).href;
const quadro3 = new URL('@/assets/quadro3.jpeg', import.meta.url).href;
const quadro4 = new URL('@/assets/quardro4.png', import.meta.url).href;

const imagemModal = ref(null);
const descricaoModal = ref('');

const abrirModal = (imagem) => {
  imagemModal.value = imagem;
  // Definir a descrição com base na imagem
  if (imagem === quadro1) {
    descricaoModal.value = "Quadro pintado por mestres anônimos - Obra de 1567";
  } else if (imagem === quadro2) {
    descricaoModal.value = "Quadro pintado por artista renascentista - Obra de 1623";
  } else if (imagem === quadro3) {
    descricaoModal.value = "Quadro pintado por Arturo Delacroix - Obra de 1701";
  } else if (imagem === quadro4) {
    descricaoModal.value = "Quadro pintado por Elena Vasquez - Obra de 1789";
  }
};

const fecharModal = () => {
  imagemModal.value = null;
  descricaoModal.value = '';
};

// Função para mostrar a carta quando o pergaminho for clicado
const showCarta = () => {
  messageRead.value = true;
};

// Função para fechar a mensagem de boas-vindas e continuar
const closeWelcomeMessage = () => {
  showWelcomeMessage.value = false;
  localStorage.setItem('libraryWelcomeMessageRead', 'true');
};

// Funções para controlar a exibição da folha para escrever
const abrirFolhaEscrever = () => {
  // Sempre iniciar com uma nova escrita (limpar conteúdo anterior)
  conteudoFolha.value = '';
  mostrarFolhaEscrever.value = true;
};

// Função para salvar a escritura no banco de dados
const salvarEscritura = async () => {
  salvandoEscritura.value = true;
  
  try {
    // Pegar informações do usuário atual
    const perfilUsuario = await getCurrentUserProfile();
    
    if (!perfilUsuario) {
      throw new Error('Usuário não autenticado');
    }
    
    // Dados da escritura
    const dadosEscritura = {
      content: conteudoFolha.value,
      author_id: perfilUsuario.id,
      author_name: perfilUsuario.name || perfilUsuario.email.split('@')[0],
    };
    
    // Salvar no Firestore
    await createLibraryWriting(dadosEscritura);
    
    // Recarregar as escritas após salvar
    await carregarEscritasBiblioteca();
    
    // Limpar o conteúdo após salvar com sucesso
    conteudoFolha.value = '';
    
    // Mostrar mensagem de sucesso (opcional)
    console.log('Escritura salva com sucesso!');
    alert('Escritura salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar escritura:', error);
    alert('Erro ao salvar escritura: ' + error.message);
  } finally {
    salvandoEscritura.value = false;
  }
};

// Função para carregar as escritas salvas do banco de dados
const carregarEscritasBiblioteca = async () => {
  carregandoEscritas.value = true;
  try {
    const perfilUsuario = await getCurrentUserProfile();
    if (!perfilUsuario) {
      throw new Error('Usuário não autenticado');
    }
    const escritas = await getUserLibraryWritings(perfilUsuario.id);
    escritasBiblioteca.value = escritas;
  } catch (error) {
    console.error('Erro ao carregar escritas da biblioteca:', error);
    // Não exibir alerta para o usuário apenas por causa do carregamento, para melhor experiência
    // alert('Erro ao carregar escritas: ' + error.message);
  } finally {
    carregandoEscritas.value = false;
  }
};

// Função para abrir o modal de leitura de uma escrita
const abrirModalLeitura = (escrita) => {
  console.log('Abrindo modal de leitura para:', escrita);
  console.log('Conteúdo da escrita:', escrita?.content);
  console.log('Autor da escrita:', escrita?.author_name);
  escritaSelecionada.value = escrita;
  mostrarModalLeitura.value = true;
  console.log('Estado após atualização:', mostrarModalLeitura.value);
};

// Função para calcular a posição de cada escrita
const getPosicaoEscrita = (index) => {
  // Cada prateleira comporta 4 escritas
  const historiasPorPrateleira = 4; // 4 histórias por prateleira
  
  // Determinar se é lado esquerdo ou direito (cada lado tem 3 prateleiras = 12 histórias por lado)
  const lado = index < 12 ? 'left' : 'right';
  const indiceNoLado = lado === 'left' ? index : index - 12;
  
  // Determinar qual prateleira dentro do lado (0, 1 ou 2)
  const prateleira = Math.floor(indiceNoLado / historiasPorPrateleira);
  
  // Determinar posição dentro da prateleira (0, 1, 2 ou 3)
  const posicaoNaPrateleira = indiceNoLado % historiasPorPrateleira;
  
  // Altura base - há 3 prateleiras em cada lado (esquerda e direita)
  let topPosition = '';
  
  if (lado === 'left') {
    // Lado esquerdo
    if (prateleira === 0) {
      // Primeira prateleira: manter posição original (não interferir)
      topPosition = 'top-[calc(50%-200px)]';
    } else if (prateleira === 1) {
      // Segunda prateleira: manter posição mais baixa
      topPosition = 'top-[calc(50%+160px)]';
    } else if (prateleira === 2) {
      // Terceira prateleira: subir um pouco
      topPosition = 'top-[calc(50%-20px)]';
    }
  } else {
    // Lado direito
    if (prateleira === 0) {
      // Primeira prateleira: manter posição original
      topPosition = 'top-[calc(50%-200px)]';
    } else if (prateleira === 1) {
      // Segunda prateleira: posição mais baixa
      topPosition = 'top-[calc(50%+160px)]';
    } else if (prateleira === 2) {
      // Terceira prateleira: subir um pouco
      topPosition = 'top-[calc(50%-20px)]';
    }
  }
  
  // Posição horizontal (com variação para posicionar 4 itens por prateleira)
  const posicoesHorizontais = [
    '-ml-16', // Primeira escrita (mais à esquerda)
    '-ml-6',  // Segunda escrita (ligeiramente à esquerda)
    'ml-6',   // Terceira escrita (ligeiramente à direita)
    'ml-16'   // Quarta escrita (mais à direita)
  ];
  
  // Rotações leves para cada posição
  const rotacoes = [
    'rotate-3',    // Primeira
    'rotate-1',    // Segunda
    '-rotate-1',   // Terceira
    '-rotate-3'    // Quarta
  ];
  
  // Montar as classes
  let classes = "absolute z-40 transform transition-transform hover:scale-105 cursor-pointer ";
  
  // Adicionar classe de posição vertical
  classes += `${topPosition} `;
  
  // Adicionar classe de posição horizontal com base no lado
  if (lado === 'left') {
    classes += `left-1/4 -translate-x-1/2 ${posicoesHorizontais[posicaoNaPrateleira]} `;
  } else {
    classes += `right-1/4 translate-x-1/2 ${posicoesHorizontais[posicaoNaPrateleira]} `;
  }
  
  // Adicionar rotação
  classes += rotacoes[posicaoNaPrateleira];
  
  return classes;
};

// Função para fechar o modal de leitura
const fecharModalLeitura = () => {
  console.log('Fechando modal de leitura');
  mostrarModalLeitura.value = false;
  escritaSelecionada.value = null;
};

const fecharFolhaEscrever = () => {
  // NÃO salvar conteúdo ao fechar sem salvar
  mostrarFolhaEscrever.value = false;
};

// Carregar as escritas quando o componente for montado
onMounted(async () => {
  // Verificar se a mensagem de boas-vindas já foi lida anteriormente
  const welcomeMessageRead = localStorage.getItem('libraryWelcomeMessageRead');
  
  // Mostrar a mensagem de boas-vindas apenas se não tiver sido lida antes
  if (!welcomeMessageRead) {
    showWelcomeMessage.value = true;
    // Não remover o item do localStorage aqui, pois só queremos mostrar a mensagem na primeira vez
  } else {
    showWelcomeMessage.value = false; // Mostrar diretamente o conteúdo principal
  }
  
  // Carregar o nome do usuário do perfil
  try {
    const profile = await getCurrentUserProfile();
    if (profile) {
      userNameDisplay.value = profile.name || profile.email.split('@')[0];
    }
  } catch (error) {
    console.error('Erro ao carregar o nome do usuário:', error);
    userNameDisplay.value = 'Visitante';
  }
  
  // Carregar as escritas da biblioteca
  await carregarEscritasBiblioteca();
});
</script>

<style scoped>
/* ✨ Gradiente suave no fundo */
@keyframes gradient-move {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.animate-gradient-move {
  animation: gradient-move 6s ease-in-out infinite;
}

/* Animação de balanço leve para o pergaminho */
@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(1deg);
  }
}

.bounce-animation {
  animation: gentle-bounce 3s ease-in-out infinite;
}

/* Fundo personalizado */
.fundo-personalizado {
  background-image: url('@/assets/fundo biblioteca.avif');
  background-size: cover;
  background-position: center;
}

/* Animação de bounce lento para a imagem de papeis */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

/* Animação mais suave para a imagem de papeis */
@keyframes bounce-smoother {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-3px) translateX(1px);
  }
}

.animate-bounce-smoother {
  animation: bounce-smoother 6s ease-in-out infinite;
}

/* Estilo para rotação da imagem folha-escrever-lbry.png */
.rotated-paper {
  transform: rotate(-6deg);
}

/* Estilo para área de edição de texto sobreposta à imagem */
.textarea-overlay {
  background: transparent;
  caret-color: #a42e17; /* Cor do cursor para combinar com a paleta de cores */
  /* Estilo para a barra de rolagem */
  scrollbar-width: thin;
  scrollbar-color: #a55a05 transparent; /* Cor da barra e do fundo da barra (transparente) */
}

.textarea-overlay::placeholder {
  color: #d97706; /* Cor âmbar mais escura para melhor contraste */
  font-style: italic;
}

/* Estilo para a barra de rolagem WebKit (Chrome, Edge, Safari) */
.textarea-overlay::-webkit-scrollbar {
  width: 12px;
}

.textarea-overlay::-webkit-scrollbar-track {
  background: transparent; /* Cor de fundo da barra transparente */
  border-radius: 6px;
}

.textarea-overlay::-webkit-scrollbar-thumb {
  background: #d97706; /* Cor da alça da barra - tom âmbar médio */
  border-radius: 6px;
  border: 2px solid #fbbf24; /* Borda da alça para destacar no fundo transparente */
}

.textarea-overlay::-webkit-scrollbar-thumb:hover {
  background: #b45309; /* Cor da alça ao passar o mouse - tom âmbar mais escuro */
}

/* Estilo para miniaturas de escritas */
.writings-thumbnail {
  transition: transform 0.2s ease;
}

.writings-thumbnail:hover {
  transform: scale(1.05) rotate(1deg);
}

/* Estilo para imagens de historia-lbry.png para garantir alinhamento preciso */
.historia-lbry-image {
  transform-origin: center bottom;
}
</style>