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

    const messageToSend = {
      ...messageData,
      timestamp: Date.now(), // usar timestamp local (mais estável para ordenação)
      serverTime: serverTimestamp(), // referência do servidor (opcional)
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

        messages.push({
          id: child.key,
          text: data.text || "",
          userId: data.userId || "desconhecido",
          userName: data.userName || "Anônimo",
          timestamp: data.timestamp || 0,
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
