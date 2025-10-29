<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 right-20 w-72 h-72 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute bottom-20 left-20 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>

    <div class="w-full max-w-md relative z-10 px-4 sm:px-0 font-serif">
      <router-link
        to="/"
        class="mb-8 flex items-center text-amber-100 hover:text-amber-300 transition-colors group"
      >
        <ArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform sm:w-6 sm:h-6 sm:mr-3" />
        <span class="text-base font-medium sm:text-lg">Voltar</span>
      </router-link>

      <div class="bg-amber-900/90 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-2xl p-6 sm:p-10 border border-amber-700">
        <div class="text-center mb-8 sm:mb-10">
          <div class="bg-gradient-to-br from-amber-600 to-amber-800 w-20 h-20 sm:w-24 sm:h-24 rounded-sm flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg border border-amber-500">
            <Heart class="w-10 h-10 sm:w-12 sm:h-12 text-amber-100 animate-pulse" />
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold text-amber-100 mb-2 sm:mb-3">
            Bem-vindo!
          </h2>
          <p class="text-amber-200 text-base sm:text-lg">Entre no seu refúgio de escritas.</p>
        </div>

        <div class="space-y-5 sm:space-y-6">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">Símbolo de Correio</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-amber-300 transition-colors" />
              <input
                v-model="email"
                type="email"
                placeholder="seu@selo.com"
                class="w-full pl-11 pr-4 py-3 sm:py-4 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-amber-900 text-sm sm:text-base bg-amber-100/90"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-medium text-amber-200 mb-2 sm:mb-3">Senha Secreta</label>
            <div class="relative group">
              <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-amber-300 transition-colors" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full pl-11 pr-4 py-3 sm:py-4 border border-amber-700 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-amber-900 text-sm sm:text-base bg-amber-100/90"
              />
            </div>
          </div>

          <div v-if="error" class="error-message text-red-500 text-sm">
            {{ error }}
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-2 sm:gap-0">
            <label class="flex items-center cursor-pointer group">
              <input v-model="remember" type="checkbox" class="rounded text-amber-600 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 border-amber-500" />
              <span class="text-amber-200 text-sm sm:text-base group-hover:text-amber-100">Manter selo ativo</span>
            </label>
            <button class="text-amber-300 hover:text-amber-100 font-semibold text-sm sm:text-base underline">Recuperar acesso?</button>
          </div>

          <button
            @click="handleLogin"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 py-3 sm:py-4 rounded-sm font-bold text-base sm:text-lg hover:from-amber-600 hover:to-amber-800 transition-all shadow-lg hover:shadow-amber-500/50 transform hover:-translate-y-0.5 border border-amber-600 disabled:opacity-50"
          >
            <span v-if="!loading">Selo de Acesso</span>
            <span v-else>Processando...</span>
          </button>

          <button
            @click="handleGoogleLogin"
            :disabled="loading"
            class="w-full bg-red-500 text-white py-2.5 sm:py-3.5 rounded-sm font-bold text-base sm:text-lg hover:bg-red-600 transition-all shadow-lg transform hover:-translate-y-0.5 border border-red-600 disabled:opacity-50 mt-2"
          >
            Continuar com Google
          </button>
        </div>

        <div class="mt-6 sm:mt-8 text-center">
          <p class="text-amber-200 text-sm sm:text-base">
            Primeira vez aqui?{' '}
            <router-link to="/registro-paciente" class="text-amber-300 hover:text-amber-100 font-bold underline">Criar selo gratuito</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Heart, Mail, Lock } from 'lucide-vue-next';
import { 
  loginUser, 
  loginWithGoogle 
} from '@/firebase/authService';
import { createUser } from '@/firebase/firestoreService';

const email = ref('');
const password = ref('');
const remember = ref(false);
const loading = ref(false);
const error = ref('');

const router = useRouter();

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Por favor, preencha todos os campos.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const user = await loginUser(email.value, password.value);
    console.log('Usuário logado com sucesso:', user);
    router.push('/patient/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    if (err.code === 'auth/user-not-found') {
      error.value = 'Nenhuma conta encontrada com este e-mail.';
    } else if (err.code === 'auth/wrong-password') {
      error.value = 'Senha incorreta.';
    } else {
      error.value = 'Erro no login. Por favor, tente novamente. Detalhes: ' + err.message;
    }
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const user = await loginWithGoogle();
    console.log('Usuário logado com Google com sucesso:', user);
    
    // Create user profile in Firestore if doesn't exist
    try {
      await createUser({
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        age: null, // Idade não disponível no login Google
        role: 'user',
        therapist_linked_id: null,
        bio: 'Usuário em jornada de autodescoberta e cura. Engajado no processo terapêutico e comprometido com o crescimento pessoal.',
        progress: 0,
        createdAt: new Date()
      });
      console.log('Perfil do usuário criado com sucesso no Firestore após login Google');
    } catch (e) {
      // User profile may already exist, that's fine
      console.log('User profile may already exist:', e.message);
    }
    
    router.push('/patient/dashboard');
  } catch (err) {
    console.error('Google login error:', err);
    error.value = 'Erro no login com Google. Por favor, tente novamente. Detalhes: ' + err.message;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/');
};

// Garantir que o cursor normal esteja ativo nesta tela
onMounted(() => {
  document.body.classList.remove('selection-screen-body');
});
</script>