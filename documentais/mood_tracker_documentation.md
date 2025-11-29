# Funcionalidade de Rastreamento de Humor - Gatinho Sir Favo de Mel

## Descrição

A funcionalidade de rastreamento de humor foi adicionada ao perfil do usuário (dentro da "casa" do usuário). Ela permite que o usuário registre seu humor diário e visualize um progresso emocional baseado nos humores acumulados.

## Componentes

### MoodTracker.vue
- Exibe o gatinho Sir Favo de Mel como ícone de humor
- Exibe o humor atual do dia
- Abre um modal quando o usuário clica no ícone
- O modal permite registrar o humor em uma única palavra
- Inclui sugestões de humores comuns

### MoodProgress.vue
- Exibe uma barra de progresso baseada nos humores acumulados
- Calcula um percentual baseado na média ponderada dos valores emocionais
- Exibe o humor predominante

## Integração

O rastreamento de humor foi integrado ao componente PatientProfile.vue logo abaixo das informações básicas do usuário, na seção "Minha Casa".

## Funcionalidades

1. Registro diário de humor em uma única palavra
2. Visualização do humor atual do dia
3. Cálculo de progresso emocional baseado nos humores acumulados
4. Sugestões de humores comuns
5. Armazenamento no Firestore em tempo real

## Valores Emocionais

A funcionalidade associa valores numéricos aos humores:
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

## Estrutura de Dados no Firestore

- `dailyMood` (string): Humor do dia atual
- `moodHistory` (array): Histórico de humores registrados com timestamp e data

## Como Usar

1. Acesse a "casa" do usuário (perfil)
2. Clique no ícone do gatinho Sir Favo de Mel
3. Registre seu humor em uma única palavra
4. Veja o humor aparecer na interface e o progresso emocional atualizado