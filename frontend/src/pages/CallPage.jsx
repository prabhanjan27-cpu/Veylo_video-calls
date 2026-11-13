import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser.js"
import { useQuery } from "@tanstack/react-query"
import { getStreamToken } from "../lib/api.js"
import toast from "react-hot-toast"
import PageLoader from "../components/PageLoader.jsx"

import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    StreamTheme,
    CallingState,
    useCallStateHooks,
}from "@stream-io/video-react-sdk"

import "@stream-io/video-react-sdk/dist/css/styles.css"


const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY

const CallContent=()=>{
    const {useCallCallingState}=useCallStateHooks()
    const callingState=useCallCallingState()
    const navigate=useNavigate()

    useEffect(() => {
      if (callingState === CallingState.LEFT) {
        navigate("/", { replace: true })
      }
    }, [callingState, navigate])

    return(
     <StreamTheme>
      <SpeakerLayout/>
      <CallControls/>
      </StreamTheme>
    )
  }

const CallPage = () => {
  const {id:callId}=useParams()
  const {authUser,isLoading}=useAuthUser()

  const [client,setClient]=useState(null)
  const [call,setCall]=useState(null)
  const [isConnecting,setIsConnecting]=useState(true)

  const {data:tokenData}=useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser,
  })

  useEffect(()=>{
    const initCall=async()=>{
      if(!tokenData?.token ||!authUser ||!callId)return
      try {
        console.log("Initalizing Stream Video client...")
        const user={
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic
        }
        const videoClient=new StreamVideoClient({
          apiKey:STREAM_API_KEY,
          user:user,
          token:tokenData.token,
        })

        const callInstance=videoClient.call("default",callId)

        await callInstance.join({create:true})

        console.log("Joined call successfully")
        setClient(videoClient)
        setCall(callInstance)

      } catch (error) {
        console.error("Error joining call:",error)
        toast.error("Could not join the call, please try again.")
      }finally{
        setIsConnecting(false)
      }

    }
    initCall()
  },[tokenData,authUser,callId])

  if(isLoading || isConnecting)return <PageLoader/>
  return (
    <div className="call-page flex flex-col items-center justify-center">
      <div className="realitive">
      {client && call ?(
        <StreamVideo client={client}>
          <StreamCall call={call}>

          <CallContent/>

          </StreamCall>
          </StreamVideo>
      ):(
        <div className="flex items-center justify-center h-full">
        <p>Could not initialize call. Please refresh or try again later.</p>
        </div>
      )}
      </div>
      
    </div>
  )
}

export default CallPage
