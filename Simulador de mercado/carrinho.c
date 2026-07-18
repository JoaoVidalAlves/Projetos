#include <stdio.h>
#include <string.h>
#include "carrinho.h"
#include "produto.h"

static double pesoItem(const ItemCarrinho *item) {
    return item->quantidade * item->pesoUnitario;
}

void inicializarCarrinho(Carrinho *carrinho) {
    carrinho->quantidadeItens = 0;
    carrinho->enviadoCaixa = 0;
}

double totalCarrinho(const Carrinho *carrinho) {
    double total = 0;
    for (int i = 0; i < carrinho->quantidadeItens; i++)
        total += carrinho->itens[i].preco * carrinho->itens[i].quantidade;
    return total;
}

double pesoTotalCarrinho(const Carrinho *carrinho) {
    double total = 0;
    for (int i = 0; i < carrinho->quantidadeItens; i++) total += pesoItem(&carrinho->itens[i]);
    return total;
}

void mostrarCarrinho(const Carrinho *carrinho) {
    if (carrinho->quantidadeItens == 0) { printf("Carrinho vazio.\n"); return; }
    printf("\n%-6s %-24s %10s %10s %12s\n", "COD", "PRODUTO", "QTD", "PESO", "SUBTOTAL");
    printf("----------------------------------------------------------------------------\n");
    for (int i = 0; i < carrinho->quantidadeItens; i++) {
        const ItemCarrinho *item = &carrinho->itens[i];
        printf("%-6d %-24.24s %6.2f %-3s %7.2f kg R$ %8.2f\n", item->codigoProduto, item->nome,
               item->quantidade, item->unidade, pesoItem(item), item->preco * item->quantidade);
    }
    printf("\nPeso total: %.2f / %.2f kg\n", pesoTotalCarrinho(carrinho), PESO_MAXIMO_CARRINHO);
    printf("Total: R$ %.2f\n", totalCarrinho(carrinho));
}

int adicionarAoCarrinho(Carrinho *carrinho, Produto produtos[], int total, int codigo, double quantidade) {
    int indice = buscarProdutoPorCodigo(produtos, total, codigo);
    double pesoAdicionado;
    if (indice == -1) { printf("Produto nao encontrado.\n"); return 0; }
    if (quantidade <= 0) { printf("Quantidade invalida.\n"); return 0; }
    if (quantidade > produtos[indice].estoque) { printf("Estoque insuficiente. Disponivel: %.2f %s\n", produtos[indice].estoque, produtos[indice].unidade); return 0; }
    pesoAdicionado = quantidade * produtos[indice].peso;
    if (pesoTotalCarrinho(carrinho) + pesoAdicionado > PESO_MAXIMO_CARRINHO) {
        printf("Limite de peso excedido. Carrinho: %.2f kg; novo peso: %.2f kg; limite: %.2f kg.\n",
               pesoTotalCarrinho(carrinho), pesoAdicionado, PESO_MAXIMO_CARRINHO);
        return 0;
    }
    for (int i = 0; i < carrinho->quantidadeItens; i++) {
        ItemCarrinho *item = &carrinho->itens[i];
        if (item->codigoProduto == codigo) {
            item->quantidade += quantidade;
            produtos[indice].estoque -= quantidade;
            printf("Quantidade atualizada e estoque reservado.\n");
            return 1;
        }
    }
    if (carrinho->quantidadeItens >= MAX_ITENS_CARRINHO) { printf("Limite de itens atingido.\n"); return 0; }
    ItemCarrinho *novo = &carrinho->itens[carrinho->quantidadeItens++];
    novo->codigoProduto = produtos[indice].codigo;
    strcpy(novo->nome, produtos[indice].nome);
    strcpy(novo->tipoVenda, produtos[indice].tipoVenda);
    strcpy(novo->unidade, produtos[indice].unidade);
    novo->preco = produtos[indice].preco;
    novo->quantidade = quantidade;
    novo->pesoUnitario = produtos[indice].peso;
    produtos[indice].estoque -= quantidade;
    printf("Produto adicionado e estoque reservado.\n");
    return 1;
}

int removerDoCarrinho(Carrinho *carrinho, Produto produtos[], int total, int codigo, double quantidade, int removerTudo) {
    int indiceItem = -1, indiceProduto;
    for (int i = 0; i < carrinho->quantidadeItens; i++)
        if (carrinho->itens[i].codigoProduto == codigo) { indiceItem = i; break; }
    if (indiceItem == -1) { printf("Produto nao esta no carrinho.\n"); return 0; }
    ItemCarrinho *item = &carrinho->itens[indiceItem];
    if (removerTudo) quantidade = item->quantidade;
    if (quantidade <= 0 || quantidade > item->quantidade) { printf("Quantidade invalida. No carrinho: %.2f %s\n", item->quantidade, item->unidade); return 0; }
    indiceProduto = buscarProdutoPorCodigo(produtos, total, codigo);
    if (indiceProduto != -1) produtos[indiceProduto].estoque += quantidade;
    item->quantidade -= quantidade;
    if (item->quantidade == 0) {
        for (int i = indiceItem; i < carrinho->quantidadeItens - 1; i++) carrinho->itens[i] = carrinho->itens[i + 1];
        carrinho->quantidadeItens--;
    }
    printf("Item removido e estoque devolvido.\n");
    return 1;
}
