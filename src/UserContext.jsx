import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        })
        .then(response => response.json())
        .then(userInfo => {
            setUserInfo(userInfo);
        })
        .catch(err => console.log("Profile fetch failed:", err));
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}
