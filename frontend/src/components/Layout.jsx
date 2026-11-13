import Sidebar from "./Sidebar.jsx"
import Navbar from "./Navbar.jsx"
import MobileNav from "./MobileNav.jsx"


const Layout = ({children,showSidebar=false}) => {
  return (
    <div className="min-h-screen min-h-dvh bg-base-100 text-base-content">
        <div className="flex min-h-screen min-h-dvh">
        {showSidebar&&<Sidebar/>}
        <div className="flex-1">
            <Navbar/>
            <main className={`min-w-0 flex-1 bg-base-100 ${showSidebar ? "pb-20 lg:pb-0" : ""}`}>
                {children}
            </main>
        </div>  
        </div>
        {showSidebar && <MobileNav/>}
    </div>
  )
}





export default Layout
