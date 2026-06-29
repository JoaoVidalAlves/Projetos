#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <locale.h>
#include <ctype.h>

/* =========== TAMANHO MAXIMO DE STRINGS ============ */
#define TAM 50

/* ================= MACROS DE COR ================== */
#define RESET   "\033[0m"
#define PRETO   "\033[30m"
#define VERMELHO "\033[31m"
#define VERDE   "\033[32m"
#define AMARELO "\033[33m"
#define AZUL    "\033[34m"
#define MAGENTA "\033[35m"
#define CIANO   "\033[36m"
#define BRANCO  "\033[37m"

/* ============== MACRO LIMPAR TELA ================= */
#ifdef _WIN32
#define CLEAR_COMMAND "cls"
#else
#define CLEAR_COMMAND "clear"
#endif

/* ==================== INICIO ======================= */
typedef struct GerenciadorSenhas
{
    char servico[TAM];
    char usuario[TAM];
    char senha[TAM];
} GerenciadorSenhas;

typedef struct Verificacao
{
    char assinatura[TAM];
} Verificacao;

void criptografarTexto(char texto[], char chave[]);
void criptografarStruct(GerenciadorSenhas *dados, char chave[]);
int validarSenhaMestra(FILE *arquivo, char senhaMestra[]);

/* ================= VALIDAR NUMERO ================== */
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

void continuarTela()
{
    printf("\n");
    system("pause");
    limparTela();
}
/* ===================== EXIBIÇÃO ===================== */
void Menu() 
{   
    printf("\n");
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