# Instruções para Testar o Chat

## Configuração Necessária

Antes de testar o chat, é necessário configurar as regras de segurança do Realtime Database no Firebase Console:

1. Acesse o Firebase Console: https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá até "Realtime Database" no menu lateral
4. Clique na aba "Rules"
5. Substitua as regras existentes pelas seguintes:

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

6. Clique em "Publish" para aplicar as regras

## Testando o Chat

### Passo 1: Executar o Projeto
```bash
cd /home/sabbs/Downloads/vue-project
npm run dev
```

### Passo 2: Acessar o Chat
1. Faça login no sistema como paciente ou terapeuta
2. Navegue até a página "Torre do Conhecimento" (KnowledgeTower)
3. Clique no botão "Entrar no Salão de Conversas"

### Passo 3: Funcionalidades do Chat
- As mensagens aparecerão para todos os usuários que acessarem o chat
- As mensagens são persistentes e estarão disponíveis para novos usuários
- A interface mostra o nome do usuário e a hora da mensagem
- O chat rola automaticamente para mostrar novas mensagens

## Verificação de Funcionamento

### No Frontend:
- [ ] O componente de chat abre corretamente
- [ ] O campo de entrada de mensagem está visível
- [ ] O botão de envio de mensagem está funcional
- [ ] As mensagens aparecem após serem enviadas
- [ ] As mensagens de outros usuários aparecem em tempo real

### No Firebase Console:
- [ ] As mensagens são salvas no Realtime Database
- [ ] As mensagens contêm os campos corretos (text, userId, userName, timestamp)

## Solução de Problemas

### Se as mensagens não aparecerem:
1. Verifique se o usuário está autenticado
2. Confirme que as regras de segurança do Realtime Database estão configuradas corretamente
3. Verifique o console do navegador por erros

### Se não for possível enviar mensagens:
1. Verifique se o usuário tem permissão para escrever
2. Confirme que as regras de segurança estão corretas
3. Verifique o console do navegador por erros

## Importante

Para que o chat funcione corretamente:
- O Realtime Database deve estar habilitado no Firebase
- As regras de segurança devem permitir leitura e escrita para usuários autenticados
- As chaves de API no arquivo .env devem estar corretas