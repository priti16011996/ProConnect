import React, { createContext } from 'react'
export const AuthContextData = createContext();
function AuthContext({ children }) {
    const serverUrl = "http://localhost:3000";
    let data = {
        serverUrl: serverUrl,
    }
    return (
        <div>
            <AuthContextData.Provider value={data}>
                {children}
            </AuthContextData.Provider>
        </div>
    )
}

export default AuthContext
