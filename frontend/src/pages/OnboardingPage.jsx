import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser"
import toast from "react-hot-toast";
import {completeOnboarding} from "../lib/api.js"
import {useState} from "react"
import { useNavigate } from "react-router"
import { CameraIcon,ShuffleIcon,MapPinIcon, ShipWheelIcon, LoaderIcon} from "lucide-react"
import {LANGUAGES} from"../constants/index.js"

const OnboardingPage = ({isEditing = false}) => {
  const {authUser}=useAuthUser()
  const navigate=useNavigate()
  const queryClient=useQueryClient()
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    });

    const {mutate:onboardingMutation,isPending}=useMutation({
      mutationFn:completeOnboarding,
      onSuccess:()=>{
        toast.success(isEditing ? "Profile updated successfully" : "Profile onboarded successfully")
        queryClient.invalidateQueries({queryKey:["authUser"]})
        if (isEditing) navigate("/profile")
      },
      onError:(error)=>{
        toast.error(error.response?.data?.message || "Could not save your profile")
      }
    })

    const handleSubmit=(e)=>{
      e.preventDefault()
      onboardingMutation(formState)
    }

    const handleRandomAvatar=()=>{
      const seed = `${authUser?.email || "veylo-user"}-${Date.now()}`
      setFormState((current) => ({
        ...current,
        profilePic: `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(seed)}`,
      }))
      toast.success("Random profile picture genrated!")
    }


  return (
    <div className="min-h-dvh bg-base-100 text-base-content flex items-center justify-center p-3 sm:p-4">
      <div className="card bg-base-200 text-base-content w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto shadow-2xl rounded-2xl">
        <div className="card-body p-4 sm:p-5">
        <h1 className="text-lg font-bold text-center mb-1">{isEditing ? "Edit Your Profile" : "Complete Your Profile"}</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
        {/* PROFILE PIC CONTAINER */}
      <div className="flex flex-col items-center justify-center space-y-2">
          {/* IMAGE PREVIEW */}
          <div className="size-16 rounded-full bg-base-300 overflow-hidden">
              {formState.profilePic ? (
                  <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                  />
              ) : (
                  <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-7 text-slate-500" />
                  </div>
              )}
          </div>
        {/* Generate Random Avatar BTN */}
        <div className="flex items-center gap-2">
            <button type="button" onClick={handleRandomAvatar} className="btn btn-sm min-h-9 h-9 border-0 bg-pink-500 text-white hover:bg-pink-600">
                <ShuffleIcon className="size-4" />
                Generate Random Avatar
            </button>
        </div>
      </div>
        {/* FULL NAME */}
        <div className="form-control">
    <label className="label py-1">
        <span className="label-text">Full Name</span>
    </label>
    <input
        type="text"
        name="fullName"
        value={formState.fullName}
        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
        className="input input-sm input-bordered w-full"
        placeholder="Your full name"
    />
      </div>
      {/* BIO */}
      <div className="form-control">
          <label className="label py-1">
              <span className="label-text">Bio</span>
          </label>
          <textarea
              name="bio"
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="textarea textarea-sm textarea-bordered h-16 min-h-16"
              placeholder="Tell others about yourself and your language learning goals"
          />
      </div>
      {/* LANGUAGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NATIVE LANGUAGE */}
          <div className="form-control">
              <label className="label py-1">
                  <span className="label-text">Native Language</span>
              </label>
              <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-sm select-bordered w-full"
              >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                      </option>
                  ))}
              </select>
          </div>
        {/* LEARNING LANGUAGE */}
      <div className="form-control">
          <label className="label py-1">
              <span className="label-text">Learning Language</span>
          </label>
          <select
              name="learningLanguage"
              value={formState.learningLanguage}
              onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
              className="select select-sm select-bordered w-full"
          >
              <option value="">Select language you're learning</option>
              {LANGUAGES.map((lang) => (
                  <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                  </option>
              ))}
          </select>
      </div>
      </div>
      {/* LOCATION */}
         <div className="form-control">
    <label className="label py-1">
        <span className="label-text">Location</span>
    </label>
    <div className="relative">
        <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
        <input
            type="text"
            name="location"
            value={formState.location}
            onChange={(e) => setFormState({ ...formState, location: e.target.value })}
            className="input input-sm input-bordered w-full pl-10"
            placeholder="City, Country"
        />
    </div>
      </div>  
       {/*SUBMIT BUTTON*/}
              <button className="btn btn-sm btn-primary w-full" disabled={isPending} type="submit">{
                !isPending ?(
                  <>
                  <ShipWheelIcon className="size-5 mr-2"/>
                  {isEditing ? "Save Changes" : "Complete Onboarding"}
                  </>
                ):(
                  <>
                  <LoaderIcon className="animate-spin size-5 mr-2"/>
                  Saving...
                  </>
                )}

              </button>
        </form>

        </div>
      </div>
      
    </div>
  )
}

export default OnboardingPage
