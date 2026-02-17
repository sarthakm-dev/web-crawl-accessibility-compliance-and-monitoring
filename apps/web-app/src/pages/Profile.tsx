import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {type UserType} from "../../../../packages/shared-types/user.types"


export default function Profile() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get("http://localhost:5000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(res.data);
        setUser(res.data)
      } catch (err) {
        console.error("Failed to fetch profile", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <div className="p-8">Loading profile...</div>
  }

  if (!user) {
    return <div className="p-8 text-red-500">Failed to load profile</div>
  }

  const role = user.Roles?.[0]?.name ?? "User"

  return (
    <div className="flex-1 min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 p-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 text-sm">
          Manage your account information and access level
        </p>
      </div>

      <Card className="rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">

  
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-20 w-20 bg-blue-500 text-white text-xl">
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-500">{user.email}</p>
              </div>

              

              <Button
                variant="destructive"
                className="mt-4 w-full md:w-auto"
                onClick={() => {
                  localStorage.removeItem("token")
                  window.location.href = "/"
                }}
              >
                Logout
              </Button>
            </div>

          
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-800">
                  {role.toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-800">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <Badge className="bg-green-100 text-green-700">
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}