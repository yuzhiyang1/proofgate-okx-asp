import { createAppServer } from './server.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';
const server = createAppServer();

server.listen(port, host, () => {
  // 仅记录监听地址，不输出请求正文或用户证据，避免日志泄露。
  console.log(`ProofGate listening on http://${host}:${port}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down ProofGate.`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
