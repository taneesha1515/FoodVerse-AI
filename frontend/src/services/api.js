const API_BASE = '/api';

export const api = {
  // Health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline', gemini_configured: false };
    }
  },

  // Set API Key
  async setApiKey(geminiKey) {
    const res = await fetch(`${API_BASE}/config/set-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gemini_api_key: geminiKey })
    });
    return await res.json();
  },

  // Epic 2: Nutrition
  async getNutritionSamples() {
    const res = await fetch(`${API_BASE}/nutrition/samples`);
    return await res.json();
  },

  async analyzeNutrition({ file, sampleId }) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (sampleId) formData.append('sample_id', sampleId);

    const res = await fetch(`${API_BASE}/nutrition/analyze`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Nutrition analysis failed');
    return await res.json();
  },

  // Epic 3: Freshness
  async getFreshnessSamples() {
    const res = await fetch(`${API_BASE}/freshness/samples`);
    return await res.json();
  },

  async inspectFreshness({ file, sampleId }) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (sampleId) formData.append('sample_id', sampleId);

    const res = await fetch(`${API_BASE}/freshness/inspect`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Freshness inspection failed');
    return await res.json();
  },

  // Epic 4: Hygiene
  async getHygieneSamples() {
    const res = await fetch(`${API_BASE}/hygiene/samples`);
    return await res.json();
  },

  async auditHygiene({ file, sampleId }) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (sampleId) formData.append('sample_id', sampleId);

    const res = await fetch(`${API_BASE}/hygiene/audit`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Hygiene audit failed');
    return await res.json();
  },

  // Epic 5: Smart Cooking & Recipes
  async generateRecipe(data) {
    const res = await fetch(`${API_BASE}/cooking/recipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Recipe generation failed');
    return await res.json();
  },

  async cookingChat(message, currentRecipe = null) {
    const res = await fetch(`${API_BASE}/cooking/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, current_recipe: currentRecipe })
    });
    if (!res.ok) throw new Error('Chat failed');
    return await res.json();
  },

  async getSubstitutions() {
    const res = await fetch(`${API_BASE}/cooking/substitutions`);
    return await res.json();
  },

  // Epic 5: Meal Planner
  async generateMealPlan(planConfig) {
    const res = await fetch(`${API_BASE}/meal-planner/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planConfig)
    });
    if (!res.ok) throw new Error('Meal plan generation failed');
    return await res.json();
  },

  // History
  async getHistory(limit = 50, module = null) {
    let url = `${API_BASE}/history?limit=${limit}`;
    if (module) url += `&module=${module}`;
    const res = await fetch(url);
    return await res.json();
  },

  async deleteHistory(id) {
    const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};
