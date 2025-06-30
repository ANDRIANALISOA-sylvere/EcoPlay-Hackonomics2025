import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Confetti } from '@/components/Confetti';
import { ProgressBar } from '@/components/ProgressBar';
import { Nav } from "@/features/homepage/components/Nav";
import { getScenario } from "@/lib/api/scenario";
import { getSteps } from "@/lib/api/steps";
import { getChoices } from "@/lib/api/choices";
import { updateUserProgress } from "@/lib/api/scenario";
import { getCurrentUser } from "@/lib/api/user";

export function ScenarioPage() {
    const { scenarioId } = useParams();
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [userChoices, setUserChoices] = useState([]);
    const [budget, setBudget] = useState(1000);
    const [financialHealth, setFinancialHealth] = useState(100);
    const [xpEarned, setXpEarned] = useState(0);
    const [scenarioCompleted, setScenarioCompleted] = useState(false);
    const [scenarioData, setScenarioData] = useState(null);
    const [stepsData, setStepsData] = useState([]);
    const [choicesData, setChoicesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Charger les données du scénario, des étapes et des choix
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            try {
                // Récupérer l'utilisateur connecté
                const currentUser = await getCurrentUser();
                setUser(currentUser);

                // Réinitialiser l'état
                setCurrentStep(0);
                setUserChoices([]);
                setBudget(1000);
                setFinancialHealth(100);
                setXpEarned(0);
                setScenarioCompleted(false);

                // Charger les données en parallèle
                const [scenario, steps] = await Promise.all([
                    getScenario(scenarioId),
                    getSteps(scenarioId)
                ]);

                setScenarioData(scenario);
                setStepsData(steps);

                // Charger les choix pour chaque étape
                const choicesPromises = steps.map(step => 
                    getChoices(step.id)
                );
                const allChoices = await Promise.all(choicesPromises);
                
                // Créer un objet avec les choix par étape
                const choicesByStep = {};
                steps.forEach((step, index) => {
                    choicesByStep[step.id] = allChoices[index];
                });
                setChoicesData(choicesByStep);

            } catch (error) {
                console.error("Error loading scenario data:", error);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [scenarioId, navigate]);

    const handleChoiceSelection = async (choice) => {
    const newBudget = budget + choice.financial_impact;
    setBudget(newBudget);

    if (choice.consequence.includes("santé financière")) {
        setFinancialHealth(prev => Math.max(0, prev - 20));
    }

    const newXp = xpEarned + choice.xp_reward;
    setXpEarned(newXp);

    const newUserChoices = [...userChoices, {
        step_id: stepsData[currentStep].id,
        choice_id: choice.id,
        xp_earned: choice.xp_reward
    }];
    setUserChoices(newUserChoices);

    if (currentStep < stepsData.length - 1) {
        setCurrentStep(currentStep + 1);
    } else {
        setScenarioCompleted(true);
        await completeScenario(newXp);
    }
};

const completeScenario = async (totalXp) => {
    try {
        await updateUserProgress({
            userId: user.id,
            scenarioId: parseInt(scenarioId),
            completed: true,
            xp_earned: totalXp,
            current_step: stepsData.length,
            finished_at: new Date()
        });

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
        console.error("Error completing scenario:", error);
    }
};

    const goToNextScenario = () => {
        const nextScenarioId = parseInt(scenarioId) + 1;
        navigate(`/scenario/${nextScenarioId}`);
    };

    if (loading || !scenarioData || !stepsData.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
                <Nav />
                <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
                    <div className="animate-pulse text-gray-500">Chargement du scénario...</div>
                </div>
            </div>
        );
    }

    const currentStepData = stepsData[currentStep];
    const currentChoices = choicesData[currentStepData.id] || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <Nav />
            {showConfetti && <Confetti />}

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* En-tête avec progression */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">{scenarioData.title}</h1>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Budget: <span className="font-bold">{budget}€</span></p>
                        <p className="text-sm text-gray-600">Santé financière:
                            <span className={`font-bold ${financialHealth > 70 ? 'text-green-600' : financialHealth > 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                {financialHealth}/100
                            </span>
                        </p>
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="mb-8">
                    <ProgressBar
                        value={scenarioCompleted ? 100 : (currentStep / stepsData.length) * 100}
                        colorFrom="from-blue-400"
                        colorTo="to-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {scenarioCompleted ? "Terminé" : `Étape ${currentStep + 1} sur ${stepsData.length}`}
                    </p>
                </div>

                {!scenarioCompleted ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                    >
                        {currentStep === 0 && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h2 className="text-lg font-bold mb-2">🧩 Introduction</h2>
                                <p className="text-gray-700">
                                    {scenarioData.description}
                                </p>
                            </div>
                        )}

                        <div className="mb-6">
                            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <span>🧭 Étape {currentStep + 1}</span>
                                {currentStep === stepsData.length - 1 && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Dernière étape!</span>
                                )}
                            </h2>
                            <p className="text-gray-700 mb-4 text-lg">"{currentStepData.question}"</p>

                            <div className="space-y-3 max-w-md mx-auto">
                                {currentChoices.map((choice) => (
                                    <motion.button
                                        key={choice.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleChoiceSelection(choice)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${choice.financial_impact < 0 ? 'border-red-200 hover:bg-red-50' : 'border-green-200 hover:bg-green-50'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">{choice.label}</span>
                                            {choice.xp_reward > 15 && (
                                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                                    +{choice.xp_reward} XP
                                                </span>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                            <p>💡 <strong>Conseil :</strong> Pense à long terme. Les petites économies aujourd'hui peuvent faire une grande différence demain.</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-green-600 flex items-center justify-center gap-2">
                            <span>🏁 Félicitations !</span>
                        </h2>
                        <p className="text-lg mb-6">Tu as terminé le scénario "{scenarioData.title}"</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">Budget final</p>
                                <p className="text-2xl font-bold">{budget}€</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-600">Santé financière</p>
                                <p className={`text-2xl font-bold ${financialHealth > 70 ? 'text-green-600' : financialHealth > 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {financialHealth}/100
                                </p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg">
                                <p className="text-sm text-gray-600">XP gagnés</p>
                                <p className="text-2xl font-bold text-amber-600">+{xpEarned} XP</p>
                            </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-6 text-left">
                            <h3 className="font-bold mb-2 text-purple-700">🧠 Ce que tu as appris :</h3>
                            <p className="text-gray-700">
                                {userChoices.some(c => c.financial_impact < -30) ? (
                                    "Le crédit peut sembler pratique mais impacte ta santé financière à long terme."
                                ) : (
                                    "Tu as fait des choix raisonnables et évité les pièges du crédit inutile. Bien joué !"
                                )}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Retour à l'accueil
                            </button>
                            <button
                                onClick={goToNextScenario}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                                Scénario suivant →
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}