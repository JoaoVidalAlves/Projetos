# Sistema de Supermercado em C

Projeto de terminal estruturado em modulos para os perfis Comprador, Vendedor/Caixa e Administrador.

## Como executar

No Windows com MinGW/GCC, abra o terminal dentro desta pasta e execute:

```bat
compilar.bat
supermercado.exe
```

## Estrutura

- `src/`: implementacao das funcoes.
- `include/`: cabecalhos e estruturas.
- `data/produtos.csv`: banco de dados simples de produtos.
- `data/vendas.txt`: criado automaticamente quando houver vendas.
- `relatorios/`: comprovantes e relatorio de estoque.

## Regras implementadas

- Produtos por unidade e por peso (kg).
- Limite de 100 kg no carrinho e exibicao do peso por item e total.
- Bloqueio de quantidade acima do estoque.
- Estoque reservado ao adicionar ao carrinho e devolvido ao remover ou cancelar.
- Persistencia do estoque no CSV depois de cada alteracao.
- Comprovante e historico de vendas em arquivos `.txt`.
- Pagamento por debito, credito ou dinheiro fisico.
