"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
  activeModule,
  onSelectModule,
}: {
  items: {
    title: string
    value: string
    icon?: React.ReactNode
    items?: {
      title: string
      value: string
      isHeader?: boolean
    }[]
    subGroups?: {
      title: string
      value: string
      items: {
        title: string
        value: string
        isHeader?: boolean
      }[]
    }[]
  }[]
  activeModule: string
  onSelectModule: (value: string) => void
}) {
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({
    configuracion: true, // Default open configuration
    inventario: false,
  })

  // Accordion: only one subgroup open at a time (null = all closed)
  const [openSubGroup, setOpenSubGroup] = React.useState<string | null>(null)

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [hoveredSubGroupIndex, setHoveredSubGroupIndex] = React.useState<Record<string, number | null>>({})

  const [caretY, setCaretY] = React.useState<{
    activeY: number
    activeHeight: number
    hoveredY: number
    hoveredHeight: number
  }>({ activeY: -1, activeHeight: 28, hoveredY: -1, hoveredHeight: 28 })

  const containerRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  const measureCaret = React.useCallback(() => {
    if (!openSubGroup) return
    const container = containerRefs.current[openSubGroup]
    if (!container) return
    const activeEl = container.querySelector('[data-active-item="true"]') as HTMLElement | null
    const hoveredEl = container.querySelector('[data-hovered-item="true"]') as HTMLElement | null
    setCaretY({
      activeY: activeEl ? activeEl.offsetTop : -1,
      activeHeight: activeEl ? activeEl.offsetHeight : 28,
      hoveredY: hoveredEl ? hoveredEl.offsetTop : -1,
      hoveredHeight: hoveredEl ? hoveredEl.offsetHeight : 28,
    })
  }, [openSubGroup])

  React.useEffect(() => {
    measureCaret()
  }, [measureCaret, activeModule, hoveredSubGroupIndex])

  React.useEffect(() => {
    window.addEventListener("resize", measureCaret)
    return () => window.removeEventListener("resize", measureCaret)
  }, [measureCaret])

  const toggleExpanded = (value: string) => {
    setExpandedItems((prev) => {
      const isNowExpanded = !prev[value]
      if (!isNowExpanded) {
        setOpenSubGroup(null)
      }
      return {
        ...prev,
        [value]: isNowExpanded,
      }
    })
  }

  const toggleSubGroup = (value: string) => {
    setOpenSubGroup((prev) => (prev === value ? null : value))
  }

  // Auto-expand parent and the matching subgroup when navigating directly
  React.useEffect(() => {
    items.forEach((item) => {
      if (item.subGroups) {
        item.subGroups.forEach((subGroup) => {
          const hasActiveItem = subGroup.items.some((sub) => sub.value === activeModule)
          if (hasActiveItem) {
            setExpandedItems((prev) => ({ ...prev, [item.value]: true }))
            setOpenSubGroup(subGroup.value)
          }
        })
      }
    })
  }, [activeModule, items])

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const hasSubItems = !!item.items || !!item.subGroups
            const isSelected =
              activeModule === item.value ||
              (item.items && item.items.some((sub) => sub.value === activeModule)) ||
              (item.subGroups && item.subGroups.some((group) => group.items.some((sub) => sub.value === activeModule)))
            const isExpanded = !!expandedItems[item.value]

            const activeIndex = item.items?.findIndex((sub) => sub.value === activeModule) ?? -1
            const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex

            if (hasSubItems) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    onClick={() => toggleExpanded(item.value)}
                    isActive={isSelected}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    <span className="ml-auto">
                      <ChevronDown 
                        className={cn(
                          "size-4 transition-transform duration-200",
                          isExpanded ? "rotate-0" : "-rotate-90"
                        )} 
                      />
                    </span>
                  </SidebarMenuButton>
                  <div 
                    className={cn(
                      "grid transition-all duration-200 ease-in-out",
                      isExpanded ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    )}
                  >
                    <div className="overflow-hidden">
                      <SidebarMenuSub className="relative !border-l-0 !pl-6">
                        {item.value !== "inventario" && item.items && (
                          <svg
                            className="absolute -left-0.5 top-0 pointer-events-none"
                            style={{
                              width: "32px",
                              height: "100%",
                            }}
                          >
                            <defs>
                              <filter id="sharpie" x="-20%" y="-20%" width="140%" height="140%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                                <feGaussianBlur in="displaced" stdDeviation="0.3" result="blur" />
                                <feMerge>
                                  <feMergeNode in="blur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                              <style>{`
                                @keyframes drawLine {
                                  from { stroke-dashoffset: 16; }
                                  to { stroke-dashoffset: 0; }
                                }
                                @keyframes drawCaret {
                                  from { stroke-dashoffset: 15; }
                                  to { stroke-dashoffset: 0; }
                                }
                              `}</style>
                            </defs>
                            <line
                              x1="2"
                              y1="0"
                              x2="2"
                              y2="100%"
                              stroke="var(--sidebar-border)"
                              strokeWidth="1"
                            />
                            {activeIndex !== -1 && (
                              <g filter="url(#sharpie)">
                                <path
                                  d={`M 2.2 0 L 2.0 ${(16 + activeIndex * 32) / 2} L 1.8 ${(16 + activeIndex * 32) - 8} C 1.8 ${(16 + activeIndex * 32) - 4}, 3.0 ${(16 + activeIndex * 32) - 0.8}, 9.5 ${(16 + activeIndex * 32) - 0.3} L 17.5 ${(16 + activeIndex * 32) + 0.2}`}
                                  fill="none"
                                  stroke="var(--primary)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="transition-all duration-300 ease-in-out"
                                />
                                <path
                                  d={`M 16.8 ${(16 + activeIndex * 32) - 4.5} L 22.8 ${(16 + activeIndex * 32) + 0.2} L 17.5 ${(16 + activeIndex * 32) + 4.2}`}
                                  fill="none"
                                  stroke="var(--primary)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="transition-all duration-300 ease-in-out"
                                />
                              </g>
                            )}
                            {hoveredIndex !== null && hoveredIndex !== activeIndex && (
                              <g filter="url(#sharpie)" className="opacity-70">
                                <path
                                  d={`M 2.2 ${16 + hoveredIndex * 32} L 17.5 ${16 + hoveredIndex * 32}`}
                                  fill="none"
                                  stroke="var(--primary)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeDasharray="16"
                                  strokeDashoffset="16"
                                  style={{
                                    animation: "drawLine 0.15s ease-out forwards",
                                  }}
                                />
                                <path
                                  d={`M 16.8 ${(16 + hoveredIndex * 32) - 4.5} L 22.8 ${(16 + hoveredIndex * 32) + 0.2} L 17.5 ${(16 + hoveredIndex * 32) + 4.2}`}
                                  fill="none"
                                  stroke="var(--primary)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeDasharray="15"
                                  strokeDashoffset="15"
                                  style={{
                                    animation: "drawCaret 0.15s ease-out 0.12s forwards",
                                  }}
                                />
                              </g>
                            )}
                          </svg>
                        )}

                        {/* Rendering Flat Subitems */}
                        {item.items?.map((subItem, subIdx) => {
                          if (subItem.isHeader) {
                            return (
                              <div
                                key={subItem.title}
                                className="text-[10px] font-bold text-muted-foreground/60 tracking-wider px-2 py-1.5 mt-2 border-t border-sidebar-border/30 first:border-t-0 first:mt-0 select-none cursor-default"
                              >
                                {subItem.title}
                              </div>
                            )
                          }
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                onClick={() => onSelectModule(subItem.value)}
                                isActive={activeModule === subItem.value}
                                onMouseEnter={() => setHoveredIndex(subIdx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}

                        {/* Rendering Expandable Subgroups (e.g. Fichero, Transacciones, etc.) */}
                        {item.subGroups?.map((group) => {
                          const isGroupExpanded = openSubGroup === group.value
                          const isGroupActive = group.items.some((sub) => sub.value === activeModule)
                          const groupActiveIndex = group.items.findIndex((sub) => sub.value === activeModule)
                          const groupHoveredIndex = hoveredSubGroupIndex[group.value] ?? null
                          const activeY = groupActiveIndex !== -1 ? 14 + groupActiveIndex * 30 : 0
                          const hoveredY = groupHoveredIndex !== null ? 14 + groupHoveredIndex * 30 : 0

                          return (
                            <div key={group.value} className="flex flex-col gap-0.5 mb-1.5 last:mb-0">
                              <button
                                type="button"
                                onClick={() => toggleSubGroup(group.value)}
                                className={cn(
                                  "flex w-full items-center gap-1.5 rounded-md py-1 px-2 text-xs font-semibold tracking-wide text-muted-foreground/80 hover:bg-muted/40 hover:text-foreground transition-all text-left cursor-pointer",
                                  isGroupActive && "text-primary font-bold"
                                )}
                              >
                                <ChevronDown 
                                  className={cn(
                                    "size-3 transition-transform duration-200 shrink-0",
                                    isGroupExpanded ? "rotate-0" : "-rotate-90"
                                  )} 
                                />
                                <span className="relative inline-block uppercase pb-0.5">
                                  {group.title}
                                  {/* Sharpie thin underline when expanded */}
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 100 6"
                                    preserveAspectRatio="none"
                                    className={cn(
                                      "absolute left-0 -bottom-1 pointer-events-none transition-opacity duration-300",
                                      isGroupExpanded ? "opacity-100" : "opacity-0"
                                    )}
                                    style={{ width: "100%", height: "6px", overflow: "visible" }}
                                  >
                                    <defs>
                                      <filter id={`sharpie-ul-${group.value}`} x="-10%" y="-50%" width="120%" height="200%">
                                        <feTurbulence type="fractalNoise" baseFrequency="0.08 0.5" numOctaves="2" seed="5" result="noise" />
                                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                                      </filter>
                                    </defs>
                                    <path
                                      d="M 1 3 Q 25 1.5, 50 3.5 T 99 2.5"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      vectorEffect="non-scaling-stroke"
                                      filter={`url(#sharpie-ul-${group.value})`}
                                      style={{
                                        transition: "stroke-dashoffset 0.4s ease-out",
                                        strokeDasharray: 120,
                                        strokeDashoffset: isGroupExpanded ? 0 : 120,
                                      }}
                                    />
                                  </svg>
                                </span>
                              </button>
                              
                              <div
                                className={cn(
                                  "grid transition-all duration-200 ease-in-out mt-0.5",
                                  isGroupExpanded ? "grid-rows-[1fr] opacity-100 mb-1" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                                )}
                              >
                                <div
                                  className="overflow-hidden relative"
                                  ref={(el) => { containerRefs.current[group.value] = el }}
                                >
                                  {/* Single full-height overlay SVG with caret drawn from top → active item */}
                                  <svg
                                    className="absolute left-0 top-0 pointer-events-none z-10"
                                    style={{ width: "36px", height: "100%", overflow: "visible" }}
                                  >
                                    <defs>
                                      <filter id={`sharpie-${group.value}`} x="-20%" y="-20%" width="140%" height="140%">
                                        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" />
                                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.0" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                                        <feGaussianBlur in="displaced" stdDeviation="0.3" result="blur" />
                                        <feMerge>
                                          <feMergeNode in="blur" />
                                          <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                      </filter>
                                      <style>{`
                                        @keyframes drawLine-${group.value} {
                                          from { stroke-dashoffset: 16; }
                                          to { stroke-dashoffset: 0; }
                                        }
                                        @keyframes drawCaret-${group.value} {
                                          from { stroke-dashoffset: 15; }
                                          to { stroke-dashoffset: 0; }
                                        }
                                      `}</style>
                                    </defs>
                                    {/* Vertical guide line */}
                                    <line
                                      x1="2" y1="0" x2="2" y2="100%"
                                      stroke="var(--sidebar-border)"
                                      strokeWidth="1"
                                    />
                                    {/* Active item caret - starts from top, curves to active item center */}
                                    {isGroupActive && caretY.activeY >= 0 && openSubGroup === group.value && (() => {
                                      const cy = caretY.activeY + caretY.activeHeight / 2
                                      return (
                                        <g filter={`url(#sharpie-${group.value})`}>
                                          <path
                                            d={`M 2.2 0 L 2.0 ${cy * 0.5} L 1.8 ${cy - 8} C 1.8 ${cy - 3}, 3.0 ${cy - 0.5}, 14 ${cy - 0.2} L 22 ${cy + 0.2}`}
                                            fill="none"
                                            stroke="var(--primary)"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="transition-all duration-300 ease-in-out"
                                          />
                                          <path
                                            d={`M 21 ${cy - 4.5} L 27 ${cy + 0.2} L 21.5 ${cy + 4.5}`}
                                            fill="none"
                                            stroke="var(--primary)"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="transition-all duration-300 ease-in-out"
                                          />
                                        </g>
                                      )
                                    })()}
                                    {/* Hover preview caret */}
                                    {groupHoveredIndex !== null && groupHoveredIndex !== groupActiveIndex && caretY.hoveredY >= 0 && openSubGroup === group.value && (() => {
                                      const cy = caretY.hoveredY + caretY.hoveredHeight / 2
                                      return (
                                        <g filter={`url(#sharpie-${group.value})`} className="opacity-60">
                                          <path
                                            d={`M 2.2 ${cy} L 22 ${cy}`}
                                            fill="none"
                                            stroke="var(--primary)"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="16"
                                            strokeDashoffset="16"
                                            style={{ animation: `drawLine-${group.value} 0.15s ease-out forwards` }}
                                          />
                                          <path
                                            d={`M 21 ${cy - 4.5} L 27 ${cy + 0.2} L 21.5 ${cy + 4.5}`}
                                            fill="none"
                                            stroke="var(--primary)"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="15"
                                            strokeDashoffset="15"
                                            style={{ animation: `drawCaret-${group.value} 0.15s ease-out 0.12s forwards` }}
                                          />
                                        </g>
                                      )
                                    })()}
                                  </svg>

                                  <div className="flex flex-col gap-0.5 pl-9">
                                    {group.items.map((subItem, subIdx) => {
                                      if (subItem.isHeader) {
                                        return (
                                          <div
                                            key={subItem.title}
                                            className="text-[9px] font-bold text-muted-foreground/60 tracking-wider px-2 py-1 mt-1.5 border-t border-sidebar-border/30 first:border-t-0 first:mt-0 select-none cursor-default uppercase"
                                          >
                                            {subItem.title}
                                          </div>
                                        )
                                      }

                                      const isActive = activeModule === subItem.value
                                      const isHovered = groupHoveredIndex === subIdx

                                      return (
                                        <SidebarMenuSubItem
                                          key={subItem.title}
                                          {...(isActive ? { "data-active-item": "true" } : {})}
                                          {...(isHovered ? { "data-hovered-item": "true" } : {})}
                                        >
                                          <SidebarMenuSubButton
                                            onClick={() => onSelectModule(subItem.value)}
                                            isActive={isActive}
                                            className="h-auto! min-h-7! py-1! text-xs! [&>span:last-child]:whitespace-normal! [&>span:last-child]:overflow-visible! [&>span:last-child]:text-left!"
                                            onMouseEnter={() =>
                                              setHoveredSubGroupIndex((prev) => ({ ...prev, [group.value]: subIdx }))
                                            }
                                            onMouseLeave={() =>
                                              setHoveredSubGroupIndex((prev) => ({ ...prev, [group.value]: null }))
                                            }
                                          >
                                            <span>{subItem.title}</span>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}

                      </SidebarMenuSub>
                    </div>
                  </div>
                </SidebarMenuItem>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title}
                  onClick={() => onSelectModule(item.value)}
                  isActive={activeModule === item.value}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
