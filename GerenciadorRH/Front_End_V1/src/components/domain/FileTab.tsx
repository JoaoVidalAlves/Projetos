import type { ReactNode } from "react";

/**
 * Elemento de assinatura visual do produto: um "carimbo" levemente rotacionado,
 * como se o card fosse uma ficha de papel arquivada. Usado no canto de cards
 * de vaga e candidato para reforçar o conceito de "dossiê/processo".
 */
export function FileTab({ className = "", children }: { className?: string; children: ReactNode }) {
  return <span className={`file-tab bg-white ${className}`}>{children}</span>;
}
