<template>
  <div class="selection-screen hide-system-cursor ">
    <!-- Background fixo ocupando a tela inteira -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      style="background-image: url('https://78.media.tumblr.com/90a10a126d1e3beb56566159799e553d/tumblr_ozo6zbdxOO1vbdodoo1_500.gif');"
    ></div>

    <!-- Overlay escurecido -->
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- Conteúdo central fixo -->
    <div class="relative z-10 flex flex-col items-center justify-center w-full min-h-screen transform scale-70 sm:scale-75 md:scale-75 lg:scale-70" style="transform-origin: center;">
      <div class="text-center mb-10">
        <div class="flex items-center justify-center mb-6">
          <Sparkles class="w-8 h-8 text-yellow-300 mr-3 animate-pulse" />
          <h1 class="text-6xl font-bold text-white tracking-tight font-serif">Letter Matter</h1>
          <Sparkles class="w-8 h-8 text-yellow-300 ml-3 animate-pulse" />
        </div>
        <p class="text-xl text-purple-100 font-serif">Sua escrita é a chave da sua cura.</p>
      </div>

      <!-- Pergaminho e formulário centralizados -->
      <div class="relative w-full max-w-2xl flex justify-center items-center">
        <img
          src="@/assets/pergaminho.png"
          alt="Pergaminho"
          class="w-full h-auto object-contain pointer-events-none select-none scale-110"
        />

        <!-- Formulário sobre o pergaminho -->
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 scale-90"
        >
          <div class="rounded-xl p-4 bg-transparent">
            <h3 class="text-xl font-bold text-amber-900 mb-3 text-center font-serif border-b border-amber-800 pb-2">
              Acesse seu Selo
            </h3>

            <form @submit.prevent="loginPatient" class="space-y-2">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-amber-900 mb-1 font-serif"
                  >Símbolo de Correio</label
                >
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-2 py-1.5 border border-amber-800 rounded-sm focus:ring-1 focus:ring-amber-700 focus:border-amber-700 outline-none text-sm bg-amber-50/90 font-serif"
                  placeholder="seu@selo.com"
                />
              </div>

              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-amber-900 mb-1 font-serif"
                  >Senha Secreta</label
                >
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  class="w-full px-2 py-1.5 border border-amber-800 rounded-sm focus:ring-1 focus:ring-amber-700 focus:border-amber-700 outline-none text-sm bg-amber-50/90 font-serif"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                class="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-white py-1.5 rounded-sm font-bold hover:from-amber-800 hover:to-amber-950 transition-all shadow text-sm font-serif border border-amber-800"
              >
                Selo de Acesso
              </button>
            </form>

            <div class="mt-3 text-center">
              <p class="text-sm text-amber-900 font-serif">Não possui um selo?</p>
              <button
                @click="showRegister.value = true"
                class="text-amber-800 hover:text-amber-950 font-bold text-sm mt-1 font-serif underline"
              >
                Crie seu selo aqui
              </button>
              
              <div class="mt-2">
                <button
                  @click="loginWithGoogleSelection"
                  class="w-full bg-red-500 text-white py-1.5 rounded-sm font-bold hover:bg-red-600 transition-all shadow text-sm font-serif border border-red-600"
                >
                  Continuar com Google
                </button>
              </div>
            </div>

            <div class="mt-2 text-center border-t border-amber-800 pt-2">
              <p class="text-sm text-amber-900 font-serif">É um sábio curador?</p>
              <router-link
                to="/login-psicologo"
                class="text-amber-800 hover:text-amber-950 font-bold text-sm mt-1 inline-block font-serif underline"
              >
                Acesso ao pergaminho sábio
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Modal de Registro -->
    <RegisterModal 
      v-if="showRegister"
      @close="showRegister.value = false"
      @register-success="handleRegisterSuccess"
      @switch-to-login="showRegister.value = false"
    />
    <!-- Cursor personalizado -->
    <div class="pena-cursor">
      <img src="@/assets/pena.png" alt="Cursor de pena" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Sparkles } from "lucide-vue-next";
import { useRouter } from "vue-router";
import RegisterModal from '@/components/RegisterModal.vue';
import { loginUser, loginWithGoogle } from '@/firebase/authService';

const router = useRouter();
const email = ref("");
const password = ref("");
const showRegister = ref(false);

const loginPatient = async () => {
  if (!email.value || !password.value) {
    alert('Por favor, preencha todos os campos.');
    return;
  }
  
  try {
    const user = await loginUser(email.value, password.value);
    console.log('Usuário logado com sucesso no SelectionScreen:', user);
    router.push("/patient/dashboard");
  } catch (err) {
    console.error('Login error no SelectionScreen:', err);
    let errorMessage = 'Erro no login. Por favor, tente novamente.';
    
    if (err.code === 'auth/user-not-found') {
      errorMessage = 'Nenhuma conta encontrada com este e-mail.';
    } else if (err.code === 'auth/wrong-password') {
      errorMessage = 'Senha incorreta.';
    } else {
      errorMessage = 'Erro no login. Por favor, tente novamente. Detalhes: ' + err.message;
    }
    
    alert(errorMessage);
  }
};

const loginWithGoogleSelection = async () => {
  try {
    const user = await loginWithGoogle();
    console.log('Usuário logado com Google com sucesso:', user);
    router.push("/patient/dashboard");
  } catch (err) {
    console.error('Google login error no SelectionScreen:', err);
    alert('Erro no login com Google. Por favor, tente novamente. Detalhes: ' + err.message);
  }
};

const handleRegisterSuccess = () => {
  showRegister.value = false;
  // Adiciona feedback visual ou mensagem de sucesso aqui se desejar
};

// anima o cursor de pena
onMounted(() => {
  const cursor = document.querySelector(".pena-cursor");
  const moveCursor = (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  };
  document.addEventListener("mousemove", moveCursor);
  onBeforeUnmount(() => {
    document.removeEventListener("mousemove", moveCursor);
  });
});
</script>

<style scoped>
.selection-screen {
  position: fixed; /* ocupa toda a tela */
  inset: 0;
  overflow: hidden; /* impede rolagem */
  height: 100vh;
  width: 100vw;
}

/* esconde o cursor apenas nesta view */
.hide-system-cursor {
  cursor: none;
}

/* cursor personalizado */
.pena-cursor {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  user-select: none;
  z-index: 9999;
}

.pena-cursor img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  opacity: 0.9;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
}
</style>
