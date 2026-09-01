import { useContext } from "react";
import { DataContext, type DataContextValue } from "../contexts/DataContext";

export function useAppData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData deve ser usado dentro de <DataProvider>");
  return ctx;
}
