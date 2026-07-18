#ifndef ARQUIVOS_H
#define ARQUIVOS_H

#include "modelos.h"

int carregarProdutos(const char *caminho, Produto produtos[], int maximo);
int salvarProdutos(const char *caminho, const Produto produtos[], int total);
int exportarEstoqueTxt(const char *caminho, const Produto produtos[], int total);
int finalizarVenda(const Carrinho *carrinho, Produto produtos[], int total, const char *pagamento);
void consultarVendas(const char *caminho);

#endif
