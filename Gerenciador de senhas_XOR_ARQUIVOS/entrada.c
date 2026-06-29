#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include "entrada.h"
#include "macros.h"

int validarNumero(char entrada[]) {

    int i = 0;

    if(entrada[0] == '-')
        i++;

    if(entrada[i] == '\0')
        return -1;

    for(; entrada[i] != '\0'; i++) {

        if(!isdigit(entrada[i])) {
            return -1;
        }
    }

    return atoi(entrada);
}

int lerOpcao(int minimo, int maximo)
{
    char entrada[10];
    int opcao;

        scanf(" %9s", entrada);

        opcao = validarNumero(entrada);

        if (opcao >= minimo && opcao <= maximo)
        {
            return opcao;
        }
        else
        {
            printf(VERMELHO "\nOpção Invalida\n" RESET);
            return -1;
        }
    
}

void limparBuffer() {
    char c;
    while ((c = getchar()) != '\n' && c != EOF);
}