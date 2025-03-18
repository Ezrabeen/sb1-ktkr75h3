"use client"

import type React from "react"

import { useState } from "react"
import { useAuth, type UserProfile } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, User, Mail, Phone, Wallet } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CopyButton } from "@/components/ui/copy-button"

export function ProfileManagement() {
  const { user, updateProfile, isLoading } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        variant: "destructive",
      })
      return
    }

    const success = await updateProfile({
      username: formData.username,
      email: formData.email || null,
      phone: formData.phone || null,
    })

    if (success) {
      setIsEditing(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please log in to manage your profile</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your account details and wallet information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet Address
              </Label>
              <div className="flex">
                <Input id="wallet" value={user.walletAddress} disabled className="w-full font-mono text-sm" />
                <CopyButton
                  value={user.walletAddress}
                  className="ml-2"
                  onCopy={() => {
                    toast({
                      title: "Address Copied",
                      description: "Wallet address has been copied to clipboard",
                      variant: "success",
                    })
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Your wallet address cannot be changed</p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                  })
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

