# Configuração do Firebase Functions para Notificações por E-mail

## Instalação do Firebase CLI

Primeiro, você precisa instalar o Firebase CLI globalmente:

```bash
npm install -g firebase-tools
```

## Configuração das variáveis de ambiente

Antes de implantar as funções, você precisa configurar as variáveis de ambiente para:

1. Configurar o e-mail do remetente:
```bash
firebase functions:config:set email.user="seuemail@gmail.com" email.pass="suasenhaapp"
```

2. Configurar a URL do seu aplicativo:
```bash
firebase functions:config:set app.url="https://seudominio.com"
```

## Configuração do Gmail para envio de e-mails

Se você estiver usando Gmail, você precisará:

1. Ativar a "Less secure app access" ou
2. Criar uma "App Password" (recomendado):
   - Vá para https://myaccount.google.com/
   - Vá para "Security"
   - Ative 2-step verification
   - Crie um App Password para o Firebase Functions
   - Use esse App Password no lugar da senha normal

## Implantação das funções

Para implantar as funções, execute:

```bash
firebase deploy --only functions
```

## Testando as funções

As funções são acionadas automaticamente quando:
1. Uma carta é atualizada e passa a estar desbloqueada (data de abertura <= data atual)
2. Ou chamando a função `sendManualUnlockEmail` via Cloud Function chamada

## Estrutura das funções

1. `sendUnlockNotificationEmail` - Função que é acionada automaticamente quando uma carta é atualizada no Firestore e passa a estar desbloqueada
2. `sendManualUnlockEmail` - Função chamável que pode ser usada para enviar e-mails de notificação manualmente

## Importante

Lembre-se de que o uso de `nodemailer` com serviços como Gmail pode estar sujeito a limites de taxa e políticas de segurança. Em produção, considere usar serviços de e-mail como SendGrid, Mailgun, ou o próprio Google Workspace para envios mais robustos.