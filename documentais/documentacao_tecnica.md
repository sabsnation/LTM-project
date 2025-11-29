# 5. DOCUMENTAÇÃO TÉCNICA

## 5.1 Arquitetura do Sistema

O LetterMatter foi desenvolvido utilizando uma arquitetura em 3 camadas (Frontend, Backend e Banco de Dados), seguindo o padrão Cliente-Servidor e comunicação via API REST, garantindo modularidade, escalabilidade e fácil manutenção.

A comunicação entre as camadas ocorre via HTTP/HTTPS, utilizando JSON como formato padrão de entrada e saída.

A plataforma adota o paradigma NoSQL Documental com Firebase Firestore, alinhando-se perfeitamente com os requisitos de uma aplicação web moderna e escalável, permitindo evolução natural dos dados e escalabilidade automática.

## 5.1.1 Camada de Apresentação (Frontend)

Responsável por toda interface e interação com o usuário, implementada em Vue.js com componentes reativos e responsivos.

Principais responsabilidades:
● Renderização dos componentes visuais responsivos (SPA).
● Navegação cliente-side (Vue Router).
● Integração com serviços Firebase via SDK.
● Gerenciamento de estado de autenticação (Pinia).
● Validação visual de formulários e entradas.
● Implementação dos módulos:
  ○ Login e registro (pacientes e terapeutas)
  ○ Dashboard de pacientes
  ○ Dashboard de terapeutas
  ○ Escrita de cartas com editor de texto
  ○ Gerenciamento de vínculos terapeuta-paciente
  ○ Visualização de cartas desbloqueadas
  ○ Compartilhamento consentido de cartas

## 5.1.2 Camada de Lógica de Negócios (Backend)

A lógica de negócios está distribuída entre os componentes do frontend e as funções do Firebase (Cloud Functions), atuando como núcleo do sistema para processamento de regras complexas e automações.

Principais responsabilidades:
● Processamento das regras de negócio (RN).
● Autenticação e autorização via Firebase Auth.
● Geração automática de notificações de desbloqueio.
● Validação de vínculos entre pacientes e terapeutas.
● Processamento de criptografia E2EE (cliente-side).
● Implementação de funções serverless:
  ○ sendUnlockNotificationEmail: envio automático de e-mails
  ○ sendManualUnlockEmail: disparo manual de notificações

## 5.1.3 Camada de Dados (Firebase)

A camada de dados utiliza o Firebase Firestore como banco de dados NoSQL documental, proporcionando escalabilidade automática e baixa latência.

Coleções principais:
● users: armazena informações dos pacientes
● therapists: armazena informações dos profissionais verificados
● letters: armazena as cartas criptografadas com data de desbloqueio
● invitations: gerencia os vínculos entre pacientes e terapeutas
● library_writings: armazena escritas adicionais do usuário

## 5.2 Tecnologias Utilizadas

### Frontend
● Vue.js 3: Framework JavaScript para construção da interface
● Vue Router: Gerenciamento de rotas
● Pinia: Gerenciamento de estado
● Firebase SDK: Integração com serviços Firebase
● Tailwind CSS: Framework de estilização
● Vite: Ferramenta de build e desenvolvimento

### Backend
● Firebase Auth: Autenticação e autorização
● Firestore: Banco de dados NoSQL documental
● Firebase Functions: Funções serverless
● Firebase Storage: Armazenamento de mídia

## 5.3 Segurança e Criptografia

O sistema implementa criptografia de ponta-a-ponta (E2EE) no cliente, garantindo que o conteúdo das cartas seja ilegível para o servidor. Apenas o proprietário da carta detém as chaves necessárias para descriptografar o conteúdo.

As regras de segurança do Firestore garantem que:
● Um usuário só acesse seus próprios dados
● Terapeutas só leiam cartas explicitamente compartilhadas
● Dados sensíveis sejam protegidos adequadamente

## 5.4 Regras de Negócio Implementadas

1. **Verificação Obrigatória de Terapeuta**: Uma conta de "Terapeuta" só pode se vincular a pacientes após ter sua documentação verificada e aprovada por um "Administrador".

2. **Imutabilidade Pós-Desbloqueio**: Uma carta, uma vez desbloqueada, torna-se um registro permanente e não pode mais ser alterada ou excluída.

3. **Edição Apenas Pré-Desbloqueio**: O usuário pode editar ou excluir uma carta apenas antes de sua data e hora de desbloqueio.

4. **Data de Desbloqueio Futura**: A data de desbloqueio de uma carta deve ser, no mínimo, 24 horas no futuro a partir de sua criação/edição.

5. **Privacidade como Padrão**: Nenhuma carta é compartilhada por padrão. O compartilhamento é uma ação de aceite (opt-in) explícita para cada carta individualmente.

6. **Vínculo Iniciado pelo Usuário**: O vínculo entre paciente e terapeuta deve ser sempre iniciado ou confirmado pelo paciente.

7. **Vínculo Terapêutico Único**: Um usuário só pode estar vinculado a um terapeuta por vez.

8. **Revogação de Acesso Imediata**: Ao desfazer um vínculo, o terapeuta perde o acesso instantaneamente a todas as cartas compartilhadas.

9. **Acesso de Apenas Leitura e Nota Única**: O terapeuta tem permissão apenas para leitura da carta compartilhada e para adicionar uma única nota, que não pode ser editada após salva.

## 5.5 Estrutura de Componentes

### Componentes de Autenticação
● PatientLogin.vue: Login de pacientes
● PsychologistLogin.vue: Login de terapeutas
● useAuthStore.js: Gerenciamento global de autenticação

### Componentes de Dashboard
● PatientDashboard.vue: Dashboard para pacientes
● PsychologistDashboard.vue: Dashboard para terapeutas

### Componentes de Escrita
● LetterComposer.vue: Editor para criação de cartas
● LetterViewer.vue: Visualização de cartas desbloqueadas

### Componentes de Conexão
● TherapistLink.vue: Vinculação com terapeuta
● InvitationManager.vue: Gerenciamento de convites

## 5.6 Serviços Firebase

### AuthService
● Gerencia autenticação via e-mail/senha e Google
● Fornece funções de registro, login e logout

### FirestoreService
● Operações CRUD para todas as coleções
● Funções de query específicas para cada entidade

### UserProfileService
● Gerencia perfis de usuário
● Funções de vinculação com terapeuta
● Atualização de informações do usuário

## 5.7 Considerações de Desempenho

● Tempo de carregamento principal: otimizado para menos de 3 segundos
● Tempo de resposta de ações críticas: menos de 2 segundos
● Uso de lazy loading para componentes e módulos
● Implementação de cache para dados frequentemente acessados
● Otimização de imagens e recursos estáticos

## 5.8 Considerações de Segurança

● Conformidade com a Lei Geral de Proteção de Dados (LGPD)
● Criptografia E2EE para conteúdo sensível das cartas
● Regras de segurança do Firestore para controle de acesso
● Autenticação multifatorial (Google OAuth)
● Logoff automático após 30 minutos de inatividade
● Registro de atividades críticas para auditoria

## 5.9 Estrutura de Arquivos do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/            # Componentes de autenticação
│   ├── dashboard/       # Componentes de dashboard
│   ├── letters/         # Componentes de escrita e leitura
│   └── moodTracker/     # Componentes de rastreamento de humor
├── views/               # Páginas da aplicação
│   ├── auth/            # Páginas de autenticação
│   ├── dashboard/       # Páginas de dashboard
│   └── letters/         # Páginas de cartas
├── firebase/            # Configuração e serviços Firebase
├── composables/         # Funções reutilizáveis Vue 3
├── router/              # Configuração de rotas
├── stores/              # Stores do Pinia
└── assets/              # Recursos estáticos
```

## 5.10 Funcionalidade de Rastreamento de Humor

O sistema agora inclui uma funcionalidade de rastreamento de humor chamada "Gatinho Sir Favo de Mel", que permite aos usuários registrarem seu humor diário e visualizarem seu progresso emocional ao longo do tempo.

### 5.10.1 Componentes de Humor

A funcionalidade é implementada por dois componentes principais:

#### MoodTracker.vue
- Exibe o ícone do gatinho Sir Favo de Mel
- Exibe o humor atual do dia
- Abre um modal quando o usuário clica no ícone
- Permite registro do humor em uma única palavra
- Inclui sugestões de humores comuns

#### MoodProgress.vue
- Exibe uma barra de progresso baseada nos humores acumulados
- Calcula um percentual baseado na média ponderada dos valores emocionais
- Exibe o humor predominante

### 5.10.2 Integração com o Perfil do Usuário

O rastreador de humor foi integrado ao componente PatientProfile.vue logo abaixo das informações básicas do usuário, na seção "Minha Casa". Quando o usuário clica no ícone do gatinho, um modal aparece solicitando seu humor diário com a mensagem: "Gatinho Sir Favo de Mel deseja saber seu humor de hoje. Ele é apenas curioso."

### 5.10.3 Armazenamento de Dados

Os dados de humor são armazenados no Firestore com a seguinte estrutura:

- `dailyMood` (string): Humor do dia atual
- `moodHistory` (array): Histórico de humores registrados com timestamp e data

### 5.10.4 Cálculo de Progresso

O sistema calcula um progresso emocional baseado nos seguintes valores emocionais:

- 'feliz': 10
- 'contente': 9
- 'animado': 8
- 'motivado': 7
- 'calmo': 6
- 'neutro': 5
- 'triste': 4
- 'cansado': 3
- 'ansioso': 2
- 'deprimido': 1
- 'raivoso': 2
- 'estressado': 2

A porcentagem de progresso é calculada convertendo a média ponderada dos valores emocionais para uma escala de 0 a 100.

## 5.10 Considerações de Escalabilidade

● Arquitetura serverless do Firebase permite escalabilidade automática
● Uso de coleções e subcoleções Firestore para organização eficiente
● Consultas otimizadas com índices apropriados
● Funções do Firebase para processamento assíncrono
● Integração com serviços externos via Cloud Functions