// =============================================================
// Restaura um backup baixado no painel (botão "Baixar backup").
// Uso:  node scripts/restaurar-backup.js codequest-backup-2026-10-21.json
// Ele usa o banco configurado no .env (MONGODB_URI) ou o arquivo local.
// Usuários com o mesmo id/usuário são substituídos pela versão do backup;
// os outros continuam como estão.
// =============================================================
require('dotenv').config();
const fs = require('fs');
const { criarStore } = require('../src/store');

async function main() {
  const arquivo = process.argv[2];
  if (!arquivo || !fs.existsSync(arquivo)) {
    console.error('Informe o arquivo de backup: node scripts/restaurar-backup.js caminho/do/backup.json');
    process.exit(1);
  }
  const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  if (!Array.isArray(dados.usuarios)) throw new Error('Arquivo não parece um backup do CodeQuest.');
  const store = criarStore();
  await store.conectar();
  let n = 0;
  for (const u of dados.usuarios) { await store.restaurarUsuario(u); n++; }
  console.log(`✅ ${n} usuário(s) restaurado(s) do backup de ${dados.geradoEm}.`);
  process.exit(0);
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
