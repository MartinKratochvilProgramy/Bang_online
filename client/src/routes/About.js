import React from 'react'

export default function About() {
  return (
    <div className='flex items-center justify-center pt-6 px-8'>
        <div className='bg-beige w-[80%] xs:w-[60%] rounded p-4 pt-8 text-center relative'>
            <a 
                className='text-1xl font-rye underline right-0 top-0 text-gray-800 hover:text-black absolute pt-2 pr-3'
                href="/" 
                rel="noreferrer" >
                Go Back
            </a>
            <h1 className='text-5xl font-rye text-center'>About Bang! online</h1>
            <br />
            <h2 className='mt-2 mb-2 text-3xl font-rye'>Rules</h2>
            <div>Rules of Bang! online follow the popular card game Bang! You can read the 
                rules <a 
                    className='font-bold text-gray-800 hover:text-black underline'
                    href="https://www.ultraboardgames.com/bang/game-rules.php" 
                    rel="noreferrer" 
                    target="_blank">
                    here
                </a>.
            </div>
            <h2 className='mt-6 mb-2 text-3xl font-rye'>Quitting!</h2>
            <div><span className='font-bold'>Reloading the page (by pressing F5)</span> will result in you <span className='font-bold'>leaving the game room!</span> You
                will then not be able to reconnect as leaving results in the immediate death of your character. Avoid unnecessarily quitting the game as not to hinder the 
                experience of other players.
            </div>
            <h2 className='mt-6 mb-2 text-3xl font-rye'>Language</h2>
            <div>Please be resepctful to other players. Avoid profanities in chat or picking controversial names.</div>
            <h2 className='mt-6 mb-2 text-3xl font-rye'>Most important</h2>
            <div>Have fun!</div>
            <br />
            <br />
            <br />
            <br />
            <div className='flex justify-center items-center space-x-2'>
                <img 
                    className=''
                    src={require("../img/GitHub-Mark-32px.png")} 
                    alt="GitHub_logo"
                    />
                <a 
                    href="https://github.com/MartinKratochvilProgramy" 
                    className='text-2xl font-rye text-gray-800 hover:text-black underline underline-offset-4'
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                    GitHub
                </a>
            </div>

        </div>
    </div>
  )
}
