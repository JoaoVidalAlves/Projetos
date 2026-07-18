#ifndef CARRINHO_H
#define CARRINHO_H

#include "modelos.h"

void inicializarCarrinho(Carrinho *carrinho);
double totalCarrinho(const Carrinho *carrinho);
double pesoTotalCarrinho(const Carrinho *carrinho);
void mostrarCarrinho(const Carrinho *carrinho);
int adicionarAoCarrinho(Carrinho *carrinho, Produto produtos[], int total, int codigo, double quantidade);
int removerDoCarrinho(Carrinho *carrinho, Produto produtos[], int total, int codigo, double quantidade, int removerTudo);

#endif
