#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
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

int main()
{

    system("chcp 65001 > nul");
    setlocale(LC_ALL, "pt-BR");

    system(CLEAR_COMMAND);
    printf("=== Gerenciador de Senhas Cofre Digital ===\n\n");

    GerenciadorSenhas senhas[TAM];

    FILE *arquivo;
    // a = abre em modo de gravação no final do arquivo, se o mesmo nao existir ele é criado | + = permite leitura e gravação | b = modo de edição em binario.
    arquivo = fopen("senhas.dat", "a+b"); 
    if (arquivo == NULL)
    {
        printf("Erro ao abrir o arquivo.");
        return 1;
    }

    int fim = 0, menu = 1, i = 0;

    while (menu)
    {
        printf("   MENU");
        printf("\n---------------------");
        printf("\n 1 - Sair");
        printf("\n 2 - Ver senhas");
        printf("\n 3 - Deletar senhas");
        printf("\n 4 - Cadastrar senhas");
        printf("\n Selecione: ");

        scanf("%d", &fim);
        switch (fim)
        {
        case 1:
        {
            printf("Encerrando!");
            menu = 0;
            break;
        }
        case 2:
        {
            system(CLEAR_COMMAND);
            int respVS = 0;
            printf("Deseja ver todas as senhas ou senha especifica\n");
            printf("1-Todas, 2-Especifica: ");
            scanf("%d", &respVS);
            switch (respVS)
            {
            case 1:
            {
                printf("SENHAS SALVAS\n");
                // VOLTA PAR O INICIO DO ARQUIVO
                rewind(arquivo);
                GerenciadorSenhas temp;
                // GUARDA OS BYTES DE 1 STRUCT DE ARQUIVO DENTRO DO ENDEREÇO DE TEMP, O WHILE SO TERMINA QUANDO O FREAD NAO CONSEGUE LER MAIS BYTES
                while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
                {
                    printf("\nServico: %s", temp.servico);
                    printf("\nUsuario: %s", temp.usuario);
                    printf("\nSenha: %s\n", temp.senha);
                }
                break;
            }
            case 2:
            {

                printf("SENHAS SALVAS\n");
                rewind(arquivo);
                GerenciadorSenhas temp;
                printf("\n=== SENHAS SALVAS ===\n");

                while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
                {
                    printf("\nServico: %s", temp.servico);
                }

                char ver_senha[TAM];

                printf("\n\nDigite o nome do servico que deseja ver a senha: ");
                scanf(" %49[^\n]", ver_senha);

                rewind(arquivo);
                system(CLEAR_COMMAND);
                while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
                {

                    if (strcmp(temp.servico, ver_senha) == 0)
                    {

                        printf("\nServico: %s", temp.servico);
                        printf("\nUsuario: %s", temp.usuario);
                        printf("\nSenha: %s\n", temp.senha);
                    }
                }

                break;
            }
            }

            printf("\n");
            break;
        }
        case 3:
        {

            system(CLEAR_COMMAND);

            FILE *tempFile;

            tempFile = fopen("temp.dat", "wb");

            if (tempFile == NULL)
            {
                printf("Erro ao criar arquivo temporario.");
                break;
            }

            rewind(arquivo);

            GerenciadorSenhas temp;

            printf("\n=== SENHAS SALVAS ===\n");

            while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
            {
                printf("\nServico: %s", temp.servico);
            }

            char deletar[TAM];

            printf("\n\nDigite o nome do servico que deseja deletar: ");
            scanf(" %49[^\n]", deletar);

            rewind(arquivo);

            while (fread(&temp, sizeof(GerenciadorSenhas), 1, arquivo))
            {

                if (strcmp(temp.servico, deletar) != 0)
                {

                    fwrite(&temp, sizeof(GerenciadorSenhas), 1, tempFile);
                }
            }

            fclose(arquivo);
            fclose(tempFile);

            remove("senhas.dat");

            rename("temp.dat", "senhas.dat");

            arquivo = fopen("senhas.dat", "a+b");

            if (arquivo == NULL)
            {
                printf("Erro ao abrir o arquivo.");
                break;
            }

            system(CLEAR_COMMAND);

            printf("\nSenha removida com sucesso!\n");

            break;
        }
        case 4:
        {
            i = 0;
            system(CLEAR_COMMAND);
            int parar = 1, temp = 0;

            while (parar && i < TAM)
            {

                printf("Digite o serviço para o qual deseja criar uma senha: ");
                scanf(" %49[^\n]", senhas[i].servico);

                printf("\nDigite o nome de usuário para o serviço: ");
                scanf(" %49[^\n]", senhas[i].usuario);

                printf("\nDigite a senha para o serviço: ");
                scanf(" %49[^\n]", senhas[i].senha);

                printf("\nSenha cadastrada com sucesso!\n");

                do
                {
                    printf("\nDeseja cadastrar outra senha?"
                           "\n1 - Sim"
                           "\n0 - Não"
                           "\nSelecione: ");
                    scanf("%d", &temp);
                    getchar();
                    system(CLEAR_COMMAND);

                    if (temp != 0 && temp != 1)
                    {
                        printf("Opcao invalida!\n");
                    }

                } while (temp != 0 && temp != 1);

                parar = temp;
                i++;
            }
            // SALVAR SENHAS
            fwrite(senhas, sizeof(GerenciadorSenhas), i, arquivo);
            system(CLEAR_COMMAND);
            menu = 1;
            break;
        }
        }
    }
    fclose(arquivo);
    return 0;
}