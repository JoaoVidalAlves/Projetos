#ifndef MODELOS_H
#define MODELOS_H

#define MAX_PRODUTOS 200
#define MAX_ITENS_CARRINHO 50
#define PESO_MAXIMO_CARRINHO 100.0

typedef struct {
    int codigo;
    char nome[60];
    char categoria[30];
    char tipoVenda[12]; /* unidade ou peso */
    double preco;
    double estoque;
    char unidade[12];
    double estoqueMinimo;
    double peso; /* kg por unidade; para itens por peso, use 1.0 */
} Produto;

typedef struct {
    int codigoProduto;
    char nome[60];
    char tipoVenda[12];
    char unidade[12];
    double preco;
    double quantidade;
    double pesoUnitario;
} ItemCarrinho;

typedef struct {
    ItemCarrinho itens[MAX_ITENS_CARRINHO];
    int quantidadeItens;
    int enviadoCaixa;
} Carrinho;

#endif
