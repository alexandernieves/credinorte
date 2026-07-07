"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Search,
  Package,
  Warehouse,
  Users,
  Building2,
  FileText,
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  DollarSign,
  Settings2,
  Receipt,
  ArrowRight,
  Calculator,
  Percent,
} from "lucide-react"

// Types matching states in dashboard-content
interface Product {
  id: string
  code: string
  name: string
  category: string
  brand: string
  department: string
  group: string
  stock: number
  minStock: number
  price: number
  warehouse: string
  version: string
  priceType: string
}

interface WarehouseData {
  code: string
  name: string
  activo: boolean
  lpt: string
  predestino: string
  transito: string
  tipo: string
  zona: string
  puerto: number
}

interface CustomerData {
  id: string
  code: string
  name: string
  rif: string
  phone: string
  email: string
  creditLimit: number
  balance: number
  franchise: string
  seller: string
  status: string
}

interface SupplierData {
  id: string
  code: string
  name: string
  rif: string
  phone: string
  email: string
  creditLimit: number
  balance: number
  status: string
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectModule: (module: string) => void
  
  products: any[]
  onEditProduct: (p: any) => void
  
  warehouses: any[]
  onEditWarehouse: (w: any) => void
  
  customers: any[]
  onEditCustomer: (c: any) => void
  
  suppliers: any[]
  onEditSupplier: (s: any) => void
  
  salesInvoices: any[]
  onSelectSalesInvoice: (docNumber: string) => void

  categories?: any[]
  onEditCategory?: (c: any) => void
  departments?: any[]
  onEditDepartment?: (d: any) => void
  groups?: any[]
  onEditGroup?: (g: any) => void
  brands?: any[]
  onEditBrand?: (b: any) => void
  priceTypes?: any[]
  onEditPriceType?: (pt: any) => void
  versions?: any[]
  onEditVersion?: (v: any) => void
}

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  category: "Módulos" | "Productos" | "Almacenes" | "Clientes" | "Proveedores" | "Facturas de Venta"
  icon: React.ReactNode
  onClick: () => void
}

const ALL_MODULES = [
  { title: "Panel de Control / Dashboard", value: "dashboard", icon: <LayoutDashboard className="size-4" /> },
  { title: "Inventario - Catálogo General", value: "inventario", icon: <Boxes className="size-4" /> },
  { title: "Fichero: Catálogo de Productos", value: "inv_productos", icon: <Package className="size-4" /> },
  { title: "Fichero: Catálogo de Almacenes", value: "inv_almacenes", icon: <Warehouse className="size-4" /> },
  { title: "Proceso: Ajustar Precios Masivos", value: "inv_ajustar_precios", icon: <Calculator className="size-4" /> },
  { title: "Transacciones: Ajustes de Entrada/Salida", value: "inv_ajustes", icon: <FileText className="size-4" /> },
  { title: "Transacciones: Transferencias entre Almacenes", value: "inv_transferencias", icon: <FileText className="size-4" /> },
  { title: "Compras - DLL Principal", value: "compras", icon: <ShoppingBag className="size-4" /> },
  { title: "Fichero: Directorio de Proveedores", value: "comp_proveedores", icon: <Building2 className="size-4" /> },
  { title: "Transacciones: Facturas de Compras", value: "comp_facturas", icon: <Receipt className="size-4" /> },
  { title: "Ventas - DLL Principal", value: "ventas", icon: <DollarSign className="size-4" /> },
  { title: "Fichero: Directorio de Clientes", value: "ven_clientes", icon: <Users className="size-4" /> },
  { title: "Transacciones: Facturas de Ventas", value: "ven_facturas", icon: <Receipt className="size-4" /> },
  { title: "Transacciones: Punto de Venta (PDV)", value: "ven_pdv", icon: <Percent className="size-4" /> },
  { title: "Notificaciones del Sistema", value: "notificaciones", icon: <FileText className="size-4" /> },
  { title: "Configuración de Usuarios", value: "configuracion_usuarios", icon: <Settings2 className="size-4" /> },
  { title: "Configuración de Cuenta", value: "configuracion_cuenta", icon: <Settings2 className="size-4" /> },
]

export function SearchDialog({
  open,
  onOpenChange,
  onSelectModule,
  products,
  onEditProduct,
  warehouses,
  onEditWarehouse,
  customers,
  onEditCustomer,
  suppliers,
  onEditSupplier,
  salesInvoices,
  onSelectSalesInvoice,
}: SearchDialogProps) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const resultsContainerRef = React.useRef<HTMLDivElement>(null)

  // Reset selection index when query changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Filter items based on query
  const filteredResults = React.useMemo((): SearchResult[] => {
    const normQuery = query.toLowerCase().trim()

    if (!normQuery) {
      // Return top suggested modules when query is empty
      return ALL_MODULES.slice(0, 7).map((m) => ({
        id: `module-${m.value}`,
        title: m.title,
        category: "Módulos",
        icon: m.icon,
        onClick: () => {
          onSelectModule(m.value)
          onOpenChange(false)
        },
      }))
    }

    const list: SearchResult[] = []

    // 1. Filter Modules
    ALL_MODULES.forEach((m) => {
      if (m.title.toLowerCase().includes(normQuery)) {
        list.push({
          id: `module-${m.value}`,
          title: m.title,
          category: "Módulos",
          icon: m.icon,
          onClick: () => {
            onSelectModule(m.value)
            onOpenChange(false)
          },
        })
      }
    })

    // 2. Filter Products
    products.forEach((p) => {
      if (p.name.toLowerCase().includes(normQuery) || p.code.toLowerCase().includes(normQuery)) {
        list.push({
          id: `product-${p.id}`,
          title: p.name,
          subtitle: `Código: ${p.code} · Precio: $${p.price.toFixed(2)} · Stock: ${p.stock}`,
          category: "Productos",
          icon: <Package className="size-4 text-sky-500" />,
          onClick: () => {
            onSelectModule("inv_productos")
            onEditProduct(p)
            onOpenChange(false)
          },
        })
      }
    })

    // 3. Filter Customers
    customers.forEach((c) => {
      if (
        c.name.toLowerCase().includes(normQuery) ||
        c.code.toLowerCase().includes(normQuery) ||
        c.rif.toLowerCase().includes(normQuery)
      ) {
        list.push({
          id: `customer-${c.id}`,
          title: c.name,
          subtitle: `Código: ${c.code} · RIF: ${c.rif} · Saldo: $${Number(c.balance).toFixed(2)}`,
          category: "Clientes",
          icon: <Users className="size-4 text-emerald-500" />,
          onClick: () => {
            onSelectModule("ven_clientes")
            onEditCustomer(c)
            onOpenChange(false)
          },
        })
      }
    })

    // 4. Filter Suppliers
    suppliers.forEach((s) => {
      if (
        s.name.toLowerCase().includes(normQuery) ||
        s.code.toLowerCase().includes(normQuery) ||
        s.rif.toLowerCase().includes(normQuery)
      ) {
        list.push({
          id: `supplier-${s.id}`,
          title: s.name,
          subtitle: `Código: ${s.code} · RIF: ${s.rif} · Saldo: $${Number(s.balance).toFixed(2)}`,
          category: "Proveedores",
          icon: <Building2 className="size-4 text-amber-500" />,
          onClick: () => {
            onSelectModule("comp_proveedores")
            onEditSupplier(s)
            onOpenChange(false)
          },
        })
      }
    })

    // 5. Filter Warehouses
    warehouses.forEach((w) => {
      if (w.name.toLowerCase().includes(normQuery) || w.code.toLowerCase().includes(normQuery)) {
        list.push({
          id: `warehouse-${w.code}`,
          title: w.name,
          subtitle: `Código: ${w.code} · Zona: ${w.zona} · Tipo: ${w.tipo}`,
          category: "Almacenes",
          icon: <Warehouse className="size-4 text-indigo-500" />,
          onClick: () => {
            onSelectModule("inv_almacenes")
            onEditWarehouse(w)
            onOpenChange(false)
          },
        })
      }
    })

    // 6. Filter Sales Invoices
    salesInvoices.forEach((s) => {
      if (s.docNumber.toLowerCase().includes(normQuery) || s.customer.toLowerCase().includes(normQuery)) {
        list.push({
          id: `invoice-${s.id}`,
          title: `Factura de Venta #${s.docNumber}`,
          subtitle: `Cliente: ${s.customer} · Total: $${Number(s.total).toFixed(2)} · Estado: ${s.status}`,
          category: "Facturas de Venta",
          icon: <Receipt className="size-4 text-rose-500" />,
          onClick: () => {
            onSelectSalesInvoice(s.docNumber)
            onOpenChange(false)
          },
        })
      }
    })

    return list
  }, [
    query,
    products,
    warehouses,
    customers,
    suppliers,
    salesInvoices,
    onSelectModule,
    onEditProduct,
    onEditWarehouse,
    onEditCustomer,
    onEditSupplier,
    onSelectSalesInvoice,
    onOpenChange,
  ])

  // Keydown handlers for Arrow keys and Enter
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredResults[selectedIndex]) {
          filteredResults[selectedIndex].onClick()
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filteredResults, selectedIndex])

  // Scroll active item into view
  React.useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  // Clean query on close
  React.useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])

  // Group filtered results by category
  const groupedResults = React.useMemo(() => {
    const groups: Record<string, typeof filteredResults> = {}
    filteredResults.forEach((item, index) => {
      // Tag item with its absolute index to match selection highlight
      const itemWithIndex = { ...item, absoluteIndex: index }
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(itemWithIndex)
    })
    return groups
  }, [filteredResults])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-xl p-0 overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl select-none animate-in fade-in zoom-in-95 duration-200"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Buscador Global</DialogTitle>
        </DialogHeader>

        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <Search className="size-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <Input
            placeholder="Buscar comandos, productos, clientes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0 p-0 text-sm font-sans h-auto bg-transparent text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400/85 dark:placeholder:text-zinc-500/85"
            autoFocus
          />
        </div>

        {/* Results Body */}
        <div
          ref={resultsContainerRef}
          className="max-h-[340px] overflow-y-auto p-2 space-y-3"
        >
          {filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-50">
                <Search className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-3">
                Sin resultados
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 px-6">
                No encontramos coincidencias para "{query}".
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="space-y-0.5">
                <h4 className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500/80 uppercase tracking-wider px-3.5 py-1.5 font-heading">
                  {category}
                </h4>
                <div className="space-y-0.5">
                  {items.map((item: any) => {
                    const isActive = item.absoluteIndex === selectedIndex
                    return (
                      <div
                        key={item.id}
                        data-active={isActive}
                        onClick={item.onClick}
                        className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                          isActive
                            ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 ${
                              isActive
                                ? "bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-900 dark:text-zinc-100"
                                : "bg-zinc-100/50 dark:bg-zinc-800/30"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate leading-tight">
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p
                                className={`text-[10px] truncate leading-none mt-1 ${
                                  isActive
                                    ? "text-zinc-500 dark:text-zinc-400"
                                    : "text-zinc-400 dark:text-zinc-500"
                                }`}
                              >
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        {isActive && (
                          <div className="flex items-center gap-1 select-none text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-medium shrink-0 pr-1 animate-in fade-in duration-200">
                            <span>Ir</span>
                            <span>↵</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 text-[10px] text-zinc-400 dark:text-zinc-500 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60 text-[9px]">↑↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60 text-[9px]">↵ Enter</kbd>
              Seleccionar
            </span>
          </div>
          <div>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60 text-[9px]">ESC</kbd>
              Cerrar
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
