import api from './api'

export const callGeminiAPI = async (prompt, imageBase64 = null) => {
  try {
    // Call your FastAPI backend instead of direct Gemini API
    const response = await api.post('/api/gemini/analyze', {
      prompt,
      image: imageBase64
    })
    
    return response.data.result
  } catch (error) {
    console.error('Gemini API error:', error)
    
    // Fallback to mock responses for development
    return simulateGeminiResponse(prompt, imageBase64)
  }
}

// Simulate Gemini responses for development
const simulateGeminiResponse = async (prompt, imageBase64) => {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  const lowerPrompt = prompt.toLowerCase()

  if (imageBase64 || lowerPrompt.includes('disease') || lowerPrompt.includes('leaf') || lowerPrompt.includes('plant')) {
    const diseases = [
      "Septoria Leaf Spot detected. Apply Neem Oil spray every 7 days. Remove affected leaves and ensure proper drainage.",
      "Early Blight identified. Use Copper-based fungicide. Improve air circulation and avoid overhead watering.",
      "Powdery Mildew found. Apply Baking Soda solution (1 tsp per liter). Increase sunlight exposure.",
      "Bacterial Leaf Spot detected. Remove infected parts immediately. Apply Copper Hydroxide spray.",
      "Healthy plant detected! Continue current care routine. Monitor for any changes."
    ]
    return diseases[Math.floor(Math.random() * diseases.length)]
  }

  if (lowerPrompt.includes('price') || lowerPrompt.includes('market') || lowerPrompt.includes('sell')) {
    return `Current market analysis: Tomato prices are ₹45/kg (+7% from yesterday). Recommendation: Sell 45% today at ₹23-25/kg, 30% tomorrow at ₹22-25/kg. Store unripe ones due to predicted hailstorm. Need storage advice? Just ask!`
  }

  if (lowerPrompt.includes('scheme') || lowerPrompt.includes('subsidy') || lowerPrompt.includes('government')) {
    return `Based on your profile, you're eligible for PM-KISAN (₹6000/year), Crop Insurance, and Seed Subsidy. For PM-KISAN: Visit nearest CSC with Aadhaar, bank details, and land documents. Application deadline: March 31st.`
  }

  if (lowerPrompt.includes('sow') || lowerPrompt.includes('plant') || lowerPrompt.includes('harvest') || lowerPrompt.includes('when')) {
    return `For your location, optimal sowing window for Wheat: Nov 15-30, Harvest: April. Rice: Sow Jun 1-15, Harvest: October. Brinjal: Sow year-round, best in Feb-Mar and Jun-Jul. Consider soil temperature and moisture levels.`
  }

  return `I'm here to help with your farming needs! You can ask me about crop diseases, market prices, government schemes, sowing schedules, or any other agricultural questions. How can I assist you today?`
}