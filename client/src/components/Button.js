import React from 'react';
import './Button.css';

export default function Button({ onClick, value, size }) {

  const styles ={
    fontSize: `${9*size}px`,
    padding: `${4*size}px ${8*size}px`,
    borderRadius: `${2*size}px`,
    boxShadow: `${1*size}px ${1*size}px ${1*size}px`
  }

  return (
    <button 
        className='button'
        style={styles}
        onClick={onClick}>
        {value}
    </button>
  )
}
