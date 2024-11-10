import useTheme from 'next-theme';
import React from 'react';

const CheckBox = ({ checked, onChange }) => {
  const { theme } = useTheme()
  return (
    <>
        <input
          id="cbx-12"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`${theme === "dark" ? 'custom-checkbox-dark' : 'custom-checkbox-light'} w-[1.2vw] h-[1.2vw] appearance-none relative rounded-md border-[0.104vw] cursor-pointer focus:outline-none`}
        />

        {/*<label
          htmlFor="cbx-12"
          className={`absolute top-0 left-0 w-[1vw] h-[1.92vh] bg-gradient-to-r rounded-lg rounded-[1.3vw pointer-events-none transform transition-all duration-600 ${
            checked ? 'bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white' : ''
          }`}
          style={{ filter: 'url("#goo-12")' }}
        ></label>

        <svg
          width="1vw"
          height="2vh"
          viewBox="0 0 15 14"
          fill="none"
          className="absolute top-[0.181vh left-[0.208vw z-10 pointer-events-none"
        >
          <path
            d="M2 8.36364L6.23077 12L13 2"
            className={`stroke-white stroke-3 stroke-linecap-round stroke-linejoin-round transition-all duration-300 ${
              checked ? 'stroke-dashoffset-0' : 'stroke-dashoffset-19'
            }`}
            style={{
              strokeDasharray: 19,
              strokeDashoffset: checked ? 0 : 19,
              transitionDelay: checked ? '0.2s' : '0s',
            }}
          ></path>
        </svg>
      / Gooey Filter /
      <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-[0vw] h-[0vh]">
        <defs>
          <filter id="goo-12">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
              result="goo-12"
            ></feColorMatrix>
            <feBlend in="SourceGraphic" in2="goo-12"></feBlend>
          </filter>
        </defs>
      </svg>*/}
    </>
  );
};

export default CheckBox;