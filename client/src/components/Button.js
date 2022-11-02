import React from 'react';
import './Button.css';

export default function Button({ onClick, value }) {
  return (
    <button 
        className='button'
        onClick={onClick}>
        {value}
    </button>
  )
}
