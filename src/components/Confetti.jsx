import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const colors = ["#FFC700", "#FF0000", "#2E3191", "#41BBC7", "#FF6B00", "#A1DD70"];

const ConfettiPiece = ({ initialX, initialY, rotation, color, delay }) => {
    return (
        <motion.div
            className="w-2 h-2 absolute rounded-full"
            style={{
                backgroundColor: color,
                x: initialX,
                y: initialY,
                rotate: rotation,
            }}
            initial={{ y: -100, opacity: 1 }}
            animate={{
                y: [initialY - 100, initialY + 500],
                x: [initialX, initialX + (Math.random() - 0.5) * 200],
                opacity: [1, 1, 0],
                rotate: rotation + 360,
            }}
            transition={{
                duration: 3,
                delay,
                ease: "linear",
            }}
        />
    );
};

export function Confetti() {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        const newPieces = [];
        for (let i = 0; i < 100; i++) {
            newPieces.push({
                id: i,
                initialX: Math.random() * window.innerWidth - 100,
                initialY: Math.random() * 100,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
            });
        }
        setPieces(newPieces);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map((piece) => (
                <ConfettiPiece key={piece.id} {...piece} />
            ))}
        </div>
    );
}