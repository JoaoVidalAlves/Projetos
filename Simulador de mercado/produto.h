#ifndef PRODUTO_H
#define PRODUTO_H

#include "modelos.h"

int buscarProdutoPorCodigo(Produto produtos[], int total, int codigo);
void listarProdutos(const Produto produtos[], int total);
void cadastrarProduto(Produto produtos[], int *total);
void editarProduto(Produto produtos[], int total);
void removerProduto(Produto produtos[], int *total);
void reabastecerProduto(Produto produtos[], int total);
void listarEstoqueBaixo(const Produto produtos[], int total);
void exibirDetalhesProduto(const Produto produtos[], int total);
void ajustarEstoqueProduto(Produto produtos[], int total);
void exibirResumoEstoque(const Produto produtos[], int total);

#endif
