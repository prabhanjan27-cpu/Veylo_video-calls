import { Navigate, Route, Routes } from 'react-router'
import  { Toaster } from 'react-hot-toast'

import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationPage from "./pages/NotificationPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import FriendsPage from "./pages/FriendsPage.jsx"
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import  Layout  from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.jsx'




const App = () => {
const {isLoading,authUser}=useAuthUser()
const{theme}=useThemeStore()

const isAunthenticated=Boolean(authUser)
const isOnboarded=authUser?.isOnboarded

if (isLoading) return <PageLoader/>
  return (
   <div className='min-h-screen bg-base-100 text-base-content' data-theme={theme}>
 <Routes>
    <Route path='/' element={isAunthenticated &&isOnboarded ?(<Layout showSidebar={true}><HomePage/></Layout>):(<Navigate to={!isAunthenticated ?"/login" :"/onboarding"}/>)}/>
    <Route path='/signup' element={!isAunthenticated?<SignUpPage/>:<Navigate to={isOnboarded?"/":"/onboarding"}/>}/>
    <Route path='/login' element={!isAunthenticated?<LoginPage/>:<Navigate to={isOnboarded?"/":"/onboarding"}/>}/>
    <Route path='/notification' element={isAunthenticated && isOnboarded ?(
      <Layout showSidebar={true}>
        <NotificationPage/>
      </Layout>
    ):(
    <Navigate to={!isAunthenticated ? "/login": "/onboarding"}/>
    )}/>
    <Route path='/friends' element={isAunthenticated && isOnboarded ?(
      <Layout showSidebar={true}><FriendsPage/></Layout>
    ):(<Navigate to={!isAunthenticated ? "/login" : "/onboarding"}/>)}/>
    <Route path='/call/:id' element={isAunthenticated&& isOnboarded ?(
      <CallPage/>
    ):(<Navigate to={!isAunthenticated? "/login":"/onboarding"}/>)}/>
    <Route path='/chat/:id' element={isAunthenticated && isOnboarded ?(
      <Layout showSidebar={false}>
        <ChatPage/>
      </Layout>
    ):(<Navigate to={!isAunthenticated ?"/login":"/onboarding"}/>)}/>
    <Route path='/onboarding' element={isAunthenticated ?(!isOnboarded?(<OnboardingPage/>):<Navigate to={"/"}/>):(<Navigate to={"/login"}/>)}/>
    <Route path='/profile' element={isAunthenticated && isOnboarded ?(
      <Layout showSidebar={true}><OnboardingPage isEditing={true}/></Layout>
    ):(<Navigate to={!isAunthenticated ? "/login" : "/onboarding"}/>)}/>
    

 </Routes>  
   <Toaster/>
    </div>
  )
}

export default App
