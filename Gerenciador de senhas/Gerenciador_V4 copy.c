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

typedef struct Verificacao
{
    char assinatura[10];
} Verificacao;

void criptografarTexto(char texto[], char chave[]);
void criptografarStruct(GerenciadorSenhas *dados, char chave[]);
int validarSenhaMestra(FILE *arquivo, char senhaMestra[]);

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
void cadastrarSenhas(FILE *arquivo, char senhaMestra[])
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

        criptografarStruct(&senha, senhaMestra);

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
void listarTodas(FILE *arquivo, char senhaMestra[])
{
    GerenciadorSenhas temp;

    rewind(arquivo);

    fseek(arquivo,sizeof(Verificacao),SEEK_SET);

    printf("\n=== SENHAS SALVAS ===\n");

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

    printf("\n=== SERVICOS CADASTRADOS ===\n");

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
        printf("\nServico nao encontrado.\n");
    }

    memset(&temp, 0, sizeof(temp));
    memset(busca, 0, sizeof(busca));
}

void visualizarSenhas(FILE *arquivo, char senhaMestra[])
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

    printf("\n=== SERVICOS CADASTRADOS ===\n");

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
        printf("\nSenha removida com sucesso!\n");
    }
    else
    {
        printf("\nServico nao encontrado.\n");
    }

    return arquivo;
}

/* =================== CRIPTOGRAFIA =================== */
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
/* ======================= MAIN ======================= */
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

    int opcao;

    int continuar=1;

    fseek(arquivo,0,SEEK_END);

    while(continuar)
    {
        Menu();

        scanf("%d", &opcao);

        switch (opcao)
        {
        case 1:

            memset(senhaMestra, 0, sizeof(senhaMestra));

            fclose(arquivo);

            printf("\nEncerrando...\n");

            return 0;
        case 2:
            limparTela();
            visualizarSenhas(arquivo,senhaMestra);
            break;

        case 3:
            limparTela();
            arquivo = deletarSenha(arquivo,senhaMestra);
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