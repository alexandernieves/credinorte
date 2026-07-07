"use client"

import * as React from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, ArrowRight, LogOut, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function BranchSelectionPage() {
  const { user, branches, selectBranch, logout, isLoading, createBranch } = useAuth()
  const router = useRouter()
  const [newBranchName, setNewBranchName] = React.useState("")
  const [newBranchAddress, setNewBranchAddress] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBranchName.trim()) {
      toast.error("El nombre de la sucursal es requerido")
      return
    }
    setIsCreating(true)
    const success = await createBranch(newBranchName, newBranchAddress)
    setIsCreating(false)
    if (success) {
      setNewBranchName("")
      setNewBranchAddress("")
      setIsDialogOpen(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 font-sans">
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/40 font-sans">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center space-y-2">
          <img 
            src="/credinorte.png" 
            alt="CreditNorte Logo" 
            className="w-16 h-16 mx-auto object-contain" 
          />
          <CardTitle className="text-2xl font-bold font-fredoka text-foreground">
            Seleccionar Sucursal
          </CardTitle>
          <CardDescription className="text-sm">
            {user.name} ({user.role}) • {user.tenantName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground text-center font-medium">
            Por favor, selecciona una sucursal activa para acceder al panel.
          </p>
 
          <div className="grid gap-2">
            {branches.map((branch) => (
              <Button
                key={branch.id}
                variant="outline"
                className="h-12 w-full justify-between px-4 hover:border-primary hover:bg-primary/5 transition-all text-xs font-semibold"
                onClick={() => selectBranch(branch)}
              >
                <div className="flex items-center gap-2">
                  <Store className="size-4 text-primary" />
                  <span>{branch.name}</span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Button>
            ))}

            {user.role === "ADMIN" && (
              <>
                <Button
                  variant="outline"
                  className="h-12 w-full justify-center gap-2 border-dashed border-primary/45 hover:border-primary text-xs font-bold text-primary hover:bg-primary/5 transition-all mt-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="size-4" />
                  <span>Crear Nueva Sucursal</span>
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="sm:max-w-[400px]">
                  <form onSubmit={handleCreateBranch} className="space-y-4">
                    <DialogHeader>
                      <DialogTitle className="font-fredoka text-xl text-foreground">Crear Sucursal</DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">
                        Ingresa los datos para registrar una nueva sucursal en {user.tenantName}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="grid gap-1">
                        <Label htmlFor="name" className="text-xs font-bold text-foreground">Nombre de la Sucursal</Label>
                        <Input
                          id="name"
                          placeholder="Ej. Sucursal Oriente"
                          value={newBranchName}
                          onChange={(e) => setNewBranchName(e.target.value)}
                          required
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="address" className="text-xs font-bold text-foreground">Dirección</Label>
                        <Input
                          id="address"
                          placeholder="Ej. Barcelona, Estado Anzoátegui"
                          value={newBranchAddress}
                          onChange={(e) => setNewBranchAddress(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                        Cancelar
                      </Button>
                      <Button type="submit" size="sm" className="text-xs" disabled={isCreating}>
                        {isCreating ? "Creando..." : "Crear Sucursal"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
          </div>
 
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 font-bold gap-1.5"
            >
              <LogOut className="size-3.5" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
