"use client"

import * as React from "react"

export function CustomCursor() {
  const cursorRef = React.useRef<HTMLDivElement>(null)
  const innerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      !cursorRef.current ||
      !innerRef.current
    )
      return

    const cursor = cursorRef.current
    const inner = innerRef.current
    let pointerX = 0
    let pointerY = 0
    let previousPointerX = 0
    let previousPointerY = 0
    let angle = 0 // current smoothed angle
    const cursorSize = 16 // smaller cursor

    // Apply base styles to outer wrapper (translates instantly)
    cursor.style.position = "fixed"
    cursor.style.left = `${-cursorSize / 2}px`
    cursor.style.top = "0px"
    cursor.style.width = `${cursorSize}px`
    cursor.style.height = `${cursorSize}px`
    cursor.style.zIndex = "2147483647"
    cursor.style.pointerEvents = "none"
    cursor.style.userSelect = "none"
    cursor.style.boxSizing = "border-box"
    cursor.style.transform = "translate3d(0px, 0px, 0)"
    cursor.style.transition = "opacity 150ms ease-out" // smooth toggle transition

    // Apply styles to inner container (rotates smoothly to avoid jitter)
    inner.style.width = "100%"
    inner.style.height = "100%"
    inner.style.transformOrigin = "50% 0%" // Rotate around the top center (the arrow tip)
    inner.style.transition = "transform 80ms ease-out"
    inner.style.transform = "rotate(0deg)"

    // Inject global stylesheet to control native cursor visibility
    const styleElement = document.createElement("style")
    styleElement.innerHTML = `
      * {
        cursor: none !important;
      }
      a, a *,
      button, button *,
      select, select *,
      input, input *,
      [role='button'], [role='button'] *,
      .cursor-pointer, .cursor-pointer *,
      .curzr-hover, .curzr-hover *,
      [style*="cursor: pointer"], [style*="cursor: pointer"] * {
        cursor: pointer !important;
      }
    `
    document.head.appendChild(styleElement)

    // Show custom cursor initially
    cursor.style.opacity = "1"

    const handleMouseMove = (event: MouseEvent) => {
      previousPointerX = pointerX
      previousPointerY = pointerY
      pointerX = event.clientX
      pointerY = event.clientY

      const dx = pointerX - previousPointerX
      const dy = pointerY - previousPointerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Translate the parent container instantly
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`

      // Detect if hovering over a clickable/interactive element
      let isPointer = false
      const target = event.target as HTMLElement | null
      if (target) {
        const computedStyle = window.getComputedStyle(target)
        if (
          computedStyle.cursor === "pointer" ||
          target.closest("a, button, select, input, [role='button'], .cursor-pointer, .curzr-hover")
        ) {
          isPointer = true
        }
      }

      if (isPointer) {
        cursor.style.opacity = "0"
      } else {
        cursor.style.opacity = "1"

        if (distance > 1.5) {
          // Calculate target angle using Math.atan2 (radians to degrees)
          const targetRad = Math.atan2(dy, dx)
          const targetDeg = targetRad * (180 / Math.PI) + 90 // +90 because SVG points up

          // Find the shortest angular distance to prevent wrap-around spin jumps
          let diff = (targetDeg - angle) % 360
          if (diff > 180) {
            diff -= 360
          } else if (diff < -180) {
            diff += 360
          }

          // Apply exponential smoothing (lerp) in JS to prevent sudden jumps
          angle += diff * 0.2
        }
      }

      // Rotate the inner container smoothly
      inner.style.transform = `rotate(${angle}deg)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      style={{ opacity: 0 }}
      className="pointer-events-none"
    >
      <div ref={innerRef} className="w-full h-full">
        {/* Arrow SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-full h-full"
        >
          <path
            d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z"
            fill="#FFFFFF"
          />
          <path
            d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z"
            fill="#111920"
          />
        </svg>
      </div>
    </div>
  )
}
