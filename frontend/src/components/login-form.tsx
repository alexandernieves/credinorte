"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { User, LogOut, Eye, EyeOff } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login, getRememberedEmail, forgetRememberedUser } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isRemembered, setIsRemembered] = React.useState(false)
  const [isCheckingRemembered, setIsCheckingRemembered] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  React.useEffect(() => {
    const checkRemembered = async () => {
      try {
        const rememberedEmail = await getRememberedEmail()
        if (rememberedEmail) {
          setEmail(rememberedEmail)
          setIsRemembered(true)
        }
      } catch (e) {
        // Ignore
      } finally {
        setIsCheckingRemembered(false)
      }
    }
    checkRemembered()
  }, [getRememberedEmail])

  const handleForgetUser = async () => {
    await forgetRememberedUser()
    setEmail("")
    setIsRemembered(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validations
    if (!email.trim()) {
      toast.error("El correo electrónico es requerido")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("El formato del correo electrónico no es válido")
      return
    }

    if (!password) {
      toast.error("La contraseña es requerida")
      return
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsSubmitting(true)
    await login(email, password, rememberMe || isRemembered)
    setIsSubmitting(false)
  }

  if (isCheckingRemembered) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-2">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground font-medium">Comprobando credenciales...</span>
      </div>
    )
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
          <p className="text-sm text-balance text-muted-foreground font-medium">
            Introduce tu correo y contraseña para acceder al sistema
          </p>
        </div>

        {isRemembered ? (
          /* Profile badge for remembered user */
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-3 select-none animate-fadeIn transition-all hover:border-zinc-300 dark:hover:border-zinc-700/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-zinc-500 dark:text-indigo-400 font-bold uppercase tracking-wider font-mono">Usuario Recordado</span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[120px] sm:max-w-[150px]">{email}</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleForgetUser}
              className="text-[10px] h-7 px-2.5 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-1.5 self-center"
            >
              <LogOut className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              Cambiar
            </Button>
          </div>
        ) : (
          /* Standard email field */
          <Field>
            <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@creditnorte.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        )}

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <a
              href="#"
              className="ml-auto text-xs font-medium text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus={isRemembered}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-ring rounded-sm transition-colors"
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </Field>

        {!isRemembered && (
          /* Remember Me Checkbox */
          <div className="flex items-center space-x-2 py-1 select-none">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label
              htmlFor="remember"
              className="text-xs font-semibold text-muted-foreground cursor-pointer"
            >
              Recordar mi usuario en este equipo
            </label>
          </div>
        )}

        <Field>
          <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-10">
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </Field>
        {/* SSO disabled for now */}
        {/* <FieldSeparator>O continúa con</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" disabled className="w-full text-xs h-10 font-bold">
            Acceso Corporativo SSO
          </Button>
        </Field> */}
      </FieldGroup>
    </form>
  )
}
