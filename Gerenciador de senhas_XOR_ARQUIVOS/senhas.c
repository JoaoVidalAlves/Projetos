#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "senhas.h"
#include "criptografia.h"
#include "entrada.h"
#include "sistema.h"
#include "tipos.h"
#include "macros.h"

/* ===================== EXIBIÇÃO ===================== */
void MostrarRegistros (GerenciadorSenhas senha)
{
    printf("\nServico: %s", senha.servico);
    printf("\nUsuario: %s", senha.usuario);
    printf("\nSenha: %s\n", senha.senha);
}
/* ===================== CADASTRO ===================== */
int servicoJaCadastrado(FILE *arquivo, char senhaMestra[], char servico[])
{
    GerenciadorSenhas temp;

    rewind(arquivo);
    fseek(arquivo, sizeof(Verificacao), SEEK_SET);

    while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
    {
        criptografarStruct(&temp, senhaMestra);

        if (strcmp(temp.servico, servico) == 0)
        {
            memset(&temp, 0, sizeof(temp));
            return 1;
        }

        memset(&temp, 0, sizeof(temp));
    }

    return 0;
}

void cadastrarSenhas(FILE *arquivo, char senhaMestra[])
{
GerenciadorSenhas senha;
int Icontinuar = 1;

while (Icontinuar)
    {
        limparTela();
        fseek(arquivo, 0, SEEK_END);

        printf("Digite o serviço: ");
        scanf(" %49[^\n]", senha.servico);

        while (servicoJaCadastrado(arquivo, senhaMestra, senha.servico))
        {
            printf(VERMELHO "\nServico ja cadastrado. Digite outro nome.\n\n" RESET);
            memset(senha.servico, 0, sizeof(senha.servico));

            printf("Digite o servico: ");
            scanf(" %49[^\n]", senha.servico);
        }

        printf("Digite o usuário: ");
        scanf(" %49[^\n]", senha.usuario);

        printf("Digite a senha: ");
        scanf(" %49[^\n]", senha.senha);

        criptografarStruct(&senha, senhaMestra);

        fseek(arquivo, 0, SEEK_END);
        fwrite(&senha,sizeof(GerenciadorSenhas),1,arquivo);
        fflush(arquivo);

        memset(&senha, 0, sizeof(GerenciadorSenhas));

        printf("\nSenha cadastrada com sucesso!\n");

        memset(&senha,0,sizeof(senha));

        do
        {
            printf("\nDeseja cadastrar outra?");
            printf("\n1 - Sim");
            printf("\n0 - Não");
            printf("\nSelecione: ");

            Icontinuar = lerOpcao(0, 1);

        } while (Icontinuar < 0 || Icontinuar > 1);
        
        limparTela();
    }
}

/* ===================== CONSULTA ===================== */
void listarTodas(FILE *arquivo, char senhaMestra[])
{
    GerenciadorSenhas temp;

    rewind(arquivo);

    fseek(arquivo,sizeof(Verificacao),SEEK_SET);

    printf(VERDE "\n=== SENHAS SALVAS ===\n" RESET);

    while (fread(&temp,sizeof(GerenciadorSenhas),1,arquivo))
    {
        criptografarStruct(&temp,senhaMestra);

        MostrarRegistros(temp);

        memset(&temp,0,sizeof(temp));
    }

    memset(&temp, 0, sizeof(temp));

}

void listarEspecifica(FILE *arquivo, char senhaMestra[])
{
    GerenciadorSenhas temp;
    char busca[TAM];
    int encontrada = 0;

    rewind(arquivo);

    fseek(arquivo,sizeof(Verificacao),SEEK_SET);

    printf(VERDE "\n=== SERVICOS CADASTRADOS ===\n" RESET);

    while(fread(&temp,sizeof(GerenciadorSenhas),1,arquivo))
    {
        criptografarStruct(&temp,senhaMestra);

        printf("- %s\n",temp.servico);

        memset(&temp,0,sizeof(temp));
    }

    printf("\nDigite o serviço: ");
    scanf(" %49[^\n]", busca);

    rewind(arquivo);

    fseek(arquivo,sizeof(Verificacao),SEEK_SET);

    while(fread(&temp,sizeof(GerenciadorSenhas),1,arquivo))
    {
        criptografarStruct(&temp,senhaMestra);

        if(strcmp(temp.servico,busca)==0)
        {
            MostrarRegistros(temp);
            encontrada = 1;
            break;
        }
    }

    if (!encontrada)
    {
        printf(VERMELHO "\nServico nao encontrado.\n" RESET);
    }

    memset(&temp, 0, sizeof(temp));
    memset(busca, 0, sizeof(busca));
}

void visualizarSenhas(FILE *arquivo, char senhaMestra[])
{
    int opcao;

    do
    {
        printf("\n1 - Todas");
        printf("\n2 - Especifica");
        printf("\nSelecione: ");

        opcao = lerOpcao(1, 2);

    } while (opcao < 1 || opcao > 2);

    limparTela();

    switch (opcao)
    {
    case 1:
        listarTodas(arquivo,senhaMestra);
        break;

    case 2:
        listarEspecifica(arquivo,senhaMestra);
        break;

    default:
        printf("Opcao invalida.\n");
    }
}

/* ===================== EXCLUSÃO ===================== */
FILE *deletarSenha(FILE *arquivo, char senhaMestra[])
{
    FILE *tempFile;
    GerenciadorSenhas temp;
    char deletar[TAM];
    int encontrada = 0;

    tempFile = fopen("temp.dat", "wb");

    if (tempFile == NULL)
    {
        printf("Erro ao criar arquivo temporario.\n");
        return arquivo;
    }

    rewind(arquivo);

    Verificacao ver;

    fread(&ver,sizeof(ver),1,arquivo);

    fwrite(&ver,sizeof(ver),1,tempFile);

    fseek(arquivo,sizeof(Verificacao),SEEK_SET);

    printf(VERDE "\n=== SERVICOS CADASTRADOS ===\n" RESET);

    while(fread(&temp,sizeof(GerenciadorSenhas),1,arquivo))
    {
        criptografarStruct(&temp,senhaMestra);

        printf("- %s\n",temp.servico);

        memset(&temp,0,sizeof(temp));
    }

    printf("\nDigite o serviço que deseja remover: ");
    scanf(" %49[^\n]", deletar);

    rewind(arquivo);

    fseek(arquivo,sizeof(Verificacao),SEEK_SET);

    while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
    {
        GerenciadorSenhas copia=temp;

        criptografarStruct(&copia,senhaMestra);

        if(strcmp(copia.servico,deletar)!=0)
        {
            fwrite(&temp,sizeof(temp),1,tempFile);
        }
        else
        {
            encontrada = 1;
        }
    }

    fclose(arquivo);
    fclose(tempFile);

    remove("senhas.dat");
    rename("temp.dat", "senhas.dat");

    arquivo = abrirArquivo();

    if (encontrada)
    {
        printf(VERDE "\nSenha removida com sucesso!\n" RESET);
    }
    else
    {
        printf(VERMELHO "\nServico nao encontrado.\n" RESET);
    }

    return arquivo;
}