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