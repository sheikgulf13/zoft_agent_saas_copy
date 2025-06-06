import { motion } from 'framer-motion';
import useTheme from 'next-theme';
import Link from 'next/link';

const CreateButton = ({ Icon, text, isactive, onClick, isWorkSpace, width, height, isClickable }) => {
    const { theme } = useTheme();

    return (
        <motion.button
            type='button'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{pointerEvents: isClickable}}
            className={`
                ${isWorkSpace ? "w-[180px] h-[180px] flex-col rounded-2xl" : `w-[${width ? width : '200px'}] h-[${height ? height : '40px'}] rounded-md px-[1vw] py-[1vw] gap-[1vw]`} 
                text-base capitalize flex items-center justify-center 
                border-[1px] text-center cursor-pointer font-bold 
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
                    className={`${isWorkSpace ? 'mb-2' : ''}`}
                >
                    <img 
                        src={Icon} 
                        alt={text} 
                        className={`${isWorkSpace ? 'w-[4vw] h-[4vw] rounded-full' : 'w-[2vw] h-[2vw] rounded-lg'} font-bold object-cover`} 
                    />
                </motion.div>
            ) : (
                Icon && (
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`
                            ${isWorkSpace ? 'mb-2' : ''}
                            ${theme === "dark" ? 'text-[#7A73D1]' : 'text-[#2D3377]/90'}
                        `}
                    >
                        <Icon 
                            className='cursor-pointer transition-transform duration-300' 
                            isActive={isactive} 
                            style={{width: `${isWorkSpace ? '40px' : '25px'}`, height: `${isWorkSpace ? '40px' : '25px'}`}}
                        />
                    </motion.div>
                ) 
            )}
            {text && (
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${isWorkSpace ? 'mt-2' : ''} text-sm [#2D3377]/90`}
                >
                    {text}
                </motion.span>
            )}
        </motion.button>
    );
};

export default CreateButton;