<template>
  <div class="mood-tracker-container">
    <div class="mood-tracker" @click="showMoodModal = true">
      <img src="@/assets/gato-humor.png" alt="Gatinho Sir Favo de Mel" class="mood-icon">
      <div class="mood-message">
        <p>{{ dailyMood || 'Como você está se sentindo hoje?' }}</p>
      </div>
    </div>

    <!-- Modal de Registro de Humor -->
    <div v-if="showMoodModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Gatinho Sir Favo de Mel</h3>
        </div>
        <div class="modal-body">
          <p>Gatinho Sir Favo de Mel deseja saber seu humor de hoje. Ele é apenas curioso.</p>
          
          <div class="mood-input">
            <label>Como você está se sentindo?</label>
            <input 
              v-model="currentMood" 
              type="text" 
              placeholder="Digite seu humor em uma palavra..."
              @keyup.enter="saveMood"
            >
          </div>
          
          <div class="mood-suggestions">
            <button 
              v-for="suggestion in moodSuggestions" 
              :key="suggestion"
              @click="selectMoodSuggestion(suggestion)"
              class="suggestion-btn"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-cancel">Cancelar</button>
          <button @click="saveMood" class="btn-save">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  updateDoc,
  arrayUnion 
} from 'firebase/firestore'
import { db } from '@/firebase/init'

const showMoodModal = ref(false)
const currentMood = ref('')
const dailyMood = ref('')
const progressPercentage = ref(0)
const progressMood = ref('')

const moodSuggestions = [
  'Feliz', 'Triste', 'Ansioso', 'Calmo', 'Empolgado', 
  'Cansado', 'Motivado', 'Deprimido', 'Grato', 'Confuso'
]

const loadUserMoodData = async () => {
  const auth = getAuth()
  const user = auth.currentUser
  
  if (!user) return

  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      dailyMood.value = userData.dailyMood || ''
      
      // Calcular progresso baseado nos humores acumulados
      if (userData.moodHistory && userData.moodHistory.length > 0) {
        calculateProgress(userData.moodHistory)
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados de humor:', error)
  }
}

const saveMood = async () => {
  if (!currentMood.value.trim()) return

  const auth = getAuth()
  const user = auth.currentUser
  
  if (!user) return

  try {
    const userDocRef = doc(db, 'users', user.uid)
    
    // Adiciona o humor atual ao histórico
    await updateDoc(userDocRef, {
      dailyMood: currentMood.value.trim(),
      moodHistory: arrayUnion({
        mood: currentMood.value.trim(),
        timestamp: new Date(),
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      })
    })

    dailyMood.value = currentMood.value.trim()
    currentMood.value = ''
    closeModal()

    // Recalcula o progresso após salvar
    await loadUserMoodData()
  } catch (error) {
    console.error('Erro ao salvar humor:', error)
  }
}

const selectMoodSuggestion = (suggestion) => {
  currentMood.value = suggestion
}

const closeModal = () => {
  showMoodModal.value = false
  currentMood.value = ''
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
      mostCommonMood = mood
    }
  }
  
  // Converter valor médio em porcentagem (0-100)
  // Valor 1-10 convertido para 0-100%
  progressPercentage.value = Math.round(((averageValue - 1) / 9) * 100)
  progressMood.value = mostCommonMood || 'neutro'
}

onMounted(() => {
  loadUserMoodData()
})
</script>

<style scoped>
.mood-tracker-container {
  position: relative;
}

.mood-tracker {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #d97706;
  border-radius: 8px;
  background-color: #fef7ed;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mood-tracker:hover {
  background-color: #fdebd0;
  transform: translateY(-2px);
}

.mood-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.mood-message p {
  margin: 0;
  color: #5a3e36;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header h3 {
  margin: 0 0 15px 0;
  color: #b45309;
  text-align: center;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-body p {
  margin-bottom: 15px;
  color: #5a3e36;
  text-align: center;
}

.mood-input {
  margin-bottom: 15px;
}

.mood-input label {
  display: block;
  margin-bottom: 5px;
  color: #5a3e36;
  font-weight: bold;
}

.mood-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d97706;
  border-radius: 5px;
  font-size: 16px;
}

.mood-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.suggestion-btn {
  padding: 5px 10px;
  background-color: #fef7ed;
  border: 1px solid #d97706;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background-color: #fdebd0;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
}

.btn-cancel, .btn-save {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-cancel {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #d1d5db;
}

.btn-save {
  background-color: #b45309;
  color: white;
}

.btn-save:hover {
  background-color: #92400e;
}
</style>