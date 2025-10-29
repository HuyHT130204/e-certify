"use client"

import type React from "react"
import type { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"

interface ModalProps {
  title?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  maxWidth?: string
  isOpen?: boolean
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, footer, maxWidth = "max-w-3xl", isOpen = true }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} border-border/50 bg-surface`}>
        {title && (
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text">{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="max-h-[75vh] overflow-auto py-4">{children}</div>
        {footer && <DialogFooter className="border-t border-border/50 pt-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
