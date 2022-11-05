import React, { useState, useEffect } from 'react'
import Button from './Button'

export default function Chat({ sendMessage, messages, width }) {
    
    const [messageInput, setMessageInput] = useState("");
    const [messagesOutput, setMessagesOutput] = useState("");

    useEffect(() => {
        let messagesFormatted = "";
        for (let i = 0; i < messages.length; i++) {
            messagesFormatted += messages[i].username + ": " + messages[i].message + "\n";
        }
        setMessagesOutput(messagesFormatted);
        const textArea = document.getElementById("text"); 
        textArea.scrollTop = textArea.scrollHeight;
    }, [messages])

  return (
    <div className='mt-8 w-[280px] xs:w-[340px]'>

        <div 
            id="text" 
            className={`bg-beige ml-0 rounded p-2 overflow-auto w-full h-[120px] xs:h-[200px] font-rye`}
            cols="37" 
            rows="10" 
            value={messagesOutput}
        >
            {messages.map(message => {
                return(
                    <div className='flex flex-row w-full text-start'>
                        <div className=''>
                            {message.username}:
                        </div>
                        <div className='text-gray-700 ml-2'>
                            {message.message}
                        </div>
                    </div>
                )
            })}
        </div>

        <form 
            className={`flex justify-between w-full`}
            onSubmit={(e) =>{
                e.preventDefault();
                setMessageInput("");
                sendMessage(messageInput);
                }}
        >
        <div className="flex mt-2 w-full">
            <input
                className='shadow appearance-none h-[32px] w-full font-rye text-xl rounded bg-beige mr-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                placeholder="Message..."
                onChange={(e) => setMessageInput(e.target.value)}
                value={messageInput}
            />
            <div className="flex justify-end">
                <Button 
                    onClick={null}
                    value={"Send"} 
                    size={1.5}
                />
            </div>

        </div>
        </form>
    </div>
  )
}
