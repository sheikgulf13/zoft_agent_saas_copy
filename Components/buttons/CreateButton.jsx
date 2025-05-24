import { motion } from 'framer-motion';
import useTheme from 'next-theme';
import Link from 'next/link';

const CreateButton = ({ Icon, text, isactive, onClick, isWorkSpace }) => {
    const { theme } = useTheme();

    return (
        <motion.button
            type='button'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
                ${isWorkSpace ? "w-[180px] h-[180px]" : "w-[300px] h-[140px]"} 
                text-base capitalize flex flex-col items-center justify-center 
                border-2 rounded-2xl text-center cursor-pointer font-bold 
                transition-all duration-200 ease-in-out
                ${theme === "dark" 
                    ? 'border-[#4D55CC]  hover:bg-[#4D55CC]/20 text-gray-200' 
                    : 'border-[#211C84]  hover:bg-[#211C84]/10 text-[#211C84]'
                }
                shadow-md hover:shadow-lg
            `}
            onClick={onClick}
        >
            {Icon && typeof Icon === 'string' ? (
                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="mb-2"
                >
                    <img 
                        src={Icon} 
                        alt={text} 
                        className='w-[4vw] h-[4vw] rounded-full font-bold object-cover' 
                    />
                </motion.div>
            ) : (
                Icon && (
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`
                            mb-2
                            ${theme === "dark" ? 'text-[#7A73D1]' : 'text-[#4D55CC]'}
                        `}
                    >
                        <Icon 
                            className='cursor-pointer transition-transform duration-300' 
                            isActive={isactive} 
                            style={{width: '40px', height: '40px'}}
                        />
                    </motion.div>
                ) 
            )}
            {text && (
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm mt-2"
                >
                    {text}
                </motion.span>
            )}
        </motion.button>
    );
};

export default CreateButton;