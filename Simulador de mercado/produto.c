#include <stdio.h>
#include <string.h>
#include "produto.h"
#include "util.h"

int buscarProdutoPorCodigo(Produto produtos[], int total, int codigo) {
    for (int i = 0; i < total; i++) if (produtos[i].codigo == codigo) return i;
    return -1;
}

void listarProdutos(const Produto produtos[], int total) {
    printf("\n%-6s %-26s %-10s %9s %12s %9s\n", "COD", "PRODUTO", "TIPO", "PRECO", "ESTOQUE", "PESO KG");
    printf("--------------------------------------------------------------------------------\n");
    for (int i = 0; i < total; i++)
        printf("%-6d %-26.26s %-10s R$ %6.2f %7.2f %-4s %8.3f\n", produtos[i].codigo,
               produtos[i].nome, produtos[i].tipoVenda, produtos[i].preco,
               produtos[i].estoque, produtos[i].unidade, produtos[i].peso);
}

void cadastrarProduto(Produto produtos[], int *total) {
    Produto novo;
    if (*total >= MAX_PRODUTOS) { printf("Limite de produtos atingido.\n"); return; }
    novo.codigo = lerInteiro("Codigo: ");
    if (buscarProdutoPorCodigo(produtos, *total, novo.codigo) != -1) { printf("Codigo ja cadastrado.\n"); return; }
    lerTexto("Nome: ", novo.nome, sizeof(novo.nome));
    lerTexto("Categoria: ", novo.categoria, sizeof(novo.categoria));
    do { lerTexto("Tipo (unidade/peso): ", novo.tipoVenda, sizeof(novo.tipoVenda)); }
    while (strcmp(novo.tipoVenda, "unidade") != 0 && strcmp(novo.tipoVenda, "peso") != 0 && printf("Use unidade ou peso.\n"));
    novo.preco = lerDecimal("Preco (por unidade ou kg): R$ ");
    novo.estoque = lerDecimal("Estoque inicial: ");
    lerTexto("Unidade (ex.: pacote, kg): ", novo.unidade, sizeof(novo.unidade));
    novo.estoqueMinimo = lerDecimal("Estoque minimo: ");
    novo.peso = lerDecimal("Peso em kg por unidade (para item por peso, informe 1): ");
    if (novo.peso <= 0) { printf("Peso deve ser positivo. Cadastro cancelado.\n"); return; }
    produtos[(*total)++] = novo;
    printf("Produto cadastrado.\n");
}

void editarProduto(Produto produtos[], int total) {
    int indice = buscarProdutoPorCodigo(produtos, total, lerInteiro("Codigo do produto: "));
    if (indice == -1) { printf("Produto nao encontrado.\n"); return; }
    lerTexto("Novo nome: ", produtos[indice].nome, sizeof(produtos[indice].nome));
    lerTexto("Nova categoria: ", produtos[indice].categoria, sizeof(produtos[indice].categoria));
    produtos[indice].preco = lerDecimal("Novo preco: R$ ");
    produtos[indice].estoqueMinimo = lerDecimal("Novo estoque minimo: ");
    produtos[indice].peso = lerDecimal("Novo peso em kg por unidade: ");
    if (produtos[indice].peso <= 0) produtos[indice].peso = 1.0;
    printf("Produto atualizado.\n");
}

void removerProduto(Produto produtos[], int *total) {
    int indice = buscarProdutoPorCodigo(produtos, *total, lerInteiro("Codigo do produto: "));
    if (indice == -1) { printf("Produto nao encontrado.\n"); return; }
    for (int i = indice; i < *total - 1; i++) produtos[i] = produtos[i + 1];
    (*total)--;
    printf("Produto removido.\n");
}

void reabastecerProduto(Produto produtos[], int total) {
    int indice = buscarProdutoPorCodigo(produtos, total, lerInteiro("Codigo do produto: "));
    double qtd;
    if (indice == -1) { printf("Produto nao encontrado.\n"); return; }
    qtd = lerDecimal("Quantidade para adicionar: ");
    if (qtd <= 0) { printf("A quantidade deve ser positiva.\n"); return; }
    produtos[indice].estoque += qtd;
    printf("Estoque atualizado: %.2f %s\n", produtos[indice].estoque, produtos[indice].unidade);
}

void listarEstoqueBaixo(const Produto produtos[], int total) {
    int encontrou = 0;
    printf("\nProdutos com estoque baixo:\n");
    for (int i = 0; i < total; i++) {
        if (produtos[i].estoque <= produtos[i].estoqueMinimo) {
            printf("- %s: %.2f %s (minimo %.2f)\n", produtos[i].nome, produtos[i].estoque, produtos[i].unidade, produtos[i].estoqueMinimo);
            encontrou = 1;
        }
    }
    if (!encontrou) printf("Nenhum produto com estoque baixo.\n");
}

void exibirDetalhesProduto(const Produto produtos[], int total) {
    int indice = buscarProdutoPorCodigo((Produto *)produtos, total, lerInteiro("Codigo do produto: "));
    if (indice == -1) { printf("Produto nao encontrado.\n"); return; }
    const Produto *p = &produtos[indice];
    printf("\nCodigo: %d\nNome: %s\nCategoria: %s\nTipo: %s\nPreco: R$ %.2f\nEstoque: %.2f %s\nEstoque minimo: %.2f\nPeso por unidade: %.3f kg\n",
           p->codigo, p->nome, p->categoria, p->tipoVenda, p->preco, p->estoque, p->unidade, p->estoqueMinimo, p->peso);
}

void ajustarEstoqueProduto(Produto produtos[], int total) {
    int indice = buscarProdutoPorCodigo(produtos, total, lerInteiro("Codigo do produto: "));
    if (indice == -1) { printf("Produto nao encontrado.\n"); return; }
    double novoEstoque = lerDecimal("Novo valor absoluto do estoque: ");
    if (novoEstoque < 0) { printf("Estoque nao pode ser negativo.\n"); return; }
    produtos[indice].estoque = novoEstoque;
    printf("Inventario ajustado com sucesso.\n");
}

void exibirResumoEstoque(const Produto produtos[], int total) {
    double quantidade = 0, valor = 0, peso = 0;
    int baixo = 0;
    for (int i = 0; i < total; i++) {
        quantidade += produtos[i].estoque;
        valor += produtos[i].estoque * produtos[i].preco;
        peso += produtos[i].estoque * produtos[i].peso;
        if (produtos[i].estoque <= produtos[i].estoqueMinimo) baixo++;
    }
    printf("\nRESUMO DO ESTOQUE\nProdutos cadastrados: %d\nQuantidade total: %.2f\nPeso estimado: %.2f kg\nValor estimado: R$ %.2f\nItens em estoque baixo: %d\n",
           total, quantidade, peso, valor, baixo);
}
