import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Confetti } from '@/components/Confetti';
import { ProgressBar } from '@/components/ProgressBar';
import { Nav } from "@/features/homepage/components/Nav"

export function ScenarioPage({ user }) {
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
    const [loading, setLoading] = useState(true);

    // Simuler le chargement des données du scénario
    useEffect(() => {
        setLoading(true);
        // Réinitialiser l'état quand le scenarioId change
        setCurrentStep(0);
        setUserChoices([]);
        setBudget(1000);
        setFinancialHealth(100);
        setXpEarned(0);
        setScenarioCompleted(false);

        // Simuler un appel API
        const mockScenarios = {
            1: {
                id: 1,
                title: "Budget étudiant",
                description: "Gère ton budget mensuel en tant qu'étudiant avec des revenus limités",
                difficulty: "easy",
                steps: [
                    {
                        id: 1,
                        step_order: 1,
                        question: "Ton professeur demande un livre obligatoire. Tu fais quoi ?",
                        choices: [
                            { id: 1, label: "Acheter neuf (60€)", xp_reward: 5, financial_impact: -60, consequence: "Dépense importante mais livre en parfait état" },
                            { id: 2, label: "Acheter d'occasion (20€)", xp_reward: 15, financial_impact: -20, consequence: "Économie de 40€ pour le même contenu" },
                            { id: 3, label: "Emprunter à la bibliothèque (0€)", xp_reward: 10, financial_impact: 0, consequence: "Gratuit mais disponibilité limitée" }
                        ]
                    },
                    {
                        id: 2,
                        step_order: 2,
                        question: "Une promo te propose un téléphone à crédit (40€/mois). Tu fais quoi ?",
                        choices: [
                            { id: 4, label: "Acheter à crédit (40€/mois)", xp_reward: 5, financial_impact: -40, consequence: "Engagement long terme, santé financière -20" },
                            { id: 5, label: "Attendre et économiser", xp_reward: 20, financial_impact: 0, consequence: "Meilleure décision à long terme" },
                            { id: 6, label: "Garder ton ancien téléphone", xp_reward: 15, financial_impact: 0, consequence: "Économies immédiates" }
                        ]
                    },
                    {
                        id: 3,
                        step_order: 3,
                        question: "Une promo te propose un téléphone à crédit (40€/mois). Tu fais quoi ?",
                        choices: [
                            { id: 4, label: "Acheter à crédit (40€/mois)", xp_reward: 5, financial_impact: -40, consequence: "Engagement long terme, santé financière -20" },
                            { id: 5, label: "Attendre et économiser", xp_reward: 20, financial_impact: 0, consequence: "Meilleure décision à long terme" },
                            { id: 6, label: "Garder ton ancien téléphone", xp_reward: 15, financial_impact: 0, consequence: "Économies immédiates" }
                        ]
                    }
                ]
            },
            2: {
                id: 2,
                title: "Premier loyer",
                description: "Gère ton premier appartement et tes charges",
                difficulty: "medium",
                steps: [
                    {
                        id: 3,
                        step_order: 1,
                        question: "Tu dois choisir un appartement. Que préfères-tu ?",
                        choices: [
                            { id: 7, label: "Studio en centre-ville (700€)", xp_reward: 5, financial_impact: -700, consequence: "Pratique mais cher" },
                            { id: 8, label: "Colocation (400€)", xp_reward: 15, financial_impact: -400, consequence: "Économies mais moins d'intimité" },
                            { id: 9, label: "Appartement excentré (500€)", xp_reward: 10, financial_impact: -500, consequence: "Bon compromis" }
                        ]
                    }
                ]
            }
        };

        setTimeout(() => {
            setScenarioData(mockScenarios[scenarioId]);
            setLoading(false);
        }, 500);
    }, [scenarioId]);

    const handleChoiceSelection = (choice) => {
        const newBudget = budget + choice.financial_impact;
        setBudget(newBudget);

        if (choice.consequence.includes("santé financière")) {
            setFinancialHealth(prev => Math.max(0, prev - 20));
        }

        setXpEarned(prev => prev + choice.xp_reward);

        setUserChoices([...userChoices, {
            step_id: scenarioData.steps[currentStep].id,
            choice_id: choice.id,
            xp_earned: choice.xp_reward
        }]);

        if (currentStep < scenarioData.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeScenario();
        }
    };

    const completeScenario = () => {
        setScenarioCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    const goToNextScenario = () => {
        const nextScenarioId = parseInt(scenarioId) + 1;
        navigate(`/scenario/${nextScenarioId}`);
    };

    if (loading || !scenarioData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
                <Nav />
                <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
                    <div className="animate-pulse text-gray-500">Chargement du scénario...</div>
                </div>
            </div>
        );
    }

    const currentStepData = scenarioData.steps[currentStep];

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
                        value={scenarioCompleted ? 100 : (currentStep / scenarioData.steps.length) * 100}
                        colorFrom="from-blue-400"
                        colorTo="to-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {scenarioCompleted ? "Terminé" : `Étape ${currentStep + 1} sur ${scenarioData.steps.length}`}
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
                                    "Tu es Sylvère, étudiant en Gestion. Tu reçois une bourse et tu travailles les week-ends.
                                    À toi de gérer ton budget ce mois-ci. Tu commences avec {budget}€."
                                </p>
                            </div>
                        )}

                        <div className="mb-6">
                            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <span>🧭 Étape {currentStep + 1}</span>
                                {currentStepData.step_order === scenarioData.steps.length && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Dernière étape!</span>
                                )}
                            </h2>
                            <p className="text-gray-700 mb-4 text-lg">"{currentStepData.question}"</p>

                            <div className="space-y-3 max-w-md mx-auto">
                                {currentStepData.choices.map((choice) => (
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
                                {userChoices.some(c => c.choice_id === 4) ? (
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