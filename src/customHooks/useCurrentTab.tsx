import { useContext } from "react";
import { CurrentTabContext } from "../context/CurrentTabContext";

export const useCurrentTab = () => {
  const context = useContext(CurrentTabContext);
  if (!context)
    throw new Error("useCurrentTab must be used within CurrentTabProvider");
  return context;
};
