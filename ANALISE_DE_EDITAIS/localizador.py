"""
Localizador de Trechos

Antes de acionar a IA, localizamos os trechos do documento onde cada
campo difícil provavelmente aparece. Isso evita mandar o edital inteiro
pra IA (mais caro, mais lento, mais chance de erro) e ajuda o modelo a
focar exatamente no lugar certo.

A busca aqui é só por palavras-chave — não precisa ser perfeita, só
precisa "chegar perto" o suficiente pra IA entender o contexto.
"""

import re


class LocalizadorTrechos:
    """Localiza, no texto completo do edital, os trechos relevantes por campo."""

    def __init__(self, texto_completo: str):
        self.texto = texto_completo

    def trecho_orgao(self, tamanho: int = 1500) -> str:
        """
        Órgão/Cidade/Estado costumam aparecer perto do início
        ("... torna público que fará realizar...") e de novo na
        assinatura de quem elaborou o Termo de Referência/ETP.
        """
        partes = []

        inicio = self.texto.find("torna público")
        if inicio != -1:
            partes.append(self.texto[max(0, inicio - 200): inicio + tamanho])

        for match in re.finditer(r"(Secretaria|Prefeitura|Município)[^\n]{0,120}", self.texto):
            partes.append(match.group(0))

        return "\n---\n".join(partes[:6]) if partes else self.texto[:tamanho]

    def trecho_quantitativo(self, tamanho: int = 3000) -> str:
        # Do mais específico pro mais genérico: "QUANTITATIVO" sozinho
        # aparece cedo no documento como palavra solta (ex: "aditamento do
        # quantitativo"), o que pegaria o trecho errado. Âncoras com mais
        # palavras (título de seção/anexo) têm muito menos chance de dar
        # falso positivo.
        for rotulo in [
            "ANEXO II DO TERMO DE REFERÊNCIA",
            "CATEGORIA, QUANTITATIVO",
            "postos de trabalho",
            "QUANTITATIVO",
        ]:
            pos = self.texto.upper().find(rotulo.upper())
            if pos != -1:
                return self.texto[pos: pos + tamanho]
        return ""

    def trecho_valor_estimado(self, tamanho: int = 3000) -> str:
        for rotulo in ["ESTIMATIVA DE VALORES", "VALOR TOTAL", "VALOR ESTIMADO"]:
            pos = self.texto.upper().find(rotulo.upper())
            if pos != -1:
                return self.texto[pos: pos + tamanho]
        return ""


if __name__ == "__main__":
    import sys

    from leitor_pdf import LeitorPDF

    caminho = sys.argv[1] if len(sys.argv) > 1 else "edital.pdf"

    leitor = LeitorPDF(caminho)
    leitor.extrair()

    loc = LocalizadorTrechos(leitor.texto_completo)

    print("=== TRECHO ÓRGÃO (primeiros 600 chars) ===")
    print(loc.trecho_orgao()[:600])
    print("\n=== TRECHO QUANTITATIVO (primeiros 600 chars) ===")
    print(loc.trecho_quantitativo()[:600])
    print("\n=== TRECHO VALOR ESTIMADO (primeiros 600 chars) ===")
    print(loc.trecho_valor_estimado()[:600])
