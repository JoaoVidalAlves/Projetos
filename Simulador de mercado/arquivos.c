#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "arquivos.h"
#include "produto.h"
#include "carrinho.h"

int carregarProdutos(const char *caminho, Produto produtos[], int maximo) {
    FILE *arquivo = fopen(caminho, "r");
    char linha[300];
    int total = 0;
    if (!arquivo) return 0;
    fgets(linha, sizeof(linha), arquivo);
    while (total < maximo && fgets(linha, sizeof(linha), arquivo)) {
        Produto *p = &produtos[total];
        linha[strcspn(linha, "\r\n")] = '\0';
        if (sscanf(linha, "%d;%59[^;];%29[^;];%11[^;];%lf;%lf;%11[^;];%lf;%lf",
                   &p->codigo, p->nome, p->categoria, p->tipoVenda, &p->preco,
                   &p->estoque, p->unidade, &p->estoqueMinimo, &p->peso) == 9) total++;
    }
    fclose(arquivo);
    return total;
}

int salvarProdutos(const char *caminho, const Produto produtos[], int total) {
    FILE *arquivo = fopen(caminho, "w");
    if (!arquivo) return 0;
    fprintf(arquivo, "codigo;nome;categoria;tipo_venda;preco;estoque;unidade;estoque_minimo;peso_kg\n");
    for (int i = 0; i < total; i++)
        fprintf(arquivo, "%d;%s;%s;%s;%.2f;%.2f;%s;%.2f;%.3f\n", produtos[i].codigo, produtos[i].nome,
                produtos[i].categoria, produtos[i].tipoVenda, produtos[i].preco, produtos[i].estoque,
                produtos[i].unidade, produtos[i].estoqueMinimo, produtos[i].peso);
    fclose(arquivo);
    return 1;
}

int exportarEstoqueTxt(const char *caminho, const Produto produtos[], int total) {
    FILE *arquivo = fopen(caminho, "w");
    if (!arquivo) return 0;
    fprintf(arquivo, "RELATORIO DE ESTOQUE\n\n");
    for (int i = 0; i < total; i++)
        fprintf(arquivo, "%d | %s | %.2f %s | peso: %.3f kg | minimo: %.2f\n", produtos[i].codigo, produtos[i].nome,
                produtos[i].estoque, produtos[i].unidade, produtos[i].peso, produtos[i].estoqueMinimo);
    fclose(arquivo);
    return 1;
}

int finalizarVenda(const Carrinho *carrinho, Produto produtos[], int total, const char *pagamento) {
    FILE *vendas, *nota;
    time_t agora = time(NULL);
    struct tm *data = localtime(&agora);
    char dataTexto[32], notaNome[100];
    double valorTotal = totalCarrinho(carrinho);
    (void)produtos;
    (void)total;
    strftime(dataTexto, sizeof(dataTexto), "%d/%m/%Y %H:%M:%S", data);
    vendas = fopen("data/vendas.txt", "a");
    if (vendas) {
        fprintf(vendas, "Venda %ld | %s | Pagamento: %s | Total: R$ %.2f\n", (long)agora, dataTexto, pagamento, valorTotal);
        fclose(vendas);
    }
    snprintf(notaNome, sizeof(notaNome), "relatorios/comprovante_%ld.txt", (long)agora);
    nota = fopen(notaNome, "w");
    if (nota) {
        fprintf(nota, "SUPERMERCADO - COMPROVANTE\nData: %s\nPagamento: %s\n\n", dataTexto, pagamento);
        for (int i = 0; i < carrinho->quantidadeItens; i++)
            fprintf(nota, "%s - %.2f %s | peso total: %.2f kg | R$ %.2f = R$ %.2f\n", carrinho->itens[i].nome,
                    carrinho->itens[i].quantidade, carrinho->itens[i].unidade, carrinho->itens[i].preco,
                    carrinho->itens[i].quantidade * carrinho->itens[i].pesoUnitario,
                    carrinho->itens[i].quantidade * carrinho->itens[i].preco);
        fprintf(nota, "\nPESO TOTAL: %.2f kg\nTOTAL: R$ %.2f\n", pesoTotalCarrinho(carrinho), valorTotal);
        fclose(nota);
    }
    printf("Venda concluida. Comprovante emitido em %s\n", notaNome);
    return 1;
}

void consultarVendas(const char *caminho) {
    FILE *arquivo = fopen(caminho, "r");
    char linha[300];
    if (!arquivo) { printf("Nenhuma venda registrada.\n"); return; }
    printf("\nHISTORICO DE VENDAS\n");
    while (fgets(linha, sizeof(linha), arquivo)) printf("%s", linha);
    fclose(arquivo);
}
