import { LoaderIcon } from "lucide-react"
import { useThemeStore } from "../store/useThemeStore.jsx"

const PageLoader = () => {
  const {theme}=useThemeStore()
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center" data-theme={theme}>
        <LoaderIcon className="animate-spin sixe-10 text-primary"/>
    </div>
  )
}

export default PageLoader
