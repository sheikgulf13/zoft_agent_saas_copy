import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const RangeSlider = ({ initialValue, display, disabled}) => {
  const [value, setValue] = useState(initialValue);
  const dispatch = useDispatch()
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="h-[4vh] flex items-center justify-between">
      <p className={`range-value Hmd absolute left-[47vw] ${display ? 'inline-block': 'hidden'}`}>{value}</p>
      <input
      disabled={disabled}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        style={{background: `linear-gradient(to right, #ED39C0 ,#F49D74 ${value}%, #D9D9D9 ${value}%)`}}
        className="slider"
        id='myRange'
      />
      
    </div>
  );
};

export default RangeSlider;
