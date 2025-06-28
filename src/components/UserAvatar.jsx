import React from "react";
import { motion } from "framer-motion";

export const UserAvatar = ({ user, size = "md" }) => {
    // Détermine la taille en fonction de la prop
    const sizeClasses = {
        sm: "w-12 h-12 text-xl",
        md: "w-16 h-16 text-2xl",
        lg: "w-24 h-24 text-3xl",
    };

    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id || user.email}&radius=50&backgroundColor=ecfccb,a7f3d0,d1fae5`;

    return (
        <motion.div
            className={`relative rounded-full ${sizeClasses[size]} shadow-md border-2 border-white overflow-hidden`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            whileHover={{ y: -5 }}
        >
            {user.photoURL ? (
                <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                />
            )}

            {/* Badge de niveau */}
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white">
                {user.level}
            </div>
        </motion.div>
    );
};