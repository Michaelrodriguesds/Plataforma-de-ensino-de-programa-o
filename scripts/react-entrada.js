// Ponto de entrada para gerar public/js/runtime/reactlib.js (npm run build:react)
// Junta: Preact com a "camada React" (preact/compat), as ferramentas de teste
// (act) e o tradutor de JSX (sucrase). Tudo roda dentro do Web Worker.
import * as React from 'preact/compat';
import { createRoot } from 'preact/compat/client';
import { act } from 'preact/test-utils';
import { transform } from 'sucrase';

function transformar(codigo) {
  return transform(codigo, {
    transforms: ['jsx'],
    jsxPragma: 'React.createElement',
    jsxFragmentPragma: 'React.Fragment',
    production: true
  }).code;
}

(typeof self !== 'undefined' ? self : globalThis).cqReactLib = { React, createRoot, act, transformar };
