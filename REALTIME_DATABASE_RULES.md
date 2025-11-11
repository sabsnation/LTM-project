# Configuração das Regras de Segurança do Firebase Realtime Database

Para que o chat funcione corretamente, é necessário configurar as regras de segurança do Realtime Database no console do Firebase.

## Regras de Segurança

Acesse o console do Firebase em https://console.firebase.google.com/ e vá até "Realtime Database" e clique em "Rules". Substitua as regras existentes pelo seguinte código:

```
{
  "rules": {
    "chat_messages": {
      ".read": "auth != null",  // Apenas usuários autenticados podem ler
      ".write": "auth != null", // Apenas usuários autenticados podem escrever
      ".indexOn": ["timestamp"] // Indexar por timestamp para ordenação eficiente
    }
  }
}
```

## Explicação das Regras

- `.read`: Permite que apenas usuários autenticados leiam as mensagens do chat
- `.write`: Permite que apenas usuários autenticados escrevam mensagens no chat
- `.indexOn`: Cria um índice no campo timestamp para melhorar a performance da ordenação das mensagens

## Importância das Regras

Sem essas regras configuradas, o Realtime Database bloqueia por padrão todas as operações de leitura e escrita, o que impede o funcionamento correto do chat.

## Testando as Regras

1. Após aplicar as regras, clique em "Publish" para publicá-las
2. Atualize o aplicativo para testar o funcionamento do chat
3. As mensagens devem agora ser persistentes e visíveis para todos os usuários que entram no chat

## Segurança Adicional (Opcional)

Se você quiser aumentar a segurança, pode limitar o número de mensagens que podem ser lidas ou escritas por minuto por usuário:

```
{
  "rules": {
    "chat_messages": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["timestamp"],
      "$message_id": {
        // Limitar tamanho das mensagens
        "text": {
          ".validate": "newData.isString() && newData.val().length <= 500"
        },
        // Validar estrutura da mensagem
        ".validate": "newData.hasChildren(['text', 'userId', 'userName', 'timestamp'])"
      }
    }
  }
}
```