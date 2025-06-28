import { motion } from "framer-motion";
export const FloatingIcon = ({ icon, delay, position }) => (
    <motion.div
        className={`absolute text-4xl opacity-20 ${position}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
        }}
        transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
    >
        {icon}
    </motion.div>
);