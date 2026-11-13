import FriendRequest from "../models/FriendRequest.js"
import User from "../models/User.js"

export async function getRecomendedUsers(req,res) {
    try {
        const currentUserId=req.user.id
        const currentUser=req.user

        const recomendedUsers=await User.find({
            $and:[
                {_id:{$ne:currentUserId}},
                {_id:{$nin:currentUser.friends}},
                {isOnboarded:true},
            ]
        })
        res.status(200).json(recomendedUsers)
    } catch (error) {
        console.error("Error is getRecomendedUsers controller",error.message)
        res.status(500).json({message: "Interanl Server Error"})

    }
}

export async function getMyFriends(req,res) {
    try {
        const user=await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage")
        const friendIds=user.friends.map((friend)=>friend._id)
        const acceptedRequests=await FriendRequest.find({
            status:"accepted",
            $or:[
                {sender:req.user.id,recipient:{$in:friendIds}},
                {recipient:req.user.id,sender:{$in:friendIds}},
            ],
        }).select("sender recipient updatedAt")
        const friendsSinceById=new Map()
        acceptedRequests.forEach((request)=>{
            const friendId=request.sender.toString()===req.user.id
                ? request.recipient.toString()
                : request.sender.toString()
            friendsSinceById.set(friendId,request.updatedAt)
        })
        res.status(200).json(user.friends.map((friend)=>({
            ...friend.toObject(),
            friendsSince:friendsSinceById.get(friend._id.toString()) || null,
        })))

    } catch (error) {
        console.error("Error is getFriends controller",error.message)
        res.status(500).json({message: "Interanl Server Error"})
    }
}

export async function sendFriendRequest(req,res) {
    try {
        const myId=req.user.id
        const {id:recipientId}=req.params

        if(myId===recipientId){
            return res.status(400).json({message:"you cant send friend request to yourself"})
        }

        const recipient=await User.findById(recipientId)

        if(!recipient){
           return res.status(404).json({message:"recipient not found"}) 
        }
        // check if user is already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"you are already friends with user"})
        }
        // check if a req already exists
        const existingRequest=await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId},
            ]
        })
        if(existingRequest){
           return res.status(404).json({message:"A friend request already exists between you and this user"}) 
        }

        const friendRequest=await FriendRequest.create({
            sender:myId,
            recipient:recipientId,
        })
        res.status(201).json(friendRequest)

    } catch (error) {
        console.error("Error in sendFriendRequest  controller",error.message)
        res.status(500).json({message: "Interanl Server Error"})
    }
}

export  async function acceptFriendRequest(req,res) {
    try {
        const {id:requestId}=req.params
        const friendRequest=await FriendRequest.findById(requestId)

        if(!friendRequest){
            return res.status(404).json({message:"Friend request not Found"})
        }
        if(friendRequest.recipient.toString()!==req.user.id){
            return res.status(403).json({message:"you are not authorized to accept this request"})
        }
        friendRequest.status="accepted"
        await friendRequest.save()

        // add each user to others' friends array
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })
        res.status(200).json({message:"Friend request accepted"})

    } catch (error) {
        console.error("Error in acceptFriendRequest  controller",error.message)
        res.status(500).json({message: "Interanl Server Error"})
    }
}

export async function getFriendRequests(req,res) {
    try {
        const incommingRequest=await FriendRequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage")

        const acceptedRequest=await FriendRequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient","fullName profilePic")

        res.status(200).json({incommingRequest,acceptedRequest})

    } catch (error) {
        console.error("Error in getFriendRequests  controller",error.message)
        res.status(500).json({message: "Interanl Server Error"})
    }
}
export async function getOutgoingFriendRequest(req,res) {
       try {
        const outgoingRequest=await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage")

        res.status(200).json(outgoingRequest)
       } catch (error) {
        console.error("Error in getOutgoingFriendRequest controller",error.message)
        res.status(500).json({message: "Interanl Server Error"})
       }                 
}
