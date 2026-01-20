"use client"

import type * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50",
        "data-[state=checked]:bg-[#26FF1B] data-[state=unchecked]:bg-[#555555]",
        className,
      )}
      style={{ width: 52, height: 28 }}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-white pointer-events-none block rounded-full ring-0 transition-transform"
        style={{
          width: 22,
          height: 22,
          transform: props.checked ? "translateX(26px)" : "translateX(3px)",
        }}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
