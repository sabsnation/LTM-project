<template>
  <div class="w-80 h-96 bg-amber-100 rounded-lg shadow-xl border-2 border-amber-400 flex flex-col">
    <!-- Header do chat -->
    <div class="bg-gradient-to-r from-amber-600 to-amber-800 p-3 rounded-t-lg text-amber-100 flex justify-between items-center">
      <h3 class="font-bold">Salão de Conversas</h3>
      <button 
        @click="closeChat"
        class="text-amber-200 hover:text-white"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Área de mensagens -->
    <div 
      ref="messagesContainer"
      class="flex-grow overflow-y-auto p-3 bg-amber-50"
    >
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['mb-2 p-2 rounded', 
                 message.userId === currentUserId ? 'bg-amber-200 ml-auto' : 'bg-amber-300 mr-auto']"
        style="max-width: 85%;"
      >
        <div class="font-semibold text-amber-900 text-sm">
          {{ message.userName || 'Anônimo' }} <span class="text-xs text-amber-700">({{ formatTime(message) }})</span>
        </div>
        <div class="text-amber-800">{{ message.text }}</div>
      </div>
      <div v-if="messages.length === 0" class="text-center text-amber-600 py-4 italic">
        Nenhuma mensagem ainda. Seja o primeiro a enviar uma!
      </div>
    </div>
    
    <!-- Área de entrada -->
    <div class="p-2 border-t border-amber-300 bg-amber-100 rounded-b-lg">
      <div class="flex">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Digite sua mensagem..."
          class="flex-grow px-3 py-2 text-amber-900 border-2 border-amber-300 rounded-l focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
          :disabled="!currentUser"
        />
        <button
          @click="sendMessage"
          :disabled="!currentUser || !newMessage.trim()"
          class="bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 px-4 py-2 rounded-r disabled:opacity-50 hover:from-amber-500 hover:to-amber-700 transition-all"
        >
          <Send class="w-4 h-4" />
        </button>
      </div>
      <div v-if="!currentUser" class="text-xs text-amber-700 mt-1 text-center">
        Faça login para enviar mensagens
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Send, X } from 'lucide-vue-next';
import { getCurrentUser } from '@/firebase/authService';
import { getCurrentUserProfile } from '@/firebase/userProfileService';
import { sendChatMessage, subscribeToChat } from '@/firebase/chatService';

const emit = defineEmits(['close']);

const messages = ref([]);
const newMessage = ref('');
const currentUser = ref(null);
const currentUserId = ref('');
const unsubscribeFromChat = ref(null);
const messagesContainer = ref(null);

// Format time for display
const formatTime = (message) => {
  if (!message) return '';
  
  // Try to get the timestamp from either createdAt or timestamp field
  const timestamp = message.createdAt || message.timestamp;
  
  if (!timestamp) return '';
  
  // If it's a Firebase server timestamp (object), extract the date
  // Otherwise use the string representation
  let date;
  if (typeof timestamp === 'object' && timestamp !== null) {
    // Handle Firebase server timestamp format
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else {
      // If it's an object but not a Firebase timestamp, try to create date from the object
      date = new Date();
    }
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    // If it's a number (timestamp in milliseconds)
    date = new Date(timestamp);
  }
  
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// Load current user
const loadCurrentUser = async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      currentUser.value = user;
      currentUserId.value = user.uid;
      
      // Get user profile for display name
      const profile = await getCurrentUserProfile();
      if (profile) {
        // We'll store the user name in the message when sending
      }
    }
  } catch (error) {
    console.error('Error loading current user:', error);
  }
};

// Send a new message
const sendMessage = async () => {
  console.log('Tentando enviar mensagem...');
  if (!newMessage.value.trim() || !currentUser.value) {
    console.log('Condições não atendidas para envio:', {
      hasText: !!newMessage.value.trim(),
      hasUser: !!currentUser.value
    });
    return;
  }
  
  try {
    console.log('Enviando mensagem:', newMessage.value);
    const profile = await getCurrentUserProfile();
    console.log('Perfil do usuário:', profile);
    
    const messageData = {
      text: newMessage.value.trim(),
      userId: currentUser.value.uid,
      userName: profile?.name || profile?.email?.split('@')[0] || 'Anônimo',
      timestamp: Date.now() // This will be replaced by Firebase server timestamp
    };
    
    console.log('Dados da mensagem:', messageData);
    await sendChatMessage(messageData);
    console.log('Mensagem enviada com sucesso');
    newMessage.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Erro ao enviar mensagem: ' + error.message);
  }
};

// Scroll to bottom of messages
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Close chat
const closeChat = () => {
  emit('close');
};

onMounted(async () => {
  // Load current user
  await loadCurrentUser();
  
  // Subscribe to chat messages
  unsubscribeFromChat.value = subscribeToChat((newMessages) => {
    messages.value = newMessages;
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  });
});

onUnmounted(() => {
  // Unsubscribe from chat when component is destroyed
  if (unsubscribeFromChat.value) {
    unsubscribeFromChat.value();
  }
});

// Scroll to bottom initially
onMounted(() => {
  scrollToBottom();
});
</script>