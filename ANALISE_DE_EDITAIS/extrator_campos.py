"""
V2 - Extrator de Campos (regex)

Responsabilidade desta etapa: dado o texto já extraído pelo LeitorPDF,
localizar os campos que aparecem no bloco-resumo do início do edital
(formato "● CAMPO: valor") usando expressões regulares — sem IA.

Esse padrão de bloco-resumo é comum em editais que seguem uma minuta
padronizada (como os da Prefeitura de Belo Horizonte), mas não é
universal. Para editais de outros órgãos que não têm esse resumo,
esses métodos podem retornar vazio — nesse caso a extração via IA (V3)
assume o trabalho.
"""

import re


class ExtratorCamposFaceis:
    """Extrai Nº do edital, Objeto, Modo de disputa e Data/Horário da sessão."""

    MODOS_VALIDOS = {"aberto", "fechado", "aberto_fechado", "fechado_aberto"}

    def __init__(self, texto_completo: str):
        self.texto = texto_completo

    def _bloco_resumo(self) -> str:
        """Isola o trecho entre o primeiro '●' e o início do preâmbulo."""
        inicio = self.texto.find("●")
        if inicio == -1:
            return ""

        fim = self.texto.find("1. DO PREÂMBULO")
        if fim == -1:
            fim = inicio + 2000  # fallback: pega um trecho razoável

        return self.texto[inicio:fim]

    def _campo(self, rotulo: str) -> str:
        """
        Busca 'rotulo: valor' dentro do bloco-resumo, juntando linhas até
        o próximo '●' (o valor às vezes quebra em mais de uma linha).
        """
        bloco = self._bloco_resumo()
        padrao = rf"●\s*{rotulo}\s*:\s*(.*?)(?=●|\Z)"
        match = re.search(padrao, bloco, re.DOTALL | re.IGNORECASE)
        if not match:
            return ""

        valor = " ".join(match.group(1).split())  # normaliza espaços/quebras
        return valor.strip()

    def numero_edital(self) -> str:
        match = re.search(r"PREG[ÃA]O ELETR[ÔO]NICO N[ºo]\s*([\d./-]+)", self.texto, re.IGNORECASE)
        return match.group(1).strip() if match else ""

    def objeto(self) -> str:
        return self._campo("OBJETO")

    def modo_disputa_texto(self) -> str:
        return self._campo("MODO DE DISPUTA")

    def modo_disputa_normalizado(self) -> str:
        """Mapeia o texto livre para um dos 4 valores previstos na Lei 14.133/2021."""
        texto = self.modo_disputa_texto().lower()
        tem_aberto = "aberto" in texto
        tem_fechado = "fechado" in texto

        if tem_aberto and tem_fechado:
            return "aberto_fechado" if texto.find("aberto") < texto.find("fechado") else "fechado_aberto"
        if tem_aberto:
            return "aberto"
        if tem_fechado:
            return "fechado"
        return ""

    def data_disputa(self) -> str:
        texto = self._campo("DATA DA SESSÃO PÚBLICA")
        match = re.search(r"(\d{2}/\d{2}/\d{4})", texto)
        return match.group(1) if match else ""

    def horario_disputa(self) -> str:
        texto = self._campo("DATA DA SESSÃO PÚBLICA")
        match = re.search(r"(\d{1,2}h\d{0,2})", texto)
        return match.group(1) if match else ""

    def extrair_tudo(self) -> dict:
        return {
            "numero_edital": self.numero_edital(),
            "objeto": self.objeto(),
            "modo_disputa": self.modo_disputa_normalizado(),
            "modo_disputa_texto_original": self.modo_disputa_texto(),
            "data_disputa": self.data_disputa(),
            "horario_disputa": self.horario_disputa(),
        }


if __name__ == "__main__":
    import sys

    from leitor_pdf import LeitorPDF

    caminho = sys.argv[1] if len(sys.argv) > 1 else "edital.pdf"

    leitor = LeitorPDF(caminho)
    leitor.extrair()

    extrator = ExtratorCamposFaceis(leitor.texto_completo)
    dados = extrator.extrair_tudo()

    print("Campos extraídos por regex:")
    for campo, valor in dados.items():
        print(f"  {campo}: {valor}")
