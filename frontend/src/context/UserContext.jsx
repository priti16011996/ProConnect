import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContextData } from './AuthContext.jsx';
export let userContextData = createContext();
function UserContext({ children }) {
    let [userData, setUserData] = useState(null);
    let [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    let { serverUrl } = useContext(AuthContextData);
    console.log("serverUrl", serverUrl);
    let getUserData = async () => {
        try {
            let result = await axios.get(`${serverUrl}/v1/api/user/currentUser`, {
                withCredentials: true
            }
            )
            setUserData(result.data);
            console.log(result);
        }
        catch (err) {
            console.log(err + "error in user context");
            setUserData(null);
        }
        finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        getUserData();
    }, []);
    let value = {
        userData,
        setUserData,
        loading,
        edit,
        setEdit
    }
    return (
        <div>
            <userContextData.Provider value={value}>
                {children}
            </userContextData.Provider>
        </div>
    )
}

export default UserContext
