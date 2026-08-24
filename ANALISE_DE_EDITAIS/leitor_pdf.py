"""
V1 - Leitor de Editais

Responsabilidade única desta etapa: abrir um PDF de edital e extrair
o texto bruto de todas as páginas. Nada de IA ainda — só garantir que
conseguimos "ler" o documento de forma confiável.
"""

from pathlib import Path

import pdfplumber


class LeitorPDF:
    """Abre um PDF e extrai o texto de todas as páginas."""

    def __init__(self, caminho_pdf: str):
        self.caminho_pdf = Path(caminho_pdf)
        if not self.caminho_pdf.exists():
            raise FileNotFoundError(f"Arquivo não encontrado: {caminho_pdf}")

        self.texto_por_pagina: list[str] = []
        self.texto_completo: str = ""

    def extrair(self) -> str:
        """Extrai o texto de cada página e monta o texto completo."""
        with pdfplumber.open(self.caminho_pdf) as pdf:
            for pagina in pdf.pages:
                texto = pagina.extract_text() or ""
                self.texto_por_pagina.append(texto)

        self.texto_completo = "\n".join(self.texto_por_pagina)
        return self.texto_completo

    def salvar_txt(self, caminho_saida: str) -> None:
        """Salva o texto extraído em um arquivo .txt, para conferência."""
        Path(caminho_saida).write_text(self.texto_completo, encoding="utf-8")

    @property
    def total_paginas(self) -> int:
        return len(self.texto_por_pagina)

    @property
    def tem_texto_extraivel(self) -> bool:
        """
        Se a soma de caracteres extraídos for muito baixa, o PDF
        provavelmente é escaneado (imagem) e vai precisar de OCR
        em vez de extração direta de texto.
        """
        total_chars = sum(len(p) for p in self.texto_por_pagina)
        media_por_pagina = total_chars / max(self.total_paginas, 1)
        return media_por_pagina > 50  # limiar simples, ajustável


if __name__ == "__main__":
    import sys

    caminho = sys.argv[1] if len(sys.argv) > 1 else "edital.pdf"

    leitor = LeitorPDF(caminho)
    leitor.extrair()

    print(f"Páginas lidas: {leitor.total_paginas}")
    print(f"Tem texto extraível: {leitor.tem_texto_extraivel}")

    saida = "edital_texto.txt"
    leitor.salvar_txt(saida)
    print(f"Texto salvo em: {saida}")
