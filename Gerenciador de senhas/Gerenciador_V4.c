#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <locale.h>
#define TAM 50

#ifdef _WIN32
#define CLEAR_COMMAND "cls"
#else
#define CLEAR_COMMAND "clear"
#endif

typedef struct GerenciadorSenhas
{
    char servico[TAM];
    char usuario[TAM];
    char senha[TAM];
} GerenciadorSenhas;

/* ===================== SISTEMA ===================== */
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

/* ===================== EXIBIÇÃO ===================== */
void Menu() 
{
    printf("   MENU");
    printf("\n---------------------");
    printf("\n 1 - Sair");
    printf("\n 2 - Ver senhas");
    printf("\n 3 - Deletar senhas");
    printf("\n 4 - Cadastrar senhas");
    printf("\n Selecione: ");
}

void MostrarRegistros (GerenciadorSenhas senha)
{
    printf("\nServico: %s", senha.servico);
    printf("\nUsuario: %s", senha.usuario);
    printf("\nSenha: %s\n", senha.senha);
}

/* ===================== CADASTRO ===================== */
void cadastrarSenhas (FILE *arquivo)
{
GerenciadorSenhas senha;
int continuar = 1;

while (continuar)
    {
        limparTela();

        printf("Digite o serviço: ");
        scanf(" %49[^\n]", senha.servico);

        printf("Digite o usuário: ");
        scanf(" %49[^\n]", senha.usuario);

        printf("Digite a senha: ");
        scanf(" %49[^\n]", senha.senha);

        fwrite(&senha, sizeof(GerenciadorSenhas), 1, arquivo);

        fflush(arquivo);

        memset(&senha, 0, sizeof(GerenciadorSenhas));

        printf("\nSenha cadastrada com sucesso!\n");

        do
        {
            printf("\nDeseja cadastrar outra?");
            printf("\n1 - Sim");
            printf("\n0 - Não");
            printf("\nSelecione: ");

            scanf("%d", &continuar);

            if (continuar != 0 && continuar != 1)
            {
                printf("\nOpcao invalida!\n");
            }

        } while (continuar != 0 && continuar != 1);
        limparTela();
    }
}

/* ===================== CONSULTA ===================== */
void listarTodas(FILE *arquivo)
{
    GerenciadorSenhas temp;

    rewind(arquivo);

    printf("\n=== SENHAS SALVAS ===\n");

    while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
    {
        MostrarRegistros(temp);
    }

    memset(&temp, 0, sizeof(temp));

}

void listarEspecifica(FILE *arquivo)
{
    GerenciadorSenhas temp;
    char busca[TAM];
    int encontrada = 0;

    rewind(arquivo);

    printf("\n=== SERVICOS CADASTRADOS ===\n");

    while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
    {
        printf("- %s\n", temp.servico);
    }

    printf("\nDigite o serviço: ");
    scanf(" %49[^\n]", busca);

    rewind(arquivo);

    while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
    {
        if (strcmp(temp.servico, busca) == 0)
        {
            MostrarRegistros(temp);
            encontrada = 1;
            break;
        }
    }

    if (!encontrada)
    {
        printf("\nServico nao encontrado.\n");
    }

    memset(&temp, 0, sizeof(temp));
    memset(busca, 0, sizeof(busca));
}

void visualizarSenhas(FILE *arquivo)
{
    int opcao;

    printf("\n1 - Todas");
    printf("\n2 - Especifica");
    printf("\nSelecione: ");

    scanf("%d", &opcao);

    limparTela();

    switch (opcao)
    {
    case 1:
        listarTodas(arquivo);
        break;

    case 2:
        listarEspecifica(arquivo);
        break;

    default:
        printf("Opcao invalida.\n");
    }
}

/* ===================== EXCLUSÃO ===================== */
FILE *deletarSenha(FILE *arquivo)
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

    printf("\n=== SERVICOS CADASTRADOS ===\n");

    while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
    {
        printf("- %s\n", temp.servico);
    }

    printf("\nDigite o serviço que deseja remover: ");
    scanf(" %49[^\n]", deletar);

    rewind(arquivo);

    while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
    {
        if (strcmp(temp.servico, deletar) != 0)
        {
            fwrite(&temp, sizeof(GerenciadorSenhas), 1, tempFile);
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
        printf("\nSenha removida com sucesso!\n");
    }
    else
    {
        printf("\nServico nao encontrado.\n");
    }

    return arquivo;
}

/* =================== CRIPTOGRAFIA =================== */
void criptografarStruct(GerenciadorSenhas *dados, char chave[])
{
    unsigned char *ptr = (unsigned char*)dados;

    int tamanho = sizeof(GerenciadorSenhas);
    int tamanhoChave = strlen(chave);

    for(int i = 0; i < tamanho; i++)
    {
        ptr[i] ^= chave[i % tamanhoChave];
    }
}

void criptografarArquivo(FILE *arquivo, char chave[])
{
    GerenciadorSenhas temp;

    rewind(arquivo);

    while(fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
    {
        long posicao = ftell(arquivo);

        criptografarStruct(&temp, chave);

        fseek(arquivo, posicao - sizeof(GerenciadorSenhas), SEEK_SET);

        fwrite(&temp,sizeof(GerenciadorSenhas),1,arquivo);

        fflush(arquivo);

        fseek(arquivo, posicao, SEEK_SET);
    }

    memset(&temp, 0, sizeof(temp));

    rewind(arquivo);
}

/* ======================= MAIN ======================= */
int main()
{
    iniciarSistema();

    FILE *arquivo = abrirArquivo();

    char senhaMestra[TAM];

    printf("Digite a senha mestra: ");
    scanf(" %49[^\n]", senhaMestra);

    criptografarArquivo(arquivo, senhaMestra);

    int opcao;

    while (1)
    {
        Menu();

        scanf("%d", &opcao);

        switch (opcao)
        {
        case 1:
            criptografarArquivo(arquivo, senhaMestra);

            memset(senhaMestra, 0, sizeof(senhaMestra));

            fclose(arquivo);

            printf("\nEncerrando...\n");

            return 0;
        case 2:
            limparTela();
            visualizarSenhas(arquivo);
            break;

        case 3:
            limparTela();
            arquivo = deletarSenha(arquivo);
            break;

        case 4:
            cadastrarSenhas(arquivo);
            break;

        default:
            printf("\nOpcao invalida!\n");
        }
    }

    return 0;
}