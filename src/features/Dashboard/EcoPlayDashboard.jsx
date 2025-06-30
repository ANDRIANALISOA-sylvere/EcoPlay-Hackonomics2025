import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Nav } from "@/features/homepage/components/Nav";
import { UserAvatar } from "@/components/UserAvatar";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/Badge";
import { Tooltip } from "@/components/Tooltip";
import { Confetti } from "@/components/Confetti";
import { useNavigate } from "react-router-dom";
import { getScenario, getUserProgress } from "@/lib/api/scenario";

export function EcoPlayDashboard({ user }) {
    const navigate = useNavigate();
    const [scenarios, setScenarios] = useState([]);
    const [userProgress, setUserProgress] = useState([]);
    const [mergedScenarios, setMergedScenarios] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeScenario, setActiveScenario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fusionner les scénarios avec la progression de l'utilisateur
    const mergeScenariosWithProgress = (scenarios, progress) => {
        return scenarios.map(scenario => {
            const userScenario = progress.find(p => p.scenarioId === scenario.id);
            return {
                ...scenario,
                completed: userScenario?.completed || false,
                xp: userScenario?.xp_earned || scenario.xp,
                currentStep: userScenario?.current_step || 0,
                finished_at: userScenario?.finished_at || null
            };
        });
    };

    const isScenarioUnlocked = (index) => {
        if (index === 0) return true;
        return mergedScenarios[index - 1]?.completed || false;
    };

    const getDifficultyStyles = (scenario, isUnlocked) => {
        const baseStyles = "w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer relative";

        if (scenario.completed) {
            return {
                easy: `${baseStyles} bg-gradient-to-br from-emerald-400 to-emerald-600`,
                medium: `${baseStyles} bg-gradient-to-br from-amber-400 to-amber-600`,
                hard: `${baseStyles} bg-gradient-to-br from-rose-400 to-rose-600`
            }[scenario.difficulty];
        } else if (isUnlocked) {
            return {
                easy: `${baseStyles} bg-gradient-to-br from-emerald-300 to-emerald-500 ring-4 ring-emerald-200 animate-pulse`,
                medium: `${baseStyles} bg-gradient-to-br from-amber-300 to-amber-500 ring-4 ring-amber-200 animate-pulse`,
                hard: `${baseStyles} bg-gradient-to-br from-rose-300 to-rose-500 ring-4 ring-rose-200 animate-pulse`
            }[scenario.difficulty];
        } else {
            return `${baseStyles} bg-gradient-to-br from-gray-300 to-gray-400`;
        }
    };

    const getScenarioIcon = (scenario) => {
        const icons = {
            "Budget étudiant": "🎓",
            "Premier loyer": "🏠",
            "Crédit smartphone": "📱",
            "Courses mensuelles": "🛒",
            "Abonnements": "📺",
            "Épargne": "💰",
            "Assurance auto": "🚗"
        };
        return icons[scenario.title] || "💡";
    };

    const getConnectionLineColor = (index) => {
        if (index === 0) return "#10b981";
        return mergedScenarios[index - 1]?.completed ? "#10b981" : "#d1d5db";
    };

    // Charger les données depuis l'API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Charger les scénarios et la progression en parallèle
                const [scenariosData, progressData] = await Promise.all([
                    getScenario(),
                    getUserProgress()
                ]);

                setScenarios(scenariosData);
                setUserProgress(progressData);
                
                // Fusionner les données
                const merged = mergeScenariosWithProgress(scenariosData, progressData);
                setMergedScenarios(merged);

                // Vérifier si un nouveau scénario a été complété pour afficher les confettis
                const newlyCompleted = progressData.some(p => p.completed);
                if (newlyCompleted) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 5000);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    // Calculer le nombre de scénarios complétés et l'XP total
    const completedScenarios = mergedScenarios.filter(s => s.completed).length;
    const totalXp = mergedScenarios.reduce((sum, scenario) => sum + (scenario.completed ? scenario.xp : 0), 0);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des scénarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
            <Nav />

            <AnimatePresence>
                {showConfetti && <Confetti />}
            </AnimatePresence>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
                {/* Colonne gauche - Profil et stats */}
                <div className="w-full lg:w-1/4 lg:pr-6 mb-8 lg:mb-0 lg:sticky lg:top-20 lg:self-start">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                            <UserAvatar user={user} size="lg" />
                            <div>
                                <h3 className="text-lg font-bold">{user.username}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Niveau {user.level}</span>
                                    <Badge color="emerald">Novice</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">Progression</span>
                                    <span className="text-emerald-600 font-bold">{totalXp} XP</span>
                                </div>
                                <ProgressBar
                                    value={(totalXp % 1000) / 10}
                                    colorFrom="from-emerald-400"
                                    colorTo="to-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1 text-right">
                                    {1000 - (totalXp % 1000)} XP jusqu'au niveau {user.level + 1}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-3 rounded-xl text-center">
                                    <p className="text-sm text-gray-600">Scénarios</p>
                                    <p className="text-xl font-bold text-emerald-600">
                                        {completedScenarios}/{scenarios.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonne centrale - Scénarios */}
                <div className="w-full lg:w-2/4 lg:px-6 mb-8 lg:mb-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Tes scénarios</h2>
                        <div className="flex gap-2">
                            <Tooltip content="Scénarios faciles - Bon pour débuter">
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                    Facile
                                </span>
                            </Tooltip>
                            <Tooltip content="Scénarios moyens - Défi modéré">
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                    Moyen
                                </span>
                            </Tooltip>
                            <Tooltip content="Scénarios difficiles - Pour experts">
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                                    Difficile
                                </span>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="space-y-16">
                            {mergedScenarios.map((scenario, index) => {
                                const isUnlocked = isScenarioUnlocked(index);

                                return (
                                    <div key={scenario.id} className="relative">
                                        {/* Ligne de connexion vers le scénario suivant */}
                                        {index < mergedScenarios.length - 1 && (
                                            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-16 z-0">
                                                <motion.div
                                                    className="w-full h-full rounded-full"
                                                    initial={{ height: 0 }}
                                                    animate={{
                                                        height: scenario.completed ? "100%" : "50%",
                                                        backgroundColor: getConnectionLineColor(index + 1)
                                                    }}
                                                    transition={{ duration: 1, delay: index * 0.2 }}
                                                />

                                                {/* Petits cercles décoratifs sur la ligne */}
                                                {scenario.completed && (
                                                    <motion.div
                                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: index * 0.2 + 0.5 }}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.15 }}
                                            className={`relative flex ${index % 2 === 0 ? "justify-start lg:ml-20" : "justify-end lg:mr-20"} z-10`}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                {/* Cercle principal du scénario */}
                                                <button
                                                    onClick={() => isUnlocked && setActiveScenario(scenario)}
                                                    className={getDifficultyStyles(scenario, isUnlocked)}
                                                    disabled={!isUnlocked}
                                                >
                                                    {scenario.completed ? (
                                                        <motion.span
                                                            className="text-2xl"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                                                        >
                                                            ✓
                                                        </motion.span>
                                                    ) : isUnlocked ? (
                                                        <span className="text-2xl">{getScenarioIcon(scenario)}</span>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-lg">🔒</span>
                                                        </div>
                                                    )}

                                                    {/* Badge "NOUVEAU" pour scénario débloqué */}
                                                    {!scenario.completed && isUnlocked && index > 0 && mergedScenarios[index - 1].completed && (
                                                        <motion.div
                                                            className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                                                            initial={{ scale: 0, rotate: -45 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ delay: index * 0.1 + 0.8, type: "spring" }}
                                                        >
                                                            NOUVEAU!
                                                        </motion.div>
                                                    )}
                                                </button>

                                                {/* Titre et infos */}
                                                <div className="text-center max-w-[160px]">
                                                    <h3 className={`font-bold text-sm ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                                                        {scenario.title}
                                                    </h3>

                                                    {scenario.completed && (
                                                        <motion.p
                                                            className="text-xs text-emerald-600 font-medium mt-1"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.6 }}
                                                        >
                                                            +{scenario.xp} XP ✨
                                                        </motion.p>
                                                    )}

                                                    {!scenario.completed && isUnlocked && (
                                                        <motion.div
                                                            className="mt-2"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.7 }}
                                                        >
                                                            <p className="text-xs text-emerald-600 font-medium">
                                                                Disponible ! 🎮
                                                            </p>
                                                        </motion.div>
                                                    )}

                                                    {!isUnlocked && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Verrouillé 🔐
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Badge de difficulté */}
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${!isUnlocked ? 'bg-gray-100 text-gray-400' :
                                                    scenario.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                                                        scenario.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-rose-100 text-rose-700'
                                                    }`}>
                                                    {scenario.difficulty === 'easy' ? 'Facile' :
                                                        scenario.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Colonne droite - Classement et détails */}
                <div className="w-full lg:w-1/4 lg:pl-6">
                    <div className="space-y-6 sticky top-20">
                        {/* Détails du scénario actif */}
                        {activeScenario && (
                            <motion.div
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold">{activeScenario.title}</h3>
                                    <button
                                        onClick={() => setActiveScenario(null)}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <p className="text-gray-600 mb-4">{activeScenario.description}</p>

                                <div className="flex justify-between items-center mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeScenario.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                                        activeScenario.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                                            'bg-rose-100 text-rose-700'
                                        }`}>
                                        {activeScenario.difficulty === 'easy' ? 'Facile' :
                                            activeScenario.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                                    </span>

                                    <span className="text-emerald-600 font-bold">+{activeScenario.xp} XP</span>
                                </div>

                                <button
                                    onClick={() => navigate(`/scenario/${activeScenario.id}`)}
                                    className="w-full bg-gradient-to-r cursor-pointer from-emerald-500 to-blue-500 text-white py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    {activeScenario.completed ? "Rejouer" : "Commencer"} le scénario
                                </button>

                                {activeScenario.completed && activeScenario.finished_at && (
                                    <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                                        <p className="text-sm text-emerald-700 font-medium">
                                            ✓ Complété le {new Date(activeScenario.finished_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Classement */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span>🏆 Classement</span>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                    Hebdomadaire
                                </span>
                            </h2>

                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((rank) => (
                                    <motion.div
                                        key={rank}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: rank * 0.1 }}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${rank <= 3 ? "bg-gradient-to-r from-amber-50 to-white shadow-sm" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${rank === 1 ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white" :
                                            rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white" :
                                                rank === 3 ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white" :
                                                    "bg-gray-200 text-gray-600"
                                            }`}>
                                            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                                        </span>
                                        <span className="flex-1 text-sm font-medium truncate">
                                            {rank === 1 ? user.username : `Joueur ${rank}`}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-600">
                                            {1000 - (rank * 150)} XP
                                        </span>
                                    </motion.div>
                                ))}

                                <div className="pt-3 mt-4 border-t border-gray-200">
                                    <motion.div
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold text-sm">
                                            {user.leaderboard_position || 12}
                                        </span>
                                        <span className="flex-1 text-sm font-medium">Ta position</span>
                                        <span className="text-xs font-bold text-emerald-600">
                                            {user.weekly_xp || 320} XP
                                        </span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}