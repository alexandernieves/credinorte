"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { API_URL } from "@/lib/config"

export interface User {
  id: string
  name: string
  email: string
  role: string
  tenantId: string
  tenantName: string
}

export interface Branch {
  id: string
  name: string
}

interface JwtPayload {
  exp: number
  sub: string
  email: string
  role: string
  tenantId: string
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return true
    
    const payloadJson = atob(parts[1])
    const payload = JSON.parse(payloadJson) as JwtPayload
    
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (e) {
    return true
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  activeBranch: Branch | null
  branches: Branch[]
  login: (email: string, passwordHash: string, rememberMe?: boolean) => Promise<boolean>
  selectBranch: (branch: Branch) => void
  logout: () => void
  isLoading: boolean
  createBranch: (name: string, address?: string) => Promise<boolean>
  getRememberedEmail: () => Promise<string | null>
  forgetRememberedUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [token, setToken] = React.useState<string | null>(null)
  const [activeBranch, setActiveBranch] = React.useState<Branch | null>(null)
  const [branches, setBranches] = React.useState<Branch[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    // Load auth from localStorage on start
    const savedToken = localStorage.getItem("cn_token")
    const savedUser = localStorage.getItem("cn_user")
    const savedBranch = localStorage.getItem("cn_branch")
    const savedBranches = localStorage.getItem("cn_branches")

    if (savedToken && savedUser) {
      if (isTokenExpired(savedToken)) {
        localStorage.removeItem("cn_token")
        localStorage.removeItem("cn_user")
        localStorage.removeItem("cn_branch")
        localStorage.removeItem("cn_branches")
        
        setToken(null)
        setUser(null)
        setActiveBranch(null)
        setBranches([])
        
        toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.")
        router.push("/login")
      } else {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        if (savedBranches) setBranches(JSON.parse(savedBranches))
        if (savedBranch) setActiveBranch(JSON.parse(savedBranch))
      }
    }
    setIsLoading(false)
  }, [router])

  const login = async (email: string, passwordHash: string, rememberMe?: boolean): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, passwordHash, rememberMe }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || "Usuario o clave incorrecta")
      }

      const data = await response.json()
      
      localStorage.setItem("cn_token", data.accessToken)
      localStorage.setItem("cn_user", JSON.stringify(data.user))
      localStorage.setItem("cn_branches", JSON.stringify(data.user.branches))
      
      if (data.rememberToken) {
        localStorage.setItem("cn_remember_token", data.rememberToken)
      } else {
        localStorage.removeItem("cn_remember_token")
      }
      
      setToken(data.accessToken)
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        tenantId: data.user.tenantId,
        tenantName: data.user.tenantName,
      })
      setBranches(data.user.branches)

      toast.success(`Bienvenido de nuevo, ${data.user.name}`)
      
      // If there's multiple branches, direct to branch selection
      if (data.user.branches && data.user.branches.length > 0) {
        if (data.user.branches.length === 1) {
          selectBranch(data.user.branches[0])
        } else {
          router.push("/branch-selection")
        }
      } else {
        router.push("/dashboard")
      }
      return true
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión")
      return false
    }
  }

  const selectBranch = (branch: Branch) => {
    localStorage.setItem("cn_branch", JSON.stringify(branch))
    setActiveBranch(branch)
    toast.success(`Sucursal activa: ${branch.name}`)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("cn_token")
    localStorage.removeItem("cn_user")
    localStorage.removeItem("cn_branch")
    localStorage.removeItem("cn_branches")

    setToken(null)
    setUser(null)
    setActiveBranch(null)
    setBranches([])

    toast.info("Sesión cerrada")
    router.push("/login")
  }

  const createBranch = async (name: string, address?: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/branch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, address }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || "Error al crear la sucursal")
      }

      const data = await response.json()
      setBranches(data.branches)
      localStorage.setItem("cn_branches", JSON.stringify(data.branches))
      toast.success("Sucursal creada exitosamente")
      return true
    } catch (error: any) {
      toast.error(error.message || "Error al crear la sucursal")
      return false
    }
  }

  const getRememberedEmail = async (): Promise<string | null> => {
    const rememberToken = localStorage.getItem("cn_remember_token")
    if (!rememberToken) return null

    try {
      const response = await fetch(`${API_URL}/api/auth/remember-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rememberToken }),
      })

      if (!response.ok) {
        localStorage.removeItem("cn_remember_token")
        return null
      }

      const data = await response.json()
      if (data.email) {
        return data.email
      } else {
        localStorage.removeItem("cn_remember_token")
        return null
      }
    } catch (error) {
      localStorage.removeItem("cn_remember_token")
      return null
    }
  }

  const forgetRememberedUser = async () => {
    const rememberToken = localStorage.getItem("cn_remember_token")
    if (rememberToken) {
      try {
        await fetch(`${API_URL}/api/auth/forget-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rememberToken }),
        })
      } catch (e) {
        // Ignore error
      }
      localStorage.removeItem("cn_remember_token")
    }
    toast.success("Usuario recordado eliminado")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeBranch,
        branches,
        login,
        selectBranch,
        logout,
        isLoading,
        createBranch,
        getRememberedEmail,
        forgetRememberedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
