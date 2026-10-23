import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Repeat, 
  Flame, 
  Timer
} from 'lucide-react';
import { api } from '../services/api';

export default function CookingView() {
  const [ingredientsInput, setIngredientsInput] = useState("Chicken breast, broccoli, lemon, olive oil, garlic");
  const [dietary, setDietary] = useState("Balanced");
  const [cuisine, setCuisine] = useState("Mediterranean");
  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello chef! I'm your Multimodal Cooking Assistant. Ask me anything about ingredient substitutions, kitchen temperatures, or say 'Read current step' for voice coaching!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  
  // Voice state (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    // Generate initial recipe on mount
    handleGenerateRecipe();
  }, []);

  const handleGenerateRecipe = async () => {
    setLoadingRecipe(true);
    try {
      const ingList = ingredientsInput.split(',').map(i => i.trim()).filter(Boolean);
      const data = await api.generateRecipe({
        ingredients: ingList,
        dietary_preference: dietary,
        cuisine_type: cuisine
      });
      setRecipe(data);
      setActiveStepIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecipe(false);
    }
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMessages);
    if (!customText) setChatInput("");
    setChatLoading(true);

    try {
      const res = await api.cookingChat(textToSend, recipe?.recipe_name);
      setMessages([...newMessages, { sender: 'ai', text: res.reply, substitutions: res.suggested_substitutions }]);
      // Speak reply if speaking mode is enabled
      if (isSpeaking && 'speechSynthesis' in window) {
        speakText(res.reply);
      }
    } catch (err) {
      setMessages([...newMessages, { sender: 'ai', text: "Sorry, I had trouble processing that request. Try asking again!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleVoiceListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. You can type in the chat box!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      handleSendMessage(transcript);
    };

    recognition.start();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakCurrentStep = (instruction) => {
    speakText(`Step ${activeStepIndex + 1}: ${instruction}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Epic 5 — Smart Cooking Assistance & Multimodal AI Agent</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Conversational AI Chef & Voice Kitchen Assistant
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Converts recognized pantry ingredients into gourmet meals with dynamic substitutions and hands-free voice audio coaching.
          </p>
        </div>

        {/* Voice Audio Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSpeaking(!isSpeaking)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSpeaking ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isSpeaking ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
            <span>Voice Audio: {isSpeaking ? "Enabled" : "Muted"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recipe Generator & Interactive Steps */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Pantry Input Form */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Pantry-to-Recipe Generator</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Available Ingredients</label>
                <input
                  type="text"
                  value={ingredientsInput}
                  onChange={(e) => setIngredientsInput(e.target.value)}
                  placeholder="e.g. eggs, spinach, tomatoes, feta..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Dietary Preference</label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Balanced">Balanced</option>
                    <option value="High-Protein">High-Protein</option>
                    <option value="Keto">Keto / Low-Carb</option>
                    <option value="Vegan">Vegan / Plant-Based</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cuisine Style</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Asian Fusion">Asian Fusion</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Any">Chef's Choice</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateRecipe}
                disabled={loadingRecipe}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
              >
                {loadingRecipe ? "Chef AI Creating Gourmet Recipe..." : "Create Recipe with AI"}
              </button>
            </div>
          </div>

          {/* Generated Recipe Display */}
          {recipe && (
            <div className="p-6 rounded-3xl glass-card border border-purple-500/20 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-semibold tracking-wider">
                    {recipe.difficulty} • {recipe.servings} Servings
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Prep: {recipe.prep_time_minutes}m</span>
                    <span>Cook: {recipe.cook_time_minutes}m</span>
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {recipe.recipe_name}
                </h3>
              </div>

              {/* Ingredients with Substitute Hints */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Ingredients & Smart Substitutions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="font-semibold text-white">{ing.item}</div>
                      <div className="text-[11px] text-purple-300 font-mono">{ing.amount}</div>
                      {ing.substitute_hint && (
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Repeat className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>Swap: {ing.substitute_hint}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Cooking with Audio Narrator */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Step-by-Step Interactive Cooking
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Step {activeStepIndex + 1} of {recipe.instructions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {recipe.instructions.map((step, idx) => {
                    const isActive = activeStepIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setActiveStepIndex(idx);
                          speakCurrentStep(step.instruction);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-purple-500/10 border-purple-500/40 shadow-md shadow-purple-500/10'
                            : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isActive ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {step.step_number}
                            </span>
                            <span className="text-xs font-semibold text-white">Step {step.step_number}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {step.time_minutes && (
                              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                <Timer className="w-3 h-3 text-amber-400" />
                                {step.time_minutes} min
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakCurrentStep(step.instruction);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Listen to this step"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {step.instruction}
                        </p>

                        {step.safety_tip && (
                          <div className="mt-2 text-[10px] text-amber-300/90 font-mono bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                            <strong>Chef Tip:</strong> {step.safety_tip}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Conversational AI Chef & Voice Input */}
        <div className="lg:col-span-5 flex flex-col h-[650px] glass-panel rounded-3xl border border-slate-800 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ChefHat className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Chef FoodVerse AI</h4>
                <p className="text-[10px] text-slate-400">Live Voice & Text Kitchen Coach</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ready</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {/* If substitutions suggested */}
                  {msg.substitutions && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
                      {msg.substitutions.map((sub, sidx) => (
                        <div key={sidx} className="text-[11px] text-purple-300">
                          <strong>{sub.ingredient}:</strong> {sub.substitute} ({sub.purpose})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                <span>Chef FoodVerse is reasoning...</span>
              </div>
            )}
          </div>

          {/* Chat Input & Mic Trigger */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={toggleVoiceListening}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Speak to Assistant"
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question or request a substitution..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={chatLoading}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
