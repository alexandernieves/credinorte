"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  EllipsisVerticalIcon, 
  CircleUserRoundIcon, 
  BellIcon, 
  LogOutIcon, 
  UsersIcon, 
  Building2Icon, 
  Settings2Icon 
} from "lucide-react"
import { toast } from "sonner"

export function NavUser({
  user,
  onSelectModule,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  onSelectModule: (module: string) => void
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-lg grayscale">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onSelectModule("configuracion_cuenta")}>
                <CircleUserRoundIcon className="size-4 mr-2" />
                Configuración de la Cuenta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSelectModule("notificaciones")}>
                <BellIcon className="size-4 mr-2" />
                Notificaciones
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                Configuración
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onSelectModule("configuracion_usuarios")}>
                <UsersIcon className="size-4 mr-2" />
                Administración de Usuarios
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSelectModule("configuracion_empresas")}>
                <Building2Icon className="size-4 mr-2" />
                Gestor de Empresas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSelectModule("configuracion_datos")}>
                <Settings2Icon className="size-4 mr-2" />
                Datos de la Empresa
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.success("Cerrando sesión...")}>
              <LogOutIcon className="size-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
