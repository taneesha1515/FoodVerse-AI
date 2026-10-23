import React, { useState, useEffect } from 'react';
import { 
  CalendarRange, 
  Sparkles, 
  Flame, 
  Dna, 
  Wheat, 
  Droplet, 
  ShoppingCart, 
  CheckCircle2, 
  Target
} from 'lucide-react';
import { api } from '../services/api';

export default function MealPlannerView() {
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [goal, setGoal] = useState("Muscle Gain");
  const [dietType, setDietType] = useState("High-Protein");
  const [daysCount, setDaysCount] = useState(7);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const data = await api.generateMealPlan({
        calorie_target: parseInt(calorieTarget),
        goal,
        diet_type: dietType,
        days_count: daysCount
      });
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-2">
          <CalendarRange className="w-3.5 h-3.5" />
          <span>Personalized Nutrition Planning Module</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Intelligent Meal Planner & Macro Balancer
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Constructs metabolic diet regimens aligned with your body composition targets, glycemic goals, and weekly shopping lists.
        </p>
      </div>

      {/* Configuration Controls Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Daily Calorie Target: <span className="text-teal-400">{calorieTarget} kcal</span>
            </label>
            <input
              type="range"
              min="1400"
              max="3500"
              step="50"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(e.target.value)}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Primary Fitness Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="Weight Loss">Weight Loss & Lean Cut</option>
              <option value="Muscle Gain">Muscle Hypertrophy & Gain</option>
              <option value="Maintenance">Metabolic Maintenance</option>
              <option value="Endurance">Cardio & Athletic Endurance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Dietary Protocol</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="Balanced">Balanced Whole-Foods</option>
              <option value="High-Protein">High-Protein (30%+)</option>
              <option value="Keto">Ketogenic Low-Carb</option>
              <option value="Mediterranean">Mediterranean Heart-Health</option>
              <option value="Vegan">Vegan Plant-Powered</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              {loading ? "Generating Plan..." : "Regenerate Plan"}
            </button>
          </div>
        </div>

        {plan && (
          <p className="text-xs text-slate-400 leading-relaxed pt-3 border-t border-slate-800">
            {plan.weekly_summary}
          </p>
        )}
      </div>

      {/* Plan Schedule & Shopping List */}
      {plan && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Days Grid */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {daysCount}-Day Meal Schedule
            </h3>

            <div className="space-y-3">
              {plan.daily_plans.map((dayPlan, idx) => (
                <div key={idx} className="p-5 rounded-3xl glass-card border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-teal-300">{dayPlan.day}</span>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-white font-bold">{dayPlan.total_calories} kcal</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-cyan-400">{dayPlan.protein_g}g P</span>
                      <span className="text-emerald-400">{dayPlan.carbs_g}g C</span>
                      <span className="text-purple-400">{dayPlan.fat_g}g F</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Breakfast</span>
                      <span className="text-slate-200 font-medium mt-0.5 block">{dayPlan.breakfast}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Lunch</span>
                      <span className="text-slate-200 font-medium mt-0.5 block">{dayPlan.lunch}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Dinner</span>
                      <span className="text-slate-200 font-medium mt-0.5 block">{dayPlan.dinner}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Snack</span>
                      <span className="text-slate-200 font-medium mt-0.5 block">{dayPlan.snacks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grocery Shopping List */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-teal-400" />
                <h4 className="text-sm font-bold text-white">Smart Grocery Cart</h4>
              </div>

              <div className="space-y-2 mb-6">
                {plan.shopping_list.map((item, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-300 text-center font-mono">
                Optimized for zero-waste pantry management
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
