#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "util.h"

void lerTexto(const char *mensagem, char *destino, int tamanho) {
    printf("%s", mensagem);
    if (fgets(destino, tamanho, stdin) == NULL) {
        destino[0] = '\0';
        return;
    }
    destino[strcspn(destino, "\r\n")] = '\0';
}

int lerInteiro(const char *mensagem) {
    char linha[64], *fim;
    long valor;
    do {
        lerTexto(mensagem, linha, sizeof(linha));
        valor = strtol(linha, &fim, 10);
        if (*linha != '\0' && *fim == '\0') return (int)valor;
        printf("Valor invalido. Tente novamente.\n");
    } while (1);
}

double lerDecimal(const char *mensagem) {
    char linha[64], *fim;
    double valor;
    do {
        lerTexto(mensagem, linha, sizeof(linha));
        for (int i = 0; linha[i]; i++) if (linha[i] == ',') linha[i] = '.';
        valor = strtod(linha, &fim);
        if (*linha != '\0' && *fim == '\0') return valor;
        printf("Valor invalido. Tente novamente.\n");
    } while (1);
}

void pausar(void) {
    char linha[4];
    printf("\nPressione Enter para continuar...");
    fgets(linha, sizeof(linha), stdin);
}

void limparTerminal(void) {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}
