import { motion } from 'framer-motion';
import Link from 'next/link';

const GradientButton = ({ Icon, text, isActive, onClick, className }) => {
  return (
    <button
      type='button'
      className={`py-[.6vw] text-lg capitalize flex items-center gap-[1vw] px-[1vw] text-center cursor-pointer font-medium rounded-lg ${className} ${
        isActive
          ? 'bg-[#702963] text-white'
          : 'hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {Icon && typeof Icon === 'string' ? (
        <img src={Icon} alt={text} className='w-8 h-8 rounded-full object-cover font-bold' />
      ) : (
        Icon && <Icon className='cursor-pointer w-8 h-8' style={{width: "30px", height: "30px"}}/>
      )}
      {text}
    </button>
  );
};

export default GradientButton;