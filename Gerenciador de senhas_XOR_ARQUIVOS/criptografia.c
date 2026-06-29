#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "criptografia.h"
#include "tipos.h"

void criptografarTexto(char texto[], char chave[])
{
    int tamanhoChave = strlen(chave);

    if(tamanhoChave == 0)
        return;

    for(int i = 0; i < TAM; i++)
    {
        texto[i] ^= chave[i % tamanhoChave];
    }
}

void criptografarStruct(GerenciadorSenhas *dados, char chave[])
{
    criptografarTexto(dados->servico,chave);

    criptografarTexto(dados->usuario,chave);

    criptografarTexto(dados->senha,chave);
}

int validarSenhaMestra(FILE *arquivo, char senhaMestra[])
{
    Verificacao ver;

    rewind(arquivo);

    if(fread(&ver,sizeof(ver),1,arquivo)==0)
    {
        strcpy(ver.assinatura,"VALIDO");

        criptografarTexto(ver.assinatura,senhaMestra);

        rewind(arquivo);

        fwrite(&ver,sizeof(ver),1,arquivo);
        fflush(arquivo);

        return 1;
    }

    criptografarTexto(ver.assinatura,senhaMestra);

    if(strcmp(ver.assinatura,"VALIDO")!=0)
    {
        return 0;
    }

    return 1;
}