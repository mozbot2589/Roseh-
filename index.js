// Inicia o Roseh bot
async function startRosehBot() {
  try {
    // Configura o ambiente
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    process.setMaxListeners(100); // Ajuste o valor conforme necessário

    // Inicia o logger
    bannerLog();
    infoLog("Iniciando o Roseh bot...");

    // Verifica os stats do BadMacHandler
    const stats = badMacHandler.getStats();
    if (stats.errorCount > 0) {
      warningLog(`BadMacHandler stats: ${stats.errorCount}/${stats.maxRetries} erros`);
    }

    // Conecta ao socket e carrega os comandos
    const socket = await connect();
    load(socket);

    // Log de sucesso
    successLog("✅ Roseh bot iniciado com sucesso!");
  } catch (error) {
    // Trata erros
    if (badMacHandler.handleError(error, "roseh-bot-startup")) {
      warningLog("Erro Bad MAC durante inicialização, tentando novamente...");
      setTimeout(() => {
        startRosehBot();
      }, 5000);
      return;
    }
    errorLog(`Erro ao iniciar o Roseh bot: ${error.message}`);
    errorLog(error.stack);
    process.exit(1);
  }
}

// Inicia o Roseh bot
startRosehBot();
