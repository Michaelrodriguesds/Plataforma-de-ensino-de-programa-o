// =============================================================
// javaRunner.js — executa código Java do aluno no servidor.
//
// Por que no servidor? JavaScript e Python rodam direto no navegador
// (o celular faz o trabalho). Java precisa do "javac" (compilador) e
// da "java" (máquina virtual), que só existem no servidor.
//
// Analogia: o aluno entrega uma receita (código). A gente cozinha numa
// cozinha descartável (pasta temporária), com cronômetro (tempo máximo)
// e sem acesso ao resto da casa (bloqueio de comandos perigosos).
// Depois jogamos a cozinha fora.
// =============================================================
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const TEMPO_COMPILAR_MS = 15000;
const TEMPO_EXECUTAR_MS = 5000;
const MAX_SAIDA = 20000; // caracteres
const MAX_SIMULTANEOS = 2;
let rodandoAgora = 0;

// Verifica uma vez se o Java está instalado
let javaDisponivel = null;
function temJava() {
  if (javaDisponivel === null) {
    try {
      const r = spawnSync('javac', ['-version'], { encoding: 'utf8' });
      javaDisponivel = r.status === 0;
    } catch { javaDisponivel = false; }
  }
  return javaDisponivel;
}

// Coisas que um exercício de aprendizado nunca precisa e que poderiam
// mexer no servidor (arquivos, rede, outros programas).
const PROIBIDOS = [
  /\bjava\.io\.(File|RandomAccessFile|FileWriter|FileReader|FileInputStream|FileOutputStream)\b/,
  /\bnew\s+(File|FileWriter|FileReader|FileInputStream|FileOutputStream|RandomAccessFile|PrintWriter\s*\(\s*")/,
  /\bjava\.nio\b/, /\bFiles\s*\./, /\bPaths?\s*\./,
  /\bjava\.net\b/, /\bSocket\b/, /\bURL\b/, /\bHttpClient\b/,
  /\bRuntime\b/, /\bProcessBuilder\b/, /\bProcessHandle\b/,
  /\bSystem\s*\.\s*(exit|getenv|getProperties|setProperty|load|loadLibrary)\b/,
  /\bjava\.lang\.reflect\b/, /\bClass\s*\.\s*forName\b/, /\bgetDeclared\w*\b/, /\bsetAccessible\b/,
  /\bjava\.lang\.invoke\b/, /\bUnsafe\b/, /\bClassLoader\b/, /\bjavax?\.script\b/, /\bjava\.awt\b/, /\bjavax\.swing\b/,
  /\bThread\b/, /\bExecutor\w*\b/, /\bnative\s+/,
  // O Java troca \u0052 por "R" ANTES de ler o código: daria para esconder palavras proibidas assim
  /\\u+[0-9a-fA-F]{4}/
];

// Prepara o código: se o aluno escreveu só comandos soltos (fases iniciais),
// a gente "embrulha" dentro de uma classe Main com o método main.
function prepararCodigo(codigo) {
  const temMain = /static\s+void\s+main\s*\(/.test(codigo);
  if (!temMain) {
    if (/\b(class|interface|enum|record)\s+\w+/.test(codigo)) {
      return { erro: 'Seu código tem classes, mas não tem o método main.\nCrie: public static void main(String[] args) { ... } dentro da classe Main.' };
    }
    // separa os imports (que precisam ficar fora da classe)
    const imports = [];
    const corpo = codigo.split('\n').filter(l => {
      if (/^\s*import\s+[\w.*]+\s*;\s*$/.test(l)) { imports.push(l.trim()); return false; }
      return true;
    }).join('\n');
    const cabecalho = ['import java.util.*;', 'import java.util.function.*;', 'import java.util.stream.*;', ...imports,
      'public class Main {', '  public static void main(String[] args) throws Exception {'];
    return {
      classe: 'Main',
      fonte: cabecalho.join('\n') + '\n' + corpo + '\n  }\n}\n',
      linhasExtras: cabecalho.length
    };
  }
  // Descobre o nome da classe pública (o arquivo precisa ter o mesmo nome)
  const pub = codigo.match(/public\s+(?:final\s+)?class\s+(\w+)/);
  let classe = pub ? pub[1] : null;
  if (!classe) {
    // sem "public class": pega a classe que tem o main
    const antesDoMain = codigo.slice(0, codigo.search(/static\s+void\s+main\s*\(/));
    const nomes = [...antesDoMain.matchAll(/class\s+(\w+)/g)];
    classe = nomes.length ? nomes[nomes.length - 1][1] : 'Main';
  }
  // Programa completo: acrescentamos os imports mais usados no topo
  // (assim o aluno não trava por esquecer "import java.util.*;")
  const extras = ['import java.util.*;', 'import java.util.function.*;', 'import java.util.stream.*;'];
  return { classe, fonte: extras.join('\n') + '\n' + codigo, linhasExtras: extras.length };
}

function executarProcesso(cmd, args, { cwd, entrada, tempo }) {
  return new Promise(resolve => {
    // Só repassamos as variáveis que o Java precisa (nada de senhas do .env)
    const env = { JAVA_TOOL_OPTIONS: '' };
    for (const k of ['PATH', 'Path', 'SystemRoot', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'JAVA_HOME', 'LANG']) {
      if (process.env[k]) env[k] = process.env[k];
    }
    const p = spawn(cmd, args, { cwd, env });
    let out = '', err = '', estourou = false, cortado = false;
    p.stdout.setEncoding('utf8'); // evita quebrar acentos divididos entre pedaços
    p.stderr.setEncoding('utf8');
    const t = setTimeout(() => { estourou = true; p.kill('SIGKILL'); }, tempo);
    p.stdout.on('data', d => { out += d; if (out.length > MAX_SAIDA) { cortado = true; p.kill('SIGKILL'); } });
    p.stderr.on('data', d => { err += d; if (err.length > MAX_SAIDA) p.kill('SIGKILL'); });
    p.on('close', code => { clearTimeout(t); resolve({ code, out: out.slice(0, MAX_SAIDA), err: err.slice(0, MAX_SAIDA), estourou, cortado }); });
    p.on('error', e => { clearTimeout(t); resolve({ code: -1, out: '', err: String(e), estourou: false }); });
    if (entrada) p.stdin.write(entrada.endsWith('\n') ? entrada : entrada + '\n');
    p.stdin.end();
  });
}

// Limpa a mensagem de erro do Java para o aluno entender melhor
function limparErro(texto, linhasExtras) {
  return texto
    .split('\n')
    .filter(l => !l.startsWith('Picked up JAVA_TOOL_OPTIONS'))
    .map(l => l.replace(/^.*?(\w+\.java):(\d+):/, (_, arq, n) => `Linha ${Math.max(1, Number(n) - linhasExtras)}:`))
    .join('\n').trim();
}

async function rodarJava(codigo, entrada = '', deslocamento = 0) {
  if (!temJava()) {
    return { ok: false, erro: 'O Java não está instalado neste servidor. Instale o JDK 17+ (veja o LEIA-ME) para os exercícios de Java funcionarem.' };
  }
  if (typeof codigo !== 'string' || codigo.length > 20000) return { ok: false, erro: 'Código vazio ou grande demais.' };
  for (const re of PROIBIDOS) {
    if (re.test(codigo)) {
      return { ok: false, erro: 'Por segurança, este laboratório não permite acessar arquivos, rede, threads ou comandos do sistema. Os exercícios não precisam disso 🙂' };
    }
  }
  const prep = prepararCodigo(codigo);
  if (!prep.erro) prep.linhasExtras += Math.max(0, Number(deslocamento) || 0);
  if (prep.erro) return { ok: false, erro: prep.erro };
  if (rodandoAgora >= MAX_SIMULTANEOS) return { ok: false, erro: 'Servidor ocupado compilando outros códigos. Tente de novo em alguns segundos.' };

  rodandoAgora++;
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'cq-java-'));
  try {
    fs.writeFileSync(path.join(pasta, prep.classe + '.java'), prep.fonte);
    const comp = await executarProcesso('javac', ['-encoding', 'UTF-8', '-nowarn', '-proc:none', prep.classe + '.java'], { cwd: pasta, tempo: TEMPO_COMPILAR_MS });
    if (comp.code !== 0) {
      return { ok: false, tipo: 'compilacao', erro: limparErro(comp.err || comp.out, prep.linhasExtras) || 'Erro ao compilar.' };
    }
    const exec = await executarProcesso('java', ['-Xmx96m', '-Xss8m', '-XX:+UseSerialGC', '-XX:TieredStopAtLevel=1', '-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-Duser.language=pt', '-Duser.country=BR', '-cp', '.', prep.classe],
      { cwd: pasta, entrada, tempo: TEMPO_EXECUTAR_MS });
    if (exec.estourou) return { ok: false, saida: exec.out, erro: `Tempo esgotado (${TEMPO_EXECUTAR_MS / 1000}s). Será que tem um laço infinito?` };
    if (exec.cortado) return { ok: false, saida: exec.out, erro: 'Seu programa imprimiu coisa demais (laço infinito?).' };
    const erro = limparErro(exec.err, prep.linhasExtras);
    return { ok: exec.code === 0, saida: exec.out, erro: exec.code === 0 ? '' : erro };
  } finally {
    rodandoAgora--;
    fs.rm(pasta, { recursive: true, force: true }, () => {});
  }
}

module.exports = { rodarJava, temJava, prepararCodigo };
