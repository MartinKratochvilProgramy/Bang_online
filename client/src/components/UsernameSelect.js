import React, { useState } from 'react';
import Button from './Button';

export default function UsernameSelect({ setUsername }) {
    
    const [usernameInput, setUsernameInput] = useState("");

    function handleClick() {
        sessionStorage.setItem('username', JSON.stringify(usernameInput));
        setUsername(usernameInput);
        setUsernameInput("");
    }

  return (
    <div className='mt-4 xs:mt-24'>
        <label className="text-outline font-rye text-6xl text-white mb-6">
            Select username 
        </label>
        <br />
        <div className='mt-4'>
            <input
                className='shadow appearance-none font-rye text-xl rounded bg-beige m-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                placeholder="Username..."
                maxLength={21}
                onChange={(e) => {
                    setUsernameInput(e.target.value)
                }}
                value={usernameInput}
            />
            <Button 
                onClick={handleClick}
                value={"Set Username"} 
                size={2}
            />
        </div>
    </div>
  )
}
