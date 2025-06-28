import React from "react";
import { motion } from "framer-motion";
import { Nav } from "@/features/homepage/components/Nav"
import { UserAvatar } from "@/components/UserAvatar"


export function EcoPlayDashboard({ user }) {
    // Données des scénarios basées sur votre schéma DB
    const scenarios = [
        { id: 1, title: "Budget étudiant", difficulty: "easy", completed: true, xp: 20 },
        { id: 2, title: "Premier loyer", difficulty: "medium", completed: true, xp: 30 },
        { id: 3, title: "Crédit smartphone", difficulty: "hard", completed: false },
        { id: 4, title: "Courses mensuelles", difficulty: "easy", completed: false },
        { id: 5, title: "Abonnements", difficulty: "medium", completed: false },
        { id: 6, title: "Épargne", difficulty: "hard", completed: false },
        { id: 7, title: "Assurance auto", difficulty: "medium", completed: false },
    ];

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

    const isScenarioUnlocked = (index) => {
        if (index === 0) return true; // Premier scénario toujours débloqué
        return scenarios[index - 1].completed; // Débloqué si le précédent est terminé
    };

    const getConnectionLineColor = (index) => {
        if (index === 0) return "#10b981"; // Première ligne toujours verte
        return scenarios[index - 1].completed ? "#10b981" : "#d1d5db"; // Verte si précédent terminé, grise sinon
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
            <Nav />

            <div className="container mx-auto px-4 py-8 flex">
                {/* Colonne gauche - Profil et stats */}
                <div className="w-1/4 pr-6 sticky top-20 self-start">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                        <UserAvatar user={user} size="lg" />

                        <div className="mt-6 space-y-4">
                            <div>
                                <h3 className="text-lg font-bold">{user.username}</h3>
                                <p className="text-gray-600">Niveau {user.level}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Progression</span>
                                    <span className="text-emerald-600">{user.total_xp} XP</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(user.total_xp % 1000) / 10}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-amber-500">
                                <span className="text-xl">🔥</span>
                                <span className="font-bold">{user.streak} jours</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonne centrale - Scénarios connectés par une ligne */}
                <div className="w-2/4 px-6">
                    <h2 className="text-2xl font-bold mb-8 mt-20 text-gray-800">Tes scénarios</h2>

                    <div className="relative">
                        <div className="space-y-16">
                            {scenarios.map((scenario, index) => {
                                const isUnlocked = isScenarioUnlocked(index);

                                return (
                                    <div key={scenario.id} className="relative">
                                        {/* Ligne de connexion vers le scénario suivant */}
                                        {index < scenarios.length - 1 && (
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
                                            className={`relative flex ${index % 2 === 0 ? "justify-start ml-20" : "justify-end mr-20"} z-10`}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                {/* Cercle principal du scénario */}
                                                <div className={getDifficultyStyles(scenario, isUnlocked)}>
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
                                                    {!scenario.completed && isUnlocked && index > 0 && scenarios[index - 1].completed && (
                                                        <motion.div
                                                            className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                                                            initial={{ scale: 0, rotate: -45 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ delay: index * 0.1 + 0.8, type: "spring" }}
                                                        >
                                                            NOUVEAU!
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Titre et infos */}
                                                <div className="text-center">
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

                {/* Colonne droite - Classement */}
                <div className="w-1/4 pl-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-20">
                        <h2 className="text-xl font-bold mb-4">🏆 Classement</h2>

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
    );
}