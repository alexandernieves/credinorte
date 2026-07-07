"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  Boxes, 
  ShoppingBag, 
  DollarSign, 
  Wallet, 
  Percent, 
  Calculator, 
  FileChartColumn, 
  Settings2, 
  CircleHelp,
  Search
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const sidebarData = {
  user: {
    name: "ALEXC",
    email: "CreditNorte - 1.0.0",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      value: "dashboard",
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      title: "Inventario",
      value: "inventario",
      icon: <Boxes className="size-4" />,
      subGroups: [
        {
          title: "Fichero",
          value: "group_fichero",
          items: [
            { title: "Productos", value: "inv_productos" },
            { title: "Almacenes", value: "inv_almacenes" },
            { title: "Categorías", value: "inv_categorias" },
            { title: "Departamentos", value: "inv_departamentos" },
            { title: "Grupos", value: "inv_grupos" },
            { title: "Marcas", value: "inv_marcas" },
            { title: "Tipos de Precios", value: "inv_tipos_precios" },
            { title: "Versiones", value: "inv_versiones" },
          ]
        },
        {
          title: "Transacciones",
          value: "group_transacciones",
          items: [
            { title: "Ajustes E/S de Inventarios", value: "inv_ajustes" },
            { title: "Transferencias entre Almacenes", value: "inv_transferencias" },
            { title: "Trazabilidad de Seriales", value: "inv_trazabilidad" },
          ]
        },
        {
          title: "Procesos",
          value: "group_procesos",
          items: [
            { title: "Ajustar Precios", value: "inv_ajustar_precios" },
          ]
        },
        {
          title: "Reportes",
          value: "group_reportes",
          items: [
            { title: "Movimiento de Inventario", value: "inv_rep_movimientos" },
            { title: "Inventario por Almacén", value: "inv_rep_almacen" },
            { title: "Listado de Precios", value: "inv_rep_precios" },
            { title: "Inventario por Franquicia", value: "inv_rep_franquicia" },
            { title: "Resumen Ajustes", value: "inv_rep_resumen" },
            { title: "Existencias por Almacén", value: "inv_rep_existencias" },
            { title: "Hoja de Inventario", value: "inv_rep_hoja" },
            { title: "Inventario por Zona y Almacén", value: "inv_rep_zona" },
          ]
        }
      ]
    },
    {
      title: "Compras",
      value: "compras",
      icon: <ShoppingBag className="size-4" />,
      subGroups: [
        {
          title: "Fichero",
          value: "group_compras_fichero",
          items: [
            { title: "Proveedores", value: "comp_proveedores" },
            { title: "Histórico Tasas", value: "comp_tasas" },
          ]
        },
        {
          title: "Transacciones",
          value: "group_compras_transacciones",
          items: [
            { title: "CONTABLE", value: "hdr_contable", isHeader: true },
            { title: "Devolución de Compras", value: "comp_devolucion" },
            { title: "Documentos a Proveedores", value: "comp_doc_proveedores" },
            { title: "Facturas de Compras", value: "comp_facturas" },
            { title: "Órdenes de Compra", value: "comp_ordenes" },
            { title: "FINANCIERO", value: "hdr_financiero", isHeader: true },
            { title: "Notas de Recepción", value: "comp_notas_recepcion" },
            { title: "Devolución de Nota de Recepción", value: "comp_dev_notas_recepcion" },
            { title: "Previo Nota de Recepción (PNRC)", value: "comp_previo_notas_recepcion" },
          ]
        },
        {
          title: "Otros",
          value: "group_compras_otros",
          items: [
            { title: "Edición de Documentos", value: "comp_edicion_documentos" },
          ]
        },
        {
          title: "Reportes",
          value: "group_compras_reportes",
          items: [
            { title: "Cuentas por Pagar", value: "comp_rep_cxp" },
            { title: "Listado de Compras por Proveedor", value: "comp_rep_compras_proveedor" },
          ]
        }
      ]
    },
    {
      title: "Ventas",
      value: "ventas",
      icon: <DollarSign className="size-4" />,
      subGroups: [
        {
          title: "Fichero",
          value: "group_ventas_fichero",
          items: [
            { title: "Clientes", value: "ven_clientes" },
            { title: "Vendedores", value: "ven_vendedores" },
            { title: "Histórico Tasas", value: "ven_tasas" },
            { title: "Franquicias", value: "ven_franquicias" },
            { title: "Franquicia - Vendedor", value: "ven_franquicia_vendedor" },
          ]
        },
        {
          title: "Transacciones",
          value: "group_ventas_transacciones",
          items: [
            { title: "CONTABLE", value: "hdr_ven_contable", isHeader: true },
            { title: "Factura Manual", value: "ven_factura_manual" },
            { title: "Cotización de Ventas", value: "ven_cotizacion" },
            { title: "Devolución Notas de Crédito", value: "ven_dev_nc" },
            { title: "Documentos a Clientes", value: "ven_doc_clientes" },
            { title: "Facturas de Ventas", value: "ven_facturas" },
            { title: "Pedidos de Ventas", value: "ven_pedidos" },
            { title: "Punto de Venta", value: "ven_pdv" },
            { title: "FINANCIERO", value: "hdr_ven_financiero", isHeader: true },
            { title: "Contrato Crédito", value: "ven_contrato_credito" },
            { title: "Devolución Contrato Crédito", value: "ven_dev_contrato" },
          ]
        },
        {
          title: "Reportes",
          value: "group_ventas_reportes",
          items: [
            { title: "DATAS", value: "hdr_ven_datas", isHeader: true },
            { title: "Detalle Documentos de Ventas", value: "ven_rep_detalle_docs" },
            { title: "Data de Ventas (Documentos)", value: "ven_rep_data_ventas" },
            { title: "Ranking de Ventas", value: "ven_rep_ranking" },
            { title: "FINANCIERO", value: "hdr_ven_rep_financiero", isHeader: true },
            { title: "Cuentas por Cobrar", value: "ven_rep_cxc" },
            { title: "Estado de Cuenta Cliente", value: "ven_rep_estado_cuenta" },
            { title: "Conciliación Bancaria", value: "ven_rep_conciliacion" },
            { title: "Clientes", value: "ven_rep_clientes" },
          ]
        }
      ]
    },
    {
      title: "Finanzas",
      value: "finanzas",
      icon: <Wallet className="size-4" />,
      subGroups: [
        {
          title: "Fichero",
          value: "group_fin_fichero",
          items: [
            { title: "BANCO", value: "hdr_fin_banco", isHeader: true },
            { title: "Directorio de Bancos", value: "fin_dir_bancos" },
            { title: "Bancos de la Empresa", value: "fin_bancos_empresa" },
            { title: "Marcas Financieras", value: "fin_marcas" },
            { title: "CUENTAS POR PAGAR", value: "hdr_fin_cxp", isHeader: true },
            { title: "Serie Comprobantes Pago", value: "fin_serie_comp_pago" },
            { title: "CUENTAS POR COBRAR", value: "hdr_fin_cxc", isHeader: true },
            { title: "Serie Recibos de Ingreso", value: "fin_serie_recibos" },
            { title: "Histórico Tasas", value: "fin_hist_tasas" },
          ]
        },
        {
          title: "Transacciones",
          value: "group_fin_transacciones",
          items: [
            { title: "BANCO", value: "hdr_fin_trx_banco", isHeader: true },
            { title: "Depósitos", value: "fin_depositos" },
            { title: "Transferencia entre Bancos", value: "fin_transferencias" },
            { title: "Movimientos de Bancos", value: "fin_movimientos" },
            { title: "Conciliación Bancaria", value: "fin_conciliacion" },
            { title: "Gestión de Movimientos Bancarios", value: "fin_gestion_mov" },
            { title: "CUENTAS POR PAGAR", value: "hdr_fin_trx_cxp", isHeader: true },
            { title: "Comprobante de Pagos", value: "fin_comp_pagos" },
            { title: "CUENTAS POR COBRAR", value: "hdr_fin_trx_cxc", isHeader: true },
            { title: "Recibos de Ingreso", value: "fin_recibos_ingreso" },
            { title: "Recibos en Lote", value: "fin_recibos_lote" },
          ]
        },
        {
          title: "Reportes",
          value: "group_fin_reportes",
          items: [
            { title: "COMISIONES", value: "hdr_fin_comisiones", isHeader: true },
            { title: "Reporte de Comisiones", value: "fin_rep_comisiones" },
            { title: "COBRANZA", value: "hdr_fin_cobranza", isHeader: true },
            { title: "Cobranza General", value: "fin_rep_cobranza" },
            { title: "Cuadre de Caja", value: "fin_rep_cuadre_caja" },
            { title: "Status de Créditos", value: "fin_rep_status_creditos" },
          ]
        }
      ]
    },
    {
      title: "Tributos",
      value: "tributos",
      icon: <Percent className="size-4" />,
      subGroups: [
        {
          title: "Fichero",
          value: "group_trib_fichero",
          items: [
            { title: "Movimiento Mensual de Inventario", value: "trib_mov_mensual_inv" },
            { title: "Documentos de Compras", value: "trib_doc_compras" },
            { title: "Documentos de Ventas", value: "trib_doc_ventas" },
          ]
        },
        {
          title: "Transacciones",
          value: "group_trib_transacciones",
          items: [
            { title: "TXT SENIAT", value: "trib_txt_seniat" },
            { title: "Xml Retencion ISLR", value: "trib_xml_islr" },
            { title: "Relacion Mensual Compra-Venta", value: "trib_relacion_compra_venta" },
          ]
        },
        {
          title: "Reportes",
          value: "group_trib_reportes",
          items: [
            { title: "LIBROS", value: "hdr_trib_libros", isHeader: true },
            { title: "Libro de Inventarios", value: "trib_libro_inventarios" },
            { title: "Libro de Compras", value: "trib_libro_compras" },
            { title: "Libro de Ventas", value: "trib_libro_ventas" },
            { title: "Resumen Anual de Retenciones ISLR", value: "trib_resumen_ret_islr" },
          ]
        }
      ]
    },
    {
      title: "Contabilidad",
      value: "contabilidad",
      icon: <Calculator className="size-4" />,
      subGroups: [
        {
          title: "Fichero",
          value: "group_con_fichero",
          items: [
            { title: "Plan de Cuentas", value: "con_plan_cuentas" },
            { title: "Cuentas de Integracion", value: "con_cuentas_integracion" },
          ]
        },
        {
          title: "Transacciones",
          value: "group_con_transacciones",
          items: [
            { title: "Asientos Contables Diferidos", value: "con_asientos_diferidos" },
            { title: "Asientos Contables Actualizados", value: "con_asientos_actualizados" },
            { title: "(Plantilla de Asientos)", value: "con_plantilla_asientos" },
          ]
        },
        {
          title: "Procesos",
          value: "group_con_procesos",
          items: [
            { title: "Asiento de Cierre", value: "con_asiento_cierre" },
            { title: "Contabilizacion Personalizada", value: "con_contabilizacion_pers" },
          ]
        },
        {
          title: "Otros",
          value: "group_con_otros",
          items: [
            { title: "Pendiente por Contabilizar", value: "con_pendiente_contabilizar" },
            { title: "Auditor con Cbte Asientos Vacios", value: "con_auditor_vacios" },
            { title: "Asientos en diferencia", value: "con_asientos_diferencia" },
            { title: "Bloqueo de Meses administrativo contable", value: "con_bloqueo_meses" },
          ]
        },
        {
          title: "Reportes",
          value: "group_con_reportes",
          items: [
            { title: "De Gestión", value: "hdr_con_rep_gestion", isHeader: true },
            { title: "Plan de Cuentas", value: "con_rep_plan_cuentas" },
            { title: "Saldos de Comprobantes", value: "con_rep_saldos_comprobantes" },
            { title: "Saldos de las Cuentas a Una Fecha", value: "con_rep_saldos_fecha" },
            { title: "Pie de página para folios Libros Contables", value: "con_rep_pie_folios" },
            
            { title: "Contables", value: "hdr_con_rep_contables", isHeader: true },
            { title: "Balance de Comprobacion", value: "con_rep_balance_comprobacion" },
            { title: "Estado de Resultados", value: "con_rep_estado_resultados" },
            { title: "Estado de Situacion Financiera", value: "con_rep_estado_situacion" },
            { title: "Libro Diario", value: "con_rep_libro_diario" },
            { title: "Libro Diario Resumido", value: "con_rep_libro_diario_res" },
            { title: "Libro Mayor", value: "con_rep_libro_mayor" },
            { title: "Libro Mayor Resumidos", value: "con_rep_libro_mayor_res" },
            { title: "Libro Mayor Terceros", value: "con_rep_libro_mayor_terc" },
            { title: "Libro Mayor (Van-Vienen)", value: "con_rep_libro_mayor_vv" },
            
            { title: "GENERALES", value: "hdr_con_rep_generales", isHeader: true },
            { title: "Balance Comprobación General", value: "con_rep_balance_general" },
            { title: "Libro Mayor General", value: "con_rep_libro_mayor_general" },
            { title: "Libro Mayor Terceros General", value: "con_rep_libro_mayor_terc_gen" },
            { title: "Estado de Situacion Financiera General", value: "con_rep_estado_situacion_gen" },
            { title: "Estado de Resultados General", value: "con_rep_estado_resultados_gen" },
          ]
        }
      ]
    },
    {
      title: "Reportes",
      value: "reportes",
      icon: <FileChartColumn className="size-4" />,
      subGroups: [
        {
          title: "Fichero",
          value: "group_rep_fichero",
          items: [
            { title: "Reportes Personalizados", value: "rep_personalizados" },
          ]
        }
      ]
    },
  ],
  navSecondary: [
    {
      title: "Ayuda",
      url: "#",
      icon: <CircleHelp className="size-4" />,
    },
    {
      title: "Buscar",
      url: "#",
      icon: <Search className="size-4" />,
    },
  ],
}

export function AppSidebar({
  activeModule,
  onSelectModule,
  onSearchClick,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activeModule: string
  onSelectModule: (module: string) => void
  onSearchClick?: () => void
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [isHelpOpen, setIsHelpOpen] = React.useState(false)

  const navSecondaryItems = [
    {
      title: "Ayuda",
      onClick: () => setIsHelpOpen(true),
      icon: <CircleHelp className="size-4" />,
    },
    {
      title: "Buscar",
      onClick: onSearchClick,
      icon: <Search className="size-4" />,
    },
  ]

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className={`h-14! w-full! flex items-center justify-center transition-all ${
                  isCollapsed 
                    ? "data-[slot=sidebar-menu-button]:p-0!" 
                    : "data-[slot=sidebar-menu-button]:p-2! gap-2.5"
                }`}
                onClick={() => onSelectModule("dashboard")}
              >
                {isCollapsed ? (
                  <img 
                    src="/credinorte.png" 
                    alt="CrediNorte Logo" 
                    className="h-8 w-8 object-contain flex-shrink-0" 
                  />
                ) : (
                  <div className="flex items-center gap-2.5 w-full pl-1">
                    <img 
                      src="/credinorte.png" 
                      alt="CrediNorte Logo" 
                      className="h-10 w-10 object-contain flex-shrink-0" 
                    />
                    <span className="text-lg font-bold font-fredoka tracking-wide text-foreground animate-in fade-in duration-300">
                      CrediNorte
                    </span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain 
            items={sidebarData.navMain} 
            activeModule={activeModule}
            onSelectModule={onSelectModule}
          />
          <NavSecondary items={navSecondaryItems} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={sidebarData.user} onSelectModule={onSelectModule} />
        </SidebarFooter>
      </Sidebar>

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-[360px] border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center text-center gap-4">
          <DialogHeader className="items-center text-center flex flex-col gap-2">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <CircleHelp className="w-6 h-6" />
            </span>
            <DialogTitle className="text-xl font-bold font-fredoka">
              Soporte Técnico
            </DialogTitle>
          </DialogHeader>

          <a
            href="https://wa.me/584127674690?text=Hola%20Alexander,%20necesito%20soporte%20con%20el%20sistema%20CreditNorte."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2"
          >
            <Button
              className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold h-11 rounded-xl shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2 border-0"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.028L2 22l5.13-1.346a9.921 9.921 0 004.881 1.28h.005c5.505 0 9.989-4.478 9.99-9.984A9.97 9.97 0 0012.012 2zm5.748 13.917c-.24.678-1.4 1.272-1.928 1.353-.483.074-1.11.102-1.78-.115-.417-.136-.96-.328-1.644-.622-2.912-1.251-4.793-4.24-4.938-4.437-.145-.196-1.177-1.587-1.177-3.027 0-1.44.739-2.148 1.003-2.424.263-.276.577-.346.77-.346l.544.004c.174.002.408-.067.638.498.24.587.816 2.01.887 2.155.07.145.118.315.02.507-.097.192-.145.313-.288.483-.143.17-.303.38-.433.51-.144.143-.294.3-.127.587.168.288.747 1.246 1.6 2.017.954.858 1.761 1.127 2.01 1.251.249.125.396.102.544-.067.149-.17.638-.747.81-.998.172-.25.343-.208.577-.123.235.086 1.493.708 1.748.837.256.128.427.193.49.301.064.108.064.623-.176 1.301z"/>
              </svg>
              Contactar por WhatsApp
            </Button>
          </a>
        </DialogContent>
      </Dialog>
    </>
  )
}
