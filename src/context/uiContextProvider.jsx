import uiContext from "./uiContext";
import { useState,children ,useMemo } from "react";
const UiContextProvider=({children})=>{
 const [isOpen, setIsOpen] = useState(true);
    

return(
 <uiContext.Provider value={{isOpen,setIsOpen}}>
    {children}
 </uiContext.Provider>
)
}
export default UiContextProvider;