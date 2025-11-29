<template>
  <div class="mood-progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
    </div>
    <div class="progress-label">
      <span>{{ progressPercentage }}% {{ progressMood }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

const progressPercentage = ref(0)
const progressMood = ref('')

const loadProgressData = async () => {
  const auth = getAuth()
  const user = auth.currentUser
  
  if (!user) return

  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      
      // Calcular progresso baseado nos humores acumulados
      if (userData.moodHistory && userData.moodHistory.length > 0) {
        calculateProgress(userData.moodHistory)
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados de progresso:', error)
  }
}

const calculateProgress = (moodHistory) => {
  // Lógica de cálculo de progresso baseado nos humores
  // Mapeamento de valores emocionais
  const moodValues = {
    'feliz': 10,
    'contente': 9,
    'animado': 8,
    'motivado': 7,
    'calmo': 6,
    'neutro': 5,
    'triste': 4,
    'cansado': 3,
    'ansioso': 2,
    'deprimido': 1,
    'raivoso': 2, // Valor negativo
    'estressado': 2 // Valor negativo
  }

  let totalValue = 0
  const moodCounts = {}
  
  moodHistory.forEach(item => {
    const mood = item.mood.toLowerCase()
    totalValue += moodValues[mood] || 5 // Valor padrão para humores não mapeados
    
    moodCounts[mood] = (moodCounts[mood] || 0) + 1
  })

  // Calcular média ponderada dos valores emocionais
  const averageValue = totalValue / moodHistory.length
  
  // Determinar o humor predominante (o mais recente, ou o mais frequente)
  let mostCommonMood = ''
  let maxCount = 0
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      maxCount = count
      mostCommonMood = mood.charAt(0).toUpperCase() + mood.slice(1)
    }
  }
  
  // Converter valor médio em porcentagem (0-100)
  // Valor 1-10 convertido para 0-100%
  progressPercentage.value = Math.round(((averageValue - 1) / 9) * 100)
  progressMood.value = mostCommonMood || 'Neutro'
}

onMounted(() => {
  loadProgressData()
})
</script>

<style scoped>
.mood-progress-container {
  margin-top: 10px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #b45309);
  transition: width 0.5s ease;
  border-radius: 10px;
}

.progress-label {
  margin-top: 5px;
  text-align: center;
  color: #5a3e36;
  font-size: 14px;
  font-weight: bold;
}
</style>