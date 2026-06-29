#include <stdio.h>
#include <stdlib.h>
#include <locale.h>
#include "sistema.h"
#include "macros.h"

void iniciarSistema () 
{
    system("chcp 65001 > nul");
    setlocale(LC_ALL, "pt-BR");
}

void limparTela ()
{
    system(CLEAR_COMMAND);
}

FILE *abrirArquivo() 
{
    FILE *arquivo;

    arquivo = fopen("senhas.dat", "r+b");

    if (arquivo == NULL)
    {
        arquivo = fopen("senhas.dat", "w+b");
    }

    if (arquivo == NULL)
    {
        printf("Erro ao abrir arquivo.\n");
    }

    return arquivo;
}

void continuarTela()
{
    printf("\n");
    system("pause");
    limparTela();
}