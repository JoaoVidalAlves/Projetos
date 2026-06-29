#ifndef SENHAS_H
#define SENHAS_H

#include <stdio.h>
#include <stdlib.h>
#include "tipos.h"

/* ===================== EXIBIÇÃO ===================== */
void MostrarRegistros (GerenciadorSenhas senha);
/* ===================== CADASTRO ===================== */
int servicoJaCadastrado(FILE *arquivo, char senhaMestra[], char servico[]);

void cadastrarSenhas(FILE *arquivo, char senhaMestra[]);
/* ===================== CONSULTA ===================== */
void listarTodas(FILE *arquivo, char senhaMestra[]);

void listarEspecifica(FILE *arquivo, char senhaMestra[]);

void visualizarSenhas(FILE *arquivo, char senhaMestra[]);
/* ===================== EXCLUSÃO ===================== */
FILE *deletarSenha(FILE *arquivo, char senhaMestra[]);

#endif