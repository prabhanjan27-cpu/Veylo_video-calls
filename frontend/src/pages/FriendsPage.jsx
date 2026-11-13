import { useQuery } from "@tanstack/react-query"
import { UsersIcon } from "lucide-react"
import { getUserFriends } from "../lib/api.js"
import { FriendCard } from "../components/FriendCard.jsx"

const formatFriendDate = (date) => {
  if (!date) return "Friend since date unavailable"

  return `Friends since ${new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`
}

const FriendsPage = () => {
  const { data: friends = [], isLoading, isError } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  })

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <UsersIcon className="size-7 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h1>
          {!isLoading && !isError && (
            <span className="badge badge-primary badge-lg">{friends.length}</span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : isError ? (
          <div className="alert alert-error">Could not load your friends. Please try again.</div>
        ) : friends.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
            <h2 className="font-semibold text-lg mb-2">No friends yet</h2>
            <p className="text-base-content opacity-70">
              Connect with language partners to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
            {friends.map((friend) => (
              <div key={friend._id}>
                <FriendCard friend={friend} />
                <p className="mt-2 px-1 text-sm text-base-content/60">
                  {formatFriendDate(friend.friendsSince)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default FriendsPage
