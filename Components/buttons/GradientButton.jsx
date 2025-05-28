import { motion } from 'framer-motion';
import Link from 'next/link';

const GradientButton = ({ Icon, text, isActive, onClick, className }) => {
  return (
    <button
      type='button'
      className={`py-[.6vw] text-lg capitalize flex items-center gap-[1vw] px-[1vw] text-center cursor-pointer font-medium rounded-lg ${className} ${
        isActive
          ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm text-white'
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