"use client";

import { usePathname } from "next/navigation";
import { useEffect, useCallback } from "react";

/**
 * ClickFeedbackProvider adds a subtle pulsation effect to links and buttons
 * when clicked, providing immediate feedback during slow network transitions.
 */
export function ClickFeedbackProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Clear all feedback states when navigating
  useEffect(() => {
    const activeElements = document.querySelectorAll('[data-clicking="true"]');
    activeElements.forEach((el) => {
      el.removeAttribute("data-clicking");
      el.removeAttribute("data-feedback-style");
    });
  }, [pathname]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Find the nearest interactive ancestor (button or link)
    const target = (e.target as HTMLElement).closest("button, a");
    
    if (target && target instanceof HTMLElement) {
      // Don't add feedback if it's already clicking or if it's disabled
      if (target.getAttribute("data-clicking") === "true") return;
      if (target instanceof HTMLButtonElement && target.disabled) return;
      
      // Skip modal close buttons (X buttons in top-right of modals/dialogs)
      if (target.getAttribute("aria-label") === "Close" || 
          target.closest('[role="dialog"], [role="alertdialog"], .fixed.inset-0')) {
        return;
      }
      
      // Determine variation based on component class or size
      const isLarge = target.classList.contains("px-6") || target.innerText.length > 10;
      target.setAttribute("data-clicking", "true");
      if (isLarge) {
        target.setAttribute("data-feedback-style", "ripple");
      }
      
      // Auto-clear after 3 seconds if navigation doesn't occur 
      // (Increased timeout for slow network)
      setTimeout(() => {
        target.removeAttribute("data-clicking");
        target.removeAttribute("data-feedback-style");
      }, 3000);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown, { capture: true });
    return () => {
      document.removeEventListener("mousedown", handleMouseDown, { capture: true });
    };
  }, [handleMouseDown]);

  return <>{children}</>;
}
