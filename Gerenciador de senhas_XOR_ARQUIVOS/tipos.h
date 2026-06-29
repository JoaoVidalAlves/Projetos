#ifndef TIPOS_H
#define TIPOS_H
#define TAM 50

#include <stdio.h>
#include <stdlib.h>

typedef struct GerenciadorSenhas {
    char servico[TAM];
    char usuario[TAM];
    char senha[TAM];
} GerenciadorSenhas;

typedef struct Verificacao {
    char assinatura[TAM];
} Verificacao;

#endif