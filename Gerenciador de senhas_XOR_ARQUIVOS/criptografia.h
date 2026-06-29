#ifndef CRIPTOGRAFIA_H
#define CRIPTOGRAFIA_H

#include <stdio.h>
#include <stdlib.h>
#include "tipos.h"

void criptografarTexto(char texto[], char chave[]);

void criptografarStruct(GerenciadorSenhas *dados, char chave[]);

int validarSenhaMestra(FILE *arquivo, char senhaMestra[]);

#endif