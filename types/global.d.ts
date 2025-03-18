interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isVeWorld?: boolean
    request: (request: { method: string; params?: any[] }) => Promise<any>
    on: (eventName: string, callback: (...args: any[]) => void) => void
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void
    removeAllListeners: (eventName: string) => void
  }
  vechain?: {
    thor?: {
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on: (eventName: string, callback: (...args: any[]) => void) => void
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void
      removeAllListeners: (eventName: string) => void
    }
  }
}

