import {create} from "zustand"

export const useThemeStore =create((set)=>({
    theme:localStorage.getItem("Veylo-theme")||"forest",
    setTheme:(theme)=>{
        localStorage.setItem("Veylo-theme",theme)
        set({theme})},
    
}))
