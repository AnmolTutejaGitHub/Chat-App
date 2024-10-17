// import { createContext, useState, useEffect } from "react";

// const UserContext = createContext();
// function Provider({ children }) {
//     const [user, setUser] = useState(null);

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// }

// export { Provider };
// export default UserContext;



// will implement cokkie later i dont need user to reset on refresh
import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(() => {
        return sessionStorage.getItem('user') || null;
    });

    useEffect(() => {
        if (user) {
            sessionStorage.setItem('user', user);
        } else {
            sessionStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { Provider };
export default UserContext;
