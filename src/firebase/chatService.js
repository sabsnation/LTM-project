import {
  ref as dbRef,
  push,
  query,
  limitToLast,
  onValue,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "@/firebase/init";

// Referência principal das mensagens
const chatMessagesRef = dbRef(rtdb, "chat_messages");

// Enviar mensagem
const sendChatMessage = async (messageData) => {
  try {
    console.log("Tentando enviar mensagem:", messageData);

    // Criar objeto da mensagem com timestamp do servidor
    const messageToSend = {
      text: messageData.text || "",
      userId: messageData.userId || "desconhecido",
      userName: messageData.userName || "Anônimo",
      timestamp: serverTimestamp(), // Usar timestamp do servidor para consistência
    };

    console.log("Dados preparados para envio:", messageToSend);

    const result = await push(chatMessagesRef, messageToSend);
    console.log("Mensagem enviada com sucesso, ID:", result.key);
    return result.key;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw error;
  }
};

// Receber mensagens em tempo real
const subscribeToChat = (callback) => {
  console.log("Iniciando subscrição ao chat...");

  const messagesQuery = query(chatMessagesRef, limitToLast(50));

  const unsubscribe = onValue(
    messagesQuery,
    (snapshot) => {
      if (!snapshot.exists()) {
        console.log("Nenhuma mensagem encontrada.");
        callback([]);
        return;
      }

      const messages = [];
      snapshot.forEach((child) => {
        const data = child.val();

        // Processar o timestamp do servidor corretamente
        let timestampValue = 0;
        if (data.timestamp && typeof data.timestamp === 'object' && data.timestamp.hasOwnProperty('.sv')) {
          // É um timestamp do servidor, converter para timestamp local
          timestampValue = Date.now();
        } else if (typeof data.timestamp === 'number') {
          timestampValue = data.timestamp;
        } else {
          timestampValue = Date.now();
        }

        messages.push({
          id: child.key,
          text: data.text || "",
          userId: data.userId || "desconhecido",
          userName: data.userName || "Anônimo",
          timestamp: timestampValue,
        });
      });

      // Ordenar por timestamp numérico crescente
      messages.sort((a, b) => a.timestamp - b.timestamp);

      console.log("Mensagens recebidas do Firebase:", messages);
      callback(messages);
    },
    (error) => {
      console.error("Erro na subscrição do chat:", error);
    }
  );

  return unsubscribe;
};

export { sendChatMessage, subscribeToChat };
