"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Building2, Percent } from "lucide-react"
import { toast } from "sonner"
import DatePickerDemo from "@/components/shadcn-studio/date-picker/date-picker-01"

export interface CompanyData {
  id: string
  tipoContribuyente: string
  rif: string
  itf: string
  fecha: string
  nombre: string
  domicilio1: string
  domicilio2: string
  domicilio3: string
  telefono1: string
  telefono2: string
  telefono3: string
  email: string
  whatsapp: string
  fiscalInicio: string
  fiscalCierre: string
  // Tasas
  ivaGeneral: string
  ivaReducido: string
  ivaAdicional: string
  igtf: string
}

const parseFromYYYYMMDD = (dateString: string) => {
  if (!dateString) return undefined
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const formatToYYYYMMDD = (date: Date | undefined) => {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface CompanyDataDialogProps {
  isOpen: boolean
  onClose: () => void
  initialData: CompanyData
  onSave: (data: CompanyData) => void
}

export function CompanyDataDialog({
  isOpen,
  onClose,
  initialData,
  onSave,
}: CompanyDataDialogProps) {
  const [formData, setFormData] = React.useState<CompanyData>(initialData)

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData)
    }
  }, [isOpen, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string | null) => {
    if (value !== null) {
      setFormData((prev) => ({ ...prev, tipoContribuyente: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    toast.success("Datos de la empresa actualizados correctamente")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            <div>
              <DialogTitle className="text-xl">Empresa de Trabajo</DialogTitle>
              <DialogDescription className="text-xs font-mono mt-0.5">
                GesEmpre.dll Ver. 25.1.20.0
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="datos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="datos" className="flex items-center gap-1.5">
                <Building2 className="size-4" />
                <span>Datos de la empresa</span>
              </TabsTrigger>
              <TabsTrigger value="tasas" className="flex items-center gap-1.5">
                <Percent className="size-4" />
                <span>Tasas / Impuestos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="datos" className="space-y-4">
              <div className="grid grid-cols-6 gap-4">
                {/* ID */}
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="id">ID de la Empresa</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    disabled
                    className="bg-muted font-mono"
                  />
                </div>

                {/* Tipo de Contribuyente */}
                <div className="col-span-4 space-y-1.5">
                  <Label htmlFor="tipoContribuyente">Tipo de Contribuyente</Label>
                  <Select
                    value={formData.tipoContribuyente}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="tipoContribuyente" className="w-full h-9">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Especial">Especial</SelectItem>
                      <SelectItem value="Ordinario">Ordinario</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="No Sujeto">No Sujeto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* RIF */}
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="rif">RIF</Label>
                  <Input
                    id="rif"
                    name="rif"
                    value={formData.rif}
                    onChange={handleChange}
                    placeholder="J-00000000-0"
                    required
                  />
                </div>

                {/* % ITF */}
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="itf">% ITF</Label>
                  <Input
                    id="itf"
                    name="itf"
                    value={formData.itf}
                    onChange={handleChange}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Fecha */}
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Nombre / Razón Social */}
                <div className="col-span-6 space-y-1.5">
                  <Label htmlFor="nombre">Nombre / Razón Social</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre legal de la empresa"
                    required
                  />
                </div>

                {/* Domicilio Fiscal */}
                <div className="col-span-6 space-y-1.5">
                  <Label>Domicilio Fiscal</Label>
                  <div className="space-y-2">
                    <Input
                      name="domicilio1"
                      value={formData.domicilio1}
                      onChange={handleChange}
                      placeholder="Calle, avenida, edificio, local..."
                      required
                    />
                    <Input
                      name="domicilio2"
                      value={formData.domicilio2}
                      onChange={handleChange}
                      placeholder="Urbanización, sector, zona..."
                    />
                    <Input
                      name="domicilio3"
                      value={formData.domicilio3}
                      onChange={handleChange}
                      placeholder="Estado, ciudad, código postal..."
                    />
                  </div>
                </div>

                {/* Telefonos */}
                <div className="col-span-6 space-y-1.5">
                  <Label>Teléfonos de Contacto</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      name="telefono1"
                      value={formData.telefono1}
                      onChange={handleChange}
                      placeholder="Teléfono principal"
                      required
                    />
                    <Input
                      name="telefono2"
                      value={formData.telefono2}
                      onChange={handleChange}
                      placeholder="Teléfono secundario"
                    />
                    <Input
                      name="telefono3"
                      value={formData.telefono3}
                      onChange={handleChange}
                      placeholder="Teléfono adicional"
                    />
                  </div>
                </div>

                {/* E-mail (Para Respaldos) */}
                <div className="col-span-3 space-y-1.5">
                  <Label htmlFor="email">E-mail (Para Respaldos)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@empresa.com"
                    required
                  />
                </div>

                {/* WhatsApp Empresa */}
                <div className="col-span-3 space-y-1.5">
                  <Label htmlFor="whatsapp">WhatsApp Empresa</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Número con WhatsApp"
                  />
                </div>

                {/* Período Fiscal */}
                <div className="col-span-6 border-t pt-3 mt-1">
                  <h4 className="text-sm font-semibold mb-2">Período Fiscal</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <DatePickerDemo
                        id="fiscalInicio"
                        label="Fecha Inicio"
                        placeholder="Seleccione fecha de inicio"
                        className="flex w-full flex-col gap-1.5"
                        value={parseFromYYYYMMDD(formData.fiscalInicio)}
                        onChange={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            fiscalInicio: formatToYYYYMMDD(date),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <DatePickerDemo
                        id="fiscalCierre"
                        label="Fecha Cierre"
                        placeholder="Seleccione fecha de cierre"
                        className="flex w-full flex-col gap-1.5"
                        value={parseFromYYYYMMDD(formData.fiscalCierre)}
                        onChange={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            fiscalCierre: formatToYYYYMMDD(date),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasas" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ivaGeneral">IVA General (%)</Label>
                  <Input
                    id="ivaGeneral"
                    name="ivaGeneral"
                    type="number"
                    step="0.01"
                    value={formData.ivaGeneral}
                    onChange={handleChange}
                    placeholder="16.00"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ivaReducido">IVA Reducido (%)</Label>
                  <Input
                    id="ivaReducido"
                    name="ivaReducido"
                    type="number"
                    step="0.01"
                    value={formData.ivaReducido}
                    onChange={handleChange}
                    placeholder="8.00"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ivaAdicional">IVA Adicional / Lujo (%)</Label>
                  <Input
                    id="ivaAdicional"
                    name="ivaAdicional"
                    type="number"
                    step="0.01"
                    value={formData.ivaAdicional}
                    onChange={handleChange}
                    placeholder="15.00"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="igtf">IGTF (%)</Label>
                  <Input
                    id="igtf"
                    name="igtf"
                    type="number"
                    step="0.01"
                    value={formData.igtf}
                    onChange={handleChange}
                    placeholder="3.00"
                    required
                  />
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground mt-4 leading-relaxed">
                <p className="font-semibold mb-1">Nota sobre Tasas e Impuestos:</p>
                Estas alícuotas se aplican de forma automática en los módulos de Compras, Ventas y Facturación para el cálculo de débitos/créditos fiscales y retenciones según la legislación vigente de contribuyentes especiales.
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="border-t pt-3 gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-1.5"
            >
              <X className="size-4 text-destructive" />
              <span>CANCELAR</span>
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              <Check className="size-4" />
              <span>ACEPTAR</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
