import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import type { ProfileDataInterface } from "../Types/DataTypes";

interface AuthContextValue {
    user: ProfileDataInterface | null;
    login: (email: string, password: string) => Promise<void>;
    loading: boolean;
    token: string | null;
    logout: () => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}:{children : React.ReactNode}){

    const [user, setUser] = useState<ProfileDataInterface | null>(null); 
    const [loading, setLoading] = useState<boolean>(false);
    const [token, settoken] = useState<string | null>("");

    async function login(email:string, password:string){
        const {data} = await api.post("/auth/login",{
          email,
          password
        });
        settoken(data.token)
        setUser(data.user)
        localStorage.setItem("token", data.token);
    };

    function logout(){
        settoken(null)
        setUser(null)
        localStorage.removeItem("token");
    }

    async function refresh(){
       setLoading(true)
       try{
            const localToken = localStorage.getItem("token");

            if(!localToken){
                    settoken(null)
                    setUser(null)
                    return;
            }

            const {data} = await api.get("auth/session");
            setUser(data.user)
            settoken(token);
       }catch(err){
            settoken(null)
            setUser(null)
            console.error(err)
        }
        finally{
            setLoading(false);
        }

    }

    useEffect(()=>{
        refresh()
    },[])

    const value = {user, login, loading, token, logout, setLoading}

    return<>
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    </>
}


export function useAuth(){
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("Element must be within AuthContextProvider");
    return ctx;
}
