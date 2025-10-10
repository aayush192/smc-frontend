import React, { useState } from "react";
import { useEffect } from "react";
import Context from "./context";

const ContextProvider=({children})=>{
    const [course,setCourse]=useState([]);
    const [department,setDepartment]=useState([]);
    const [userData,setUserData]=useState({});

    useEffect(() => {
        try{
        const user = localStorage.getItem('user');
        console.log(JSON.parse(localStorage.getItem('user')));
        if (user) setUserData(JSON.parse(user));
    }catch(err){
        console.log(err);
    }
      }, []);
    return(
        <Context.Provider value={{department,setDepartment,course,setCourse,userData,setUserData}}>
            {children}
        </Context.Provider>
    )
}
export default ContextProvider;