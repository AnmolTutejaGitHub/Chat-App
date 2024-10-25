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
// Problem : usercontext set to null on refresh if using token it  and storing it in localstorage same prob + 
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(() => {
        return sessionStorage.getItem('user') || null;
    });

    async function decodeToken() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/verifytokenAndGetUsername', {
                token: token
            });
            if (response.status === 200) setUser(response.data.user);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        decodeToken();
    })

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


// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// const UserContext = createContext();

// function Provider({ children }) {
//     const [user, setUser] = useState(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             axios.post('http://localhost:6969/verifytokenAndGetUsername', { token })
//                 .then(({ data }) => {
//                     return data.user;
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching user:", error);
//                     localStorage.removeItem('token');
//                 });
//         }
//         return null;
//     });

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token && !user) {
//             axios.post('http://localhost:6969/verifytokenAndGetUsername', { token })
//                 .then(({ data }) => {
//                     setUser(data.user);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching user:", error);
//                     localStorage.removeItem('token');
//                 });
//         }
//     }, [user]);

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// }

// export { Provider };
// export default UserContext;