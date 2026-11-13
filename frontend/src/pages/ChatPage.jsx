import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser.js"
import { useQuery } from "@tanstack/react-query"
import { getStreamToken } from "../lib/api.js"
import { StreamChat } from "stream-chat"
import toast from "react-hot-toast"
import ChatLoader from "../components/ChatLoader.jsx"
import CallButton from "../components/CallButton.jsx"

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  ThreadHeader,
  WorkspaceNavigationProvider,
  defaultWorkspaceNavigation,
  defaultRenderMessages,
  useChannel,
  useChannelHeaderOnlineStatus,
} from "stream-chat-react"

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY

const ChatHeaderSubtitle = () => {
  const channel = useChannel()
  // Subscribe to the SDK's presence updates so the online count refreshes live.
  useChannelHeaderOnlineStatus()
  const members = Object.values(channel.state.members ?? {})
  const onlineCount = members.filter((member) => member.user?.online).length

  return (
    <div className="str-chat__channel-header__data__subtitle">
      {members.length} {members.length === 1 ? "member" : "members"}, {onlineCount} online
    </div>
  )
}

 const ChatPage = () => {
  const {id:targetUserId}=useParams()

  const [ChatClient ,setChatClient]=useState(null)
  const [channel,setChannel]=useState(null)
  const [activeThread,setActiveThread]=useState(null)
  const [loading,setLoading]=useState(true)

  const {authUser}=useAuthUser()
  const {data:tokenData}=useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser,//this only run if authuser available
  })
  useEffect(()=>{
    const initChat=async()=>{
      if(!tokenData?.token || !authUser)return
      try {
        const client =StreamChat.getInstance(STREAM_API_KEY)
        await client.connectUser({
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic,
        },tokenData.token)

        const channelId=[authUser._id,targetUserId].sort().join("-")  

        const currChannel=client.channel("messaging",channelId,{
          members:[authUser._id,targetUserId],
        })

        await currChannel.watch()

        setChatClient(client)
        setChannel(currChannel)

      } catch (error) {
        console.error("Erro initializing chat:",error)
        toast.error("could not connect to chat. Please try again.")

      }finally{
        setLoading(false)
      }
    }
    initChat()
  },[tokenData?.token,authUser,targetUserId])

  useEffect(() => {
    if (!activeThread) return
    return activeThread.activate()
  }, [activeThread])

  const workspaceNavigation = useMemo(() => ({
    ...defaultWorkspaceNavigation,
    openThread: (target) => {
      const thread = "parentMessage" in target
        ? target
        : ChatClient.threads.ensure({ channel: target.channel, parentMessage: target.message })
      setActiveThread(thread)
    },
  }), [ChatClient])

  const handleVideoCall=async()=>{
    if (!channel) return

    const callUrl=`${window.location.origin}/call/${channel.id}`
    try {
      await channel.sendMessage({
        message: {
          text:`I've started a video call. join me here: ${callUrl}`,
        },
      })
      toast.success("Video call link sent successfully!")
    } catch (error) {
      console.error("Could not send video call link:", error)
      toast.error("Could not send the video call link. Please try again.")
    }
  }

if(loading || !ChatClient || !channel)return <ChatLoader/>

  return (
    <div className="chat-page">
      <div className={`chat-panel${activeThread ? " thread-open" : ""}`}>
      <Chat client={ChatClient}>
        <WorkspaceNavigationProvider value={workspaceNavigation}>
        <Channel channel={channel}>
          <div className="chat-conversation">
            <CallButton handleVideoCall={handleVideoCall}/>
            <ChannelHeader
              StartContent={() => null}
              EndContent={() => null}
              Subtitle={ChatHeaderSubtitle}
            />
            <MessageList
              renderMessages={(options) =>
                defaultRenderMessages({
                  ...options,
                  sharedMessageProps: {
                    ...options.sharedMessageProps,
                    openThread: (message) => {
                      setActiveThread(
                        ChatClient.threads.ensure({ channel, parentMessage: message }),
                      )
                    },
                  },
                })
              }
            />
            <MessageComposer focus />
          </div>
          {activeThread && (
            <Thread thread={activeThread}>
              <ThreadHeader
                StartContent={() => null}
                EndContent={() => (
                  <button
                    type="button"
                    className="thread-close"
                    aria-label="Close thread"
                    onClick={() => setActiveThread(null)}
                  >
                    x
                  </button>
                )}
              />
              <MessageList withDateSeparator={false} />
              <MessageComposer focus />
            </Thread>
          )}
        </Channel>
        </WorkspaceNavigationProvider>
      </Chat>
      </div>
    </div>
  )
}

export default ChatPage
