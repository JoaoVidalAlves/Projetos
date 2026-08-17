"""
V3 - Extrator via IA

Extrai, usando a API da Claude, os campos que NÃO têm um rótulo fixo no
edital: Órgão, Cidade, Estado, Quantitativo e Preço estimado total.
Os campos "fáceis" (Nº do edital, Objeto, Modo de disputa, Data/Horário)
continuam sendo resolvidos por regex no extrator_campos.py — não faz
sentido gastar chamada de IA em algo que regex já resolve de graça.

Usa "tool use" (function calling) em vez de simplesmente pedir "responda
em JSON": isso força a resposta a seguir exatamente o schema definido,
então não tem risco de a IA "conversar" antes do JSON ou inventar um
formato diferente.

Requer:
    pip install anthropic
    export ANTHROPIC_API_KEY="sua-chave-aqui"   (Linux/Mac)
    setx ANTHROPIC_API_KEY "sua-chave-aqui"      (Windows)
"""

import anthropic

from localizador import LocalizadorTrechos

# Haiku é rápido e barato, e essa tarefa é extração de campos bem
# definidos — não precisa de raciocínio complexo. Se algum edital vier
# com texto mais confuso/ambíguo e a extração sair ruim, troque para
# "claude-sonnet-5" (mais caro, mais preciso).
MODELO = "claude-haiku-4-5-20251001"

FERRAMENTA_EXTRACAO = {
    "name": "registrar_campos_edital",
    "description": "Registra os campos extraídos de um edital de licitação pública.",
    "input_schema": {
        "type": "object",
        "properties": {
            "orgao": {
                "type": "string",
                "description": "Nome do órgão público que publicou o edital",
            },
            "cidade": {
                "type": "string",
                "description": "Cidade-sede do órgão",
            },
            "estado": {
                "type": "string",
                "description": "Sigla do estado (UF), ex: MG",
            },
            "quantitativo_valor": {
                "type": "number",
                "description": "Quantidade total do objeto licitado (ex: nº de postos de trabalho, ou m²)",
            },
            "quantitativo_unidade": {
                "type": "string",
                "description": "Unidade do quantitativo, ex: 'postos de trabalho', 'm²', 'funcionários'",
            },
            "valor_estimado_total": {
                "type": "number",
                "description": "Valor total estimado do contrato em reais, apenas números (sem 'R$', sem separador de milhar)",
            },
            "prazo_contrato_meses": {
                "type": "integer",
                "description": "Prazo de vigência inicial do contrato, em meses",
            },
        },
        "required": ["orgao", "cidade", "estado"],
    },
}

PROMPT_BASE = """Abaixo estão trechos de um edital de licitação pública brasileira.
Extraia os campos pedidos pela ferramenta "registrar_campos_edital".

Se um campo não aparecer claramente nos trechos, deixe-o de fora da
resposta em vez de adivinhar um valor.

--- TRECHO SOBRE O ÓRGÃO/CIDADE/ESTADO ---
{trecho_orgao}

--- TRECHO SOBRE O QUANTITATIVO ---
{trecho_quantitativo}

--- TRECHO SOBRE O VALOR ESTIMADO ---
{trecho_valor}
"""


class ExtratorIA:
    """Chama a API da Claude para extrair os campos difíceis, com o texto já recortado."""

    def __init__(self, texto_completo: str, api_key: str | None = None):
        self.texto_completo = texto_completo
        # Se api_key=None, o SDK lê automaticamente de ANTHROPIC_API_KEY
        self.cliente = anthropic.Anthropic(api_key=api_key)

    def _montar_prompt(self) -> str:
        localizador = LocalizadorTrechos(self.texto_completo)
        return PROMPT_BASE.format(
            trecho_orgao=localizador.trecho_orgao(),
            trecho_quantitativo=localizador.trecho_quantitativo(),
            trecho_valor=localizador.trecho_valor_estimado(),
        )

    def extrair(self) -> dict:
        resposta = self.cliente.messages.create(
            model=MODELO,
            max_tokens=1024,
            tools=[FERRAMENTA_EXTRACAO],
            tool_choice={"type": "tool", "name": "registrar_campos_edital"},
            messages=[{"role": "user", "content": self._montar_prompt()}],
        )

        for bloco in resposta.content:
            if bloco.type == "tool_use":
                return bloco.input

        return {}


if __name__ == "__main__":
    import sys

    from leitor_pdf import LeitorPDF

    caminho = sys.argv[1] if len(sys.argv) > 1 else "edital.pdf"

    leitor = LeitorPDF(caminho)
    leitor.extrair()

    extrator = ExtratorIA(leitor.texto_completo)
    dados = extrator.extrair()

    print("Campos extraídos pela IA:")
    for campo, valor in dados.items():
        print(f"  {campo}: {valor}")
