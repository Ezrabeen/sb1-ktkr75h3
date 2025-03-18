"use client"

import type React from "react"

import { useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastActionElement = React.ReactNode

export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: Omit<Toast, "id">
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<Toast> & Pick<Toast, "id">
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: Toast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [{ id: generateId(), ...action.toast }, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                }
              : t,
          ),
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
        })),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

export function useToast() {
  const [state, setState] = useState<State>({ toasts: [] })

  const dispatch = (action: Action) => {
    setState((prevState) => reducer(prevState, action))
  }

  const toast = (props: Omit<Toast, "id">) => {
    const id = generateId()

    const update = (props: Partial<Toast>) =>
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { ...props, id },
      })

    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

    dispatch({
      type: actionTypes.ADD_TOAST,
      toast: {
        ...props,
        id,
      },
    })

    return {
      id,
      dismiss,
      update,
    }
  }

  const dismissToast = (toastId?: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
  }

  const removeToast = (toastId?: string) => {
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId })
  }

  useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toastTimeouts.has(toast.id)) return

      const timeout = setTimeout(() => {
        removeToast(toast.id)
        toastTimeouts.delete(toast.id)
      }, TOAST_REMOVE_DELAY)

      toastTimeouts.set(toast.id, timeout)
    })

    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout))
      toastTimeouts.clear()
    }
  }, [state.toasts])

  return {
    toasts: state.toasts,
    toast,
    dismiss: dismissToast,
    remove: removeToast,
  }
}

