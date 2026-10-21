// Gera docs/CURRICULO.md com todas as fases de todas as trilhas.
// Rode depois de criar ou mudar fases:  npm run curriculo
const fs = require('fs');
const path = require('path');
const { carregarCursos } = require('../src/jogo');

const { cursos } = carregarCursos();
const tipos = { quiz: 'pergunta', prever: 'prever', completar: 'completar', montar: 'montar', codigo: 'código' };
let total = 0, totalEx = 0;
let md = '# Currículo do CodeQuest\n\n> Arquivo gerado automaticamente por `npm run curriculo`. Não edite à mão.\n\n';
const resumo = [];
for (const id of ['python', 'javascript', 'java']) {
  const c = cursos[id];
  if (!c) continue;
  let n = 0, ex = 0;
  let bloco = `## ${c.icone} ${c.nome}\n\n${c.desc}\n\n`;
  c.mundos.forEach((m, mi) => {
    bloco += `### Mundo ${mi + 1}: ${m.titulo}${m.poo ? ' (Orientação a Objetos)' : ''}\n\n${m.desc}\n\n| Fase | Id | Título | Lição | Exercícios |\n|---|---|---|---|---|\n`;
    m.fases.forEach(f => {
      n++; ex += (f.ex || []).length;
      const cont = {};
      (f.ex || []).forEach(e => { cont[tipos[e.tipo] || e.tipo] = (cont[tipos[e.tipo] || e.tipo] || 0) + 1; });
      const licao = (f.licao || []).map(l => l.titulo).join(' · ');
      bloco += `| ${n} | \`${f.id}\` | ${f.icone} ${f.titulo} | ${licao} | ${Object.entries(cont).map(([k, v]) => `${v} ${k}`).join(', ')} |\n`;
    });
    bloco += '\n';
  });
  resumo.push(`| ${c.icone} ${c.nome} | ${c.mundos.length} | ${n} | ${ex} |`);
  total += n; totalEx += ex;
  md += bloco;
}
md = md.replace('Não edite à mão.\n\n', `Não edite à mão.\n\n| Trilha | Mundos | Fases | Exercícios |\n|---|---|---|---|\n${resumo.join('\n')}\n| **Total** | | **${total}** | **${totalEx}** |\n\n`);
fs.mkdirSync(path.join(__dirname, '..', 'docs'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'CURRICULO.md'), md);
console.log(`docs/CURRICULO.md gerado: ${total} fases, ${totalEx} exercícios.`);
