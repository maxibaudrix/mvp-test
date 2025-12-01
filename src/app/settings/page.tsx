// src/app/settings/page.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useUserStore, GoalType, ActivityLevel, DietType, NovaLevel, NutriScore } from '@/store/user';
import { User, Target, Utensils, Zap, Bell, LogOut, Download, Trash, Save, Loader2, Minus, Plus } from 'lucide-react';

// Componente utilitario de Input (Simulado)
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
    />
  </div>
);

// Componente utilitario de Select
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: string[] }> = ({ label, options, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-shadow appearance-none"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

// Componente de Botón de Guardar
const SaveButton: React.FC<{ onClick: () => void, isLoading: boolean, label: string }> = ({ onClick, isLoading, label }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-4"
  >
    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
    <span>{label}</span>
  </button>
);

// --- Componentes de Sección ---

const ProfileSection: React.FC = () => {
  const { profile, updateProfile, isLoading } = useUserStore();
  const [localProfile, setLocalProfile] = useState(profile);

  // Sincronizar estado local con el store
  useEffect(() => { setLocalProfile(profile); }, [profile]);
  
  const handleSave = () => updateProfile(localProfile);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img 
          src={profile.profileImageUrl} 
          alt="Perfil" 
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
        />
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          Subir foto de perfil (Upload)
        </button>
      </div>

      <Input
        label="Nombre"
        value={localProfile.name}
        onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
      />
      
      <Input
        label="Email"
        value={profile.email}
        readOnly
        className="bg-gray-100 cursor-not-allowed"
      />
      
      <Input
        label="Fecha de nacimiento"
        type="date"
        value={localProfile.birthdate}
        onChange={(e) => setLocalProfile({ ...localProfile, birthdate: e.target.value })}
      />

      <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Perfil" />
    </div>
  );
};

const GoalsSection: React.FC = () => {
  const { goals, updateGoals, recalculateMacros, isLoading } = useUserStore();
  const [localGoals, setLocalGoals] = useState(goals);

  useEffect(() => { setLocalGoals(goals); }, [goals]);
  
  const goalOptions: GoalType[] = ['Perder grasa', 'Ganar músculo', 'Mantenimiento'];
  const speedOptions = ['Lenta', 'Moderada', 'Rápida'];

  const handleSave = () => updateGoals(localGoals);

  return (
    <div className="space-y-6">
      <Select
        label="Objetivo actual"
        value={localGoals.currentGoal}
        options={goalOptions}
        onChange={(e) => setLocalGoals({ ...localGoals, currentGoal: e.target.value as GoalType })}
      />

      <Input
        label="Peso objetivo (kg)"
        type="number"
        min="30"
        value={localGoals.targetWeightKg}
        onChange={(e) => setLocalGoals({ ...localGoals, targetWeightKg: parseFloat(e.target.value) })}
      />

      <Select
        label="Velocidad"
        value={localGoals.speed}
        options={speedOptions}
        onChange={(e) => setLocalGoals({ ...localGoals, speed: e.target.value as 'Lenta' | 'Moderada' | 'Rápida' })}
      />

      <div className="bg-indigo-50 p-4 rounded-xl shadow-inner border border-indigo-200">
        <h3 className="font-bold text-indigo-700 mb-2">Macros Calculados</h3>
        <p className="text-sm text-indigo-600">
          Proteína: <span className="font-semibold">{goals.calculatedMacros.protein}g</span>, 
          Carbohidratos: <span className="font-semibold">{goals.calculatedMacros.carbs}g</span>, 
          Grasas: <span className="font-semibold">{goals.calculatedMacros.fats}g</span>
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Objetivos" />
        <button
          onClick={recalculateMacros}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
          <span>Recalcular Macros</span>
        </button>
      </div>
    </div>
  );
};

const DietSection: React.FC = () => {
  const { diet, updateDiet, isLoading } = useUserStore();
  const [localDiet, setLocalDiet] = useState(diet);

  useEffect(() => { setLocalDiet(diet); }, [diet]);
  
  const dietOptions: DietType[] = ['Omnívora', 'Vegetariana', 'Vegana', 'Cetogénica'];
  const nutriScoreOptions: NutriScore[] = ['A', 'B', 'C', 'D', 'E'];
  const novaOptions = [1, 2, 3, 4].map(n => `Máximo nivel ${n}`);

  const handleAllergyChange = (allergy: string) => {
    const isPresent = localDiet.allergies.includes(allergy);
    setLocalDiet(prev => ({
      ...prev,
      allergies: isPresent 
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };
  
  const handleSave = () => updateDiet(localDiet);

  return (
    <div className="space-y-6">
      <Select
        label="Tipo de dieta"
        value={localDiet.dietType}
        options={dietOptions}
        onChange={(e) => setLocalDiet({ ...localDiet, dietType: e.target.value as DietType })}
      />

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Alergias</h3>
        <div className="flex flex-wrap gap-2">
          {['Lactosa', 'Gluten', 'Frutos Secos', 'Mariscos'].map(allergy => (
            <button
              key={allergy}
              onClick={() => handleAllergyChange(allergy)}
              className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
                localDiet.allergies.includes(allergy)
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>
      
      <Select
        label="Preferencias NOVA (Procesamiento Mínimo)"
        value={`Máximo nivel ${localDiet.maxNovaLevel}`}
        options={novaOptions}
        onChange={(e) => setLocalDiet({ ...localDiet, maxNovaLevel: parseInt(e.target.value.split(' ')[2]) as NovaLevel })}
      />

      <Select
        label="Nutri-Score mínimo aceptado"
        value={localDiet.minNutriScore}
        options={nutriScoreOptions}
        onChange={(e) => setLocalDiet({ ...localDiet, minNutriScore: e.target.value as NutriScore })}
      />

      <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Dieta" />
    </div>
  );
};

const ActivitySection: React.FC = () => {
  const { activity, updateActivity, isLoading } = useUserStore();
  const [localActivity, setLocalActivity] = useState(activity);

  useEffect(() => { setLocalActivity(activity); }, [activity]);
  
  const levelOptions: ActivityLevel[] = ['Sedentario', 'Ligeramente activo', 'Moderadamente activo', 'Muy activo', 'Extremadamente activo'];
  const typeOptions = ['Fuerza', 'Cardio', 'Mixto'];

  const handleSave = () => updateActivity(localActivity);

  return (
    <div className="space-y-6">
      <Select
        label="Nivel de actividad"
        value={localActivity.activityLevel}
        options={levelOptions}
        onChange={(e) => setLocalActivity({ ...localActivity, activityLevel: e.target.value as ActivityLevel })}
      />

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Días de entreno/semana</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLocalActivity(prev => ({ ...prev, trainingDaysPerWeek: Math.max(0, prev.trainingDaysPerWeek - 1) }))}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            disabled={localActivity.trainingDaysPerWeek <= 0}
          >
            <Minus className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-xl font-bold w-10 text-center">{localActivity.trainingDaysPerWeek}</span>
          <button
            onClick={() => setLocalActivity(prev => ({ ...prev, trainingDaysPerWeek: Math.min(7, prev.trainingDaysPerWeek + 1) }))}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            disabled={localActivity.trainingDaysPerWeek >= 7}
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      <Select
        label="Tipo de ejercicio predominante"
        value={localActivity.predominantType}
        options={typeOptions}
        onChange={(e) => setLocalActivity({ ...localActivity, predominantType: e.target.value as 'Fuerza' | 'Cardio' | 'Mixto' })}
      />

      <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Actividad" />
    </div>
  );
};

const NotificationsSection: React.FC = () => {
  const { notifications, updateNotifications, isLoading } = useUserStore();
  
  // Use a local change handler that directly calls the store for simplicity in checkboxes
  const handleToggle = (key: keyof typeof notifications) => {
    updateNotifications({ [key]: !notifications[key] });
  };
  
  const ToggleRow: React.FC<{ label: string, isChecked: boolean, onChange: () => void, detail?: string }> = ({ label, isChecked, onChange, detail }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{label}</span>
        {detail && <span className="text-xs text-gray-500">{detail}</span>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={isChecked} 
          onChange={onChange} 
          disabled={isLoading}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
  
  return (
    <div className="space-y-4">
      <ToggleRow 
        label="Email notifications" 
        isChecked={notifications.email} 
        onChange={() => handleToggle('email')}
        detail="Recibe resúmenes semanales y actualizaciones."
      />
      <ToggleRow 
        label="Push notifications" 
        isChecked={notifications.push} 
        onChange={() => handleToggle('push')}
        detail="Alertas importantes en tu dispositivo móvil."
      />
      <ToggleRow 
        label="Recordatorio de agua" 
        isChecked={notifications.waterReminderEnabled} 
        onChange={() => handleToggle('waterReminderEnabled')}
        detail={`Cada ${notifications.waterReminderIntervalHours} horas.`}
      />
      <ToggleRow 
        label="Recordatorio de comida" 
        isChecked={notifications.mealReminderEnabled} 
        onChange={() => handleToggle('mealReminderEnabled')}
        detail="Recordatorios basados en tus horarios de comida configurados."
      />
    </div>
  );
};

const AccountSection: React.FC = () => {
  const { deleteAccount, isLoading } = useUserStore();
  
  return (
    <div className="space-y-6">
      <button className="w-full flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
        <LogOut className="w-5 h-5 text-gray-500" />
        <span>Cambiar contraseña</span>
      </button>
      
      <button className="w-full flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
        <Download className="w-5 h-5 text-gray-500" />
        <span>Exportar datos (GDPR)</span>
      </button>

      <div className="pt-4 border-t border-red-100">
        <button 
          onClick={deleteAccount}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash className="w-5 h-5" />}
          <span>Eliminar cuenta</span>
        </button>
      </div>
    </div>
  );
};

// --- Componente Principal ---

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Perfil');
  const { fetchProfile } = useUserStore();

  const tabs = [
    { name: 'Perfil', icon: User, component: ProfileSection },
    { name: 'Objetivos', icon: Target, component: GoalsSection },
    { name: 'Dieta', icon: Utensils, component: DietSection },
    { name: 'Actividad', icon: Zap, component: ActivitySection },
    { name: 'Notificaciones', icon: Bell, component: NotificationsSection },
    { name: 'Cuenta', icon: LogOut, component: AccountSection },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component || ProfileSection;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Configuración</h1>

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        
        {/* Panel de Navegación (Tabs) */}
        <div className="w-full lg:w-64 mb-6 lg:mb-0 bg-white rounded-2xl shadow-xl p-4 flex-shrink-0">
          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors min-w-max ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido de la Sección Activa */}
        <div className="flex-grow bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">{activeTab}</h2>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;