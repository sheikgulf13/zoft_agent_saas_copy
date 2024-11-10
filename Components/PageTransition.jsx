import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, x: 10 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

const PageTransition = ({ children }) => (
  <motion.div
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={variants}
    transition={{ duration: 0.5 }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

export default PageTransition;
