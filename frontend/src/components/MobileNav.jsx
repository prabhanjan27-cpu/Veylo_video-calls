import { Link, useLocation } from "react-router"
import { BellIcon, HomeIcon, UserCircleIcon, UsersIcon } from "lucide-react"

const navigationItems = [
  { to: "/", label: "Home", Icon: HomeIcon },
  { to: "/friends", label: "Friends", Icon: UsersIcon },
  { to: "/notification", label: "Notifications", Icon: BellIcon },
  { to: "/profile", label: "Profile", Icon: UserCircleIcon },
]

const MobileNav = () => {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-base-300 bg-base-200 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navigationItems.map(({ to, label, Icon }) => {
        const isActive = pathname === to

        return (
          <Link
            key={to}
            to={to}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs ${
              isActive ? "text-primary" : "text-base-content/70"
            }`}
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default MobileNav
