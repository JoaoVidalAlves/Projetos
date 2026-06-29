#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "criptografia.h"
#include "entrada.h"
#include "interface.h"
#include "macros.h"
#include "senhas.h"
#include "sistema.h"
#include "tipos.h"

int main()
{
    iniciarSistema();

    FILE *arquivo = abrirArquivo();

    char senhaMestra[TAM];

    do
    {
        printf("Digite a senha mestra: ");

        scanf(" %49[^\n]", senhaMestra);

    }while(strlen(senhaMestra)==0);


    if(!validarSenhaMestra(arquivo,senhaMestra))
    {
        printf("Senha incorreta!\n");

        fclose(arquivo);

        return 1;
    }

    char opcao[50];
    int Nopcao=0;
    int continuar=1;

    fseek(arquivo,0,SEEK_END);
    
    limparTela();
    
    while(continuar)
    {
        do
        {
            Menu();
            
            scanf(" %49s", opcao);
            Nopcao = validarNumero(opcao);
        
            if(Nopcao < 1 || Nopcao > 4)
            {
                limparTela();
                printf("Opcao invalida!\n");
                continue;
            }
            limparTela();
        } while (Nopcao < 1 || Nopcao > 4);
        
        switch (Nopcao)
        {
        case 1:

            memset(senhaMestra, 0, sizeof(senhaMestra));

            fclose(arquivo);

            printf("\nEncerrando...\n");

            return 0;
        case 2:
            limparTela();
            visualizarSenhas(arquivo,senhaMestra);
            continuarTela();
            break;

        case 3:
            limparTela();
            arquivo = deletarSenha(arquivo,senhaMestra);
            continuarTela();
            break;

        case 4:
            cadastrarSenhas(arquivo,senhaMestra);
            break;

        default:
            printf("\nOpcao invalida!\n");
        }
    }

    return 0;
}