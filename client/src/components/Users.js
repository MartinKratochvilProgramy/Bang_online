import React from 'react'

export default function Users({ users }) {
  return (
    <div>
        <button type="">Disconnect</button>
        {users.map(user => {
            return (
                <div key={user}>
                    {user}
                </div>
            )
        })}
    </div>
  )
}
