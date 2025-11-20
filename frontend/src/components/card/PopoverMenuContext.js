import { createContext, useContext } from "react";

export const PopoverMenuContext = createContext(null);

export function usePopoverMenuContext() {
  const context = useContext(PopoverMenuContext);
  if (!context) {
    throw new Error(
      "usePopoverMenuContext must be used within PopoverMenuProvider"
    );
  }
  return context;
}
