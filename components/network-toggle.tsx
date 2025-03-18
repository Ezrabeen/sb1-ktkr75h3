"use client"

import { useNetwork } from "@/contexts/network-context"
import { Switch } from "@/components/ui/switch"
import { Beaker, AlertTriangle, WrenchIcon as WrenchScrewdriver } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function NetworkToggle() {
  const { network, setNetwork, isTestnetMaintenance, toggleTestnetMaintenance } = useNetwork()

  const handleToggle = () => {
    setNetwork(network === "demo" ? "testnet" : "demo")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="glass-card rounded-lg p-3 shadow-card">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <Beaker className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Demo</span>
            </div>

            <Switch checked={network === "testnet"} onCheckedChange={handleToggle} id="network-toggle" />

            <span className="text-sm font-medium ml-2">Testnet</span>

            {network === "testnet" && isTestnetMaintenance && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-2 text-amber-500">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm">Testnet is currently under maintenance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {network === "testnet" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WrenchScrewdriver className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">Maintenance Mode</span>
              </div>
              <Switch
                checked={isTestnetMaintenance}
                onCheckedChange={toggleTestnetMaintenance}
                id="maintenance-toggle"
              />
            </div>
          )}

          {network === "testnet" && isTestnetMaintenance && (
            <p className="text-xs text-amber-500">Maintenance in progress - Features disabled</p>
          )}
        </div>
      </div>
    </div>
  )
}

