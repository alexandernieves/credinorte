"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { useNotifications } from "@/context/notification-context"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Sun,
  Moon,
  Trash2,
  Check,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react"

interface SiteHeaderProps {
  title?: string
}

export function SiteHeader({ title = "Documents" }: SiteHeaderProps) {
  const { theme, setTheme } = useTheme()
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    simulateNotification,
  } = useNotifications()

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        )
      case "warning":
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        )
      case "error":
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
          </div>
        )
      default:
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Info className="h-3.5 w-3.5" />
          </div>
        )
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1 text-foreground/80 hover:text-foreground" />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 data-vertical:self-auto bg-border"
          />
          <h1 className="text-base font-semibold text-foreground tracking-wide font-heading">
            {title}
          </h1>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Notifications Center */}
          <Popover>
            <PopoverTrigger render={
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
                aria-label="Abrir centro de notificaciones"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white ring-2 ring-background">
                    {unreadCount}
                  </span>
                )}
              </Button>
            } />
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-96 p-4 mr-4 bg-popover text-popover-foreground rounded-lg border border-border shadow-md select-none"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm font-heading text-foreground">
                    Notificaciones
                  </h3>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary select-none">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-1 px-2 rounded-md transition-colors"
                  >
                    <Check className="h-3 w-3" />
                    Marcar todo leído
                  </Button>
                )}
              </div>

              {/* Notification List */}
              <div className="my-3 max-h-[300px] overflow-y-auto space-y-1.5 pr-0.5">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground/60">
                      <Bell className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mt-3">
                      Bandeja vacía
                    </p>
                    <p className="text-[11px] text-muted-foreground/75 mt-0.5 px-6">
                      No tienes alertas ni notificaciones registradas en este momento.
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`group relative flex gap-3 p-2.5 rounded-lg transition-all duration-200 border border-transparent ${
                        item.read
                          ? "bg-transparent hover:bg-accent/40"
                          : "bg-primary/[0.02] dark:bg-primary/[0.04] hover:bg-accent/40"
                      }`}
                    >
                      {getNotificationIcon(item.type)}

                      <div className="flex-1 min-w-0 pr-14">
                        <div className="flex items-baseline justify-between gap-1.5">
                          <p className={`text-[13px] font-semibold truncate ${
                            item.read ? "text-foreground/70" : "text-foreground"
                          }`}>
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0 group-hover:opacity-0 transition-opacity duration-200">
                            <span className="text-[10px] text-muted-foreground/80 leading-none">
                              {item.timestamp}
                            </span>
                            {!item.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Item Actions */}
                      <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {!item.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(item.id)}
                            className="h-6 w-6 rounded-md hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                            title="Marcar como leída"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(item.id)}
                          className="h-6 w-6 rounded-md hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                          title="Eliminar notificación"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme switcher */}
          {mounted ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Cambiar tema de color"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 transition-all duration-300 rotate-0 scale-100 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 transition-all duration-300 rotate-0 scale-100 text-slate-700" />
              )}
            </Button>
          ) : (
            <div className="h-9 w-9 rounded-md bg-transparent" />
          )}
        </div>
      </div>
    </header>
  )
}
