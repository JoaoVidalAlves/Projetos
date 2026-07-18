#include <stdio.h>
#include <string.h>
#include "modelos.h"
#include "util.h"
#include "produto.h"
#include "carrinho.h"
#include "arquivos.h"

#define ARQUIVO_PRODUTOS "data/produtos.csv"

static void removerItemInterativo(Carrinho *carrinho, Produto produtos[], int total) {
    int codigo = lerInteiro("Codigo do produto: ");
    int opcao = lerInteiro("1. Remover todos\n2. Remover quantidade especifica\nOpcao: ");
    double quantidade = 0;
    if (opcao == 1) removerDoCarrinho(carrinho, produtos, total, codigo, 0, 1);
    else if (opcao == 2) {
        quantidade = lerDecimal("Quantidade a remover (unidade ou kg): ");
        removerDoCarrinho(carrinho, produtos, total, codigo, quantidade, 0);
    } else printf("Opcao invalida.\n");
}

static const char *escolherPagamento(void) {
    int opcao;
    do {
        opcao = lerInteiro("\nFORMA DE PAGAMENTO\n1. Debito\n2. Credito\n3. Dinheiro fisico\nOpcao: ");
        if (opcao == 1) return "Debito";
        if (opcao == 2) return "Credito";
        if (opcao == 3) return "Dinheiro fisico";
        printf("Opcao invalida.\n");
    } while (1);
}

static int menuComprador(Carrinho *carrinho, Produto produtos[], int total) {
    int opcao;
    do {
        limparTerminal();
        printf("--- COMPRADOR ---\nPeso maximo permitido: %.2f kg\n\n1. Ver produtos\n2. Adicionar ao carrinho\n3. Remover do carrinho\n4. Ver carrinho\n5. Enviar carrinho ao caixa\n0. Voltar\n", PESO_MAXIMO_CARRINHO);
        opcao = lerInteiro("Opcao: ");
        if (opcao == 1) listarProdutos(produtos, total);
        else if (opcao == 2) {
            listarProdutos(produtos, total);
            int codigo = lerInteiro("Codigo: ");
            double quantidade = lerDecimal("Quantidade (unidade ou kg): ");
            if (adicionarAoCarrinho(carrinho, produtos, total, codigo, quantidade)) salvarProdutos(ARQUIVO_PRODUTOS, produtos, total);
        } else if (opcao == 3) {
            mostrarCarrinho(carrinho);
            removerItemInterativo(carrinho, produtos, total);
            salvarProdutos(ARQUIVO_PRODUTOS, produtos, total);
        } else if (opcao == 4) mostrarCarrinho(carrinho);
        else if (opcao == 5) {
            if (carrinho->quantidadeItens == 0) printf("Nao e possivel enviar um carrinho vazio.\n");
            else { carrinho->enviadoCaixa = 1; return 1; }
        } else if (opcao != 0) printf("Opcao invalida.\n");
        if (opcao != 0) pausar();
    } while (opcao != 0);
    return 0;
}

static void cancelarCarrinho(Carrinho *carrinho, Produto produtos[], int total) {
    while (carrinho->quantidadeItens > 0)
        removerDoCarrinho(carrinho, produtos, total, carrinho->itens[0].codigoProduto, 0, 1);
    inicializarCarrinho(carrinho);
    salvarProdutos(ARQUIVO_PRODUTOS, produtos, total);
    printf("Carrinho cancelado e estoque devolvido.\n");
}

static void menuVendedor(Carrinho *carrinho, Produto produtos[], int *total) {
    int opcao;
    do {
        limparTerminal();
        printf("--- VENDEDOR / CAIXA ---\n\n1. Abrir carrinho\n2. Remover item do carrinho\n3. Finalizar venda e emitir comprovante\n4. Cancelar carrinho\n0. Voltar\n");
        opcao = lerInteiro("Opcao: ");
        if (opcao == 1) {
            if (!carrinho->enviadoCaixa) printf("Nao ha carrinho enviado ao caixa.\n"); else mostrarCarrinho(carrinho);
        } else if (opcao == 2) {
            mostrarCarrinho(carrinho);
            if (!carrinho->enviadoCaixa) printf("Nao ha carrinho enviado ao caixa.\n");
            else { removerItemInterativo(carrinho, produtos, *total); salvarProdutos(ARQUIVO_PRODUTOS, produtos, *total); }
        } else if (opcao == 3) {
            if (!carrinho->enviadoCaixa) printf("O comprador ainda nao enviou o carrinho.\n");
            else if (carrinho->quantidadeItens == 0) printf("Carrinho vazio.\n");
            else if (finalizarVenda(carrinho, produtos, *total, escolherPagamento())) {
                salvarProdutos(ARQUIVO_PRODUTOS, produtos, *total);
                inicializarCarrinho(carrinho);
            }
        } else if (opcao == 4) {
            if (!carrinho->enviadoCaixa) printf("Nao ha carrinho enviado ao caixa.\n"); else cancelarCarrinho(carrinho, produtos, *total);
        } else if (opcao != 0) printf("Opcao invalida.\n");
        if (opcao != 0) pausar();
    } while (opcao != 0);
}

static void menuAdministrador(Produto produtos[], int *total) {
    int opcao;
    do {
        limparTerminal();
        printf("--- ADMINISTRADOR ---\n\n1. Listar produtos\n2. Consultar detalhes de produto\n3. Cadastrar produto\n4. Editar produto\n5. Remover produto\n6. Reabastecer estoque\n7. Ajustar inventario (valor absoluto)\n8. Exportar estoque .txt\n9. Ver estoque baixo\n10. Consultar vendas\n11. Ver resumo do estoque\n0. Voltar\n");
        opcao = lerInteiro("Opcao: ");
        if (opcao == 1) listarProdutos(produtos, *total);
        else if (opcao == 2) { listarProdutos(produtos, *total); exibirDetalhesProduto(produtos, *total);}
        else if (opcao == 3) { cadastrarProduto(produtos, total); salvarProdutos(ARQUIVO_PRODUTOS, produtos, *total); }
        else if (opcao == 4) { listarProdutos(produtos, *total); editarProduto(produtos, *total); salvarProdutos(ARQUIVO_PRODUTOS, produtos, *total); }
        else if (opcao == 5) { listarProdutos(produtos, *total); removerProduto(produtos, total); salvarProdutos(ARQUIVO_PRODUTOS, produtos, *total); }
        else if (opcao == 6) { listarProdutos(produtos, *total); reabastecerProduto(produtos, *total); salvarProdutos(ARQUIVO_PRODUTOS, produtos, *total); }
        else if (opcao == 7) { listarProdutos(produtos, *total); ajustarEstoqueProduto(produtos, *total); salvarProdutos(ARQUIVO_PRODUTOS, produtos, *total); }
        else if (opcao == 8) {
            if (exportarEstoqueTxt("relatorios/estoque_disponivel.txt", produtos, *total)) printf("Arquivo gerado em relatorios/estoque_disponivel.txt\n");
            else printf("Erro ao gerar relatorio.\n");
        } else if (opcao == 9) listarEstoqueBaixo(produtos, *total);
        else if (opcao == 10) consultarVendas("data/vendas.txt");
        else if (opcao == 11) exibirResumoEstoque(produtos, *total);
        else if (opcao != 0) printf("Opcao invalida.\n");
        if (opcao != 0) pausar();
    } while (opcao != 0);
}

int main(void) {
    Produto produtos[MAX_PRODUTOS];
    Carrinho carrinho;
    int total = carregarProdutos(ARQUIVO_PRODUTOS, produtos, MAX_PRODUTOS);
    int perfil;
    if (total == 0) { printf("Erro: nao foi possivel carregar data/produtos.csv\n"); return 1; }
    inicializarCarrinho(&carrinho);
    do {
        limparTerminal();
        printf("================================\n SISTEMA DE SUPERMERCADO\n================================\n1. Comprador\n2. Vendedor / Caixa\n3. Administrador\n0. Sair\n");
        perfil = lerInteiro("Selecione o perfil: ");
        if (perfil == 1) {
            if (menuComprador(&carrinho, produtos, total)) { limparTerminal(); menuVendedor(&carrinho, produtos, &total); }
        } else if (perfil == 2) menuVendedor(&carrinho, produtos, &total);
        else if (perfil == 3) menuAdministrador(produtos, &total);
        else if (perfil != 0) { printf("Opcao invalida.\n"); pausar(); }
    } while (perfil != 0);
    limparTerminal();
    printf("Sistema encerrado.\n");
    return 0;
}
