"use client"

import * as React from "react"
import { toast } from "sonner"

export interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void
  simulateNotification: () => void
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Existencias Bajas",
    description: "El producto AIRE ACOND DE VENTANA 8.000 BTU TCL está por debajo del stock mínimo.",
    timestamp: "Hace 5 min",
    type: "warning",
    read: false,
  },
  {
    id: "2",
    title: "Venta Registrada",
    description: "Venta #0000000012 procesada con éxito por $591.60.",
    timestamp: "Hace 20 min",
    type: "success",
    read: false,
  },
  {
    id: "3",
    title: "Tasa de Cambio Actualizada",
    description: "La tasa USD/Bs. BCV de Sucursal Andes se actualizó a 36.40 Bs.",
    timestamp: "Hace 1 hora",
    type: "info",
    read: true,
  },
  {
    id: "4",
    title: "Error de Respaldo",
    description: "No se pudo completar el respaldo automático de base de datos nocturno.",
    timestamp: "Hace 4 horas",
    type: "error",
    read: false,
  }
]

const SIMULATED_TEMPLATES = [
  {
    title: "Nueva Venta",
    description: "Se ha registrado la factura #0000000013 por $324.80.",
    type: "success" as const,
  },
  {
    title: "Alerta de Stock",
    description: "El producto CELULAR XIAOMI REDMI 15C está cerca del límite mínimo (5 unidades).",
    type: "warning" as const,
  },
  {
    title: "Tasa Actualizada",
    description: "La tasa USD/Bs. BCV de Sucursal Llanos se ha ajustado a 36.45 Bs.",
    type: "info" as const,
  },
  {
    title: "Usuario Conectado",
    description: "Inicio de sesión detectado desde una nueva dirección IP para Alexander Nieves.",
    type: "info" as const,
  },
  {
    title: "Error de Conexión",
    description: "La sincronización con el servidor de la Sucursal Llanos falló temporalmente.",
    type: "error" as const,
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>(INITIAL_NOTIFICATIONS)

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const markAsRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("Todas las notificaciones marcadas como leídas")
  }, [])

  const deleteNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const addNotification = React.useCallback(
    (notification: Omit<Notification, "id" | "read" | "timestamp">) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substring(2, 9),
        read: false,
        timestamp: "Hace un momento",
      }
      setNotifications((prev) => [newNotification, ...prev])

      // Trigger standard toast feedback
      if (newNotification.type === "success") {
        toast.success(newNotification.title, { description: newNotification.description })
      } else if (newNotification.type === "warning") {
        toast.warning(newNotification.title, { description: newNotification.description })
      } else if (newNotification.type === "error") {
        toast.error(newNotification.title, { description: newNotification.description })
      } else {
        toast.info(newNotification.title, { description: newNotification.description })
      }
    },
    []
  )

  const simulateNotification = React.useCallback(() => {
    const template = SIMULATED_TEMPLATES[Math.floor(Math.random() * SIMULATED_TEMPLATES.length)]
    addNotification(template)
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
        simulateNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
