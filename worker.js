const { parentPort } = require("worker_threads");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

parentPort.on("message", (message) => {
  const { taskId, payload } = message;

  const startTime = Date.now();
  const result = fibonacci(payload);
  const timeTaken = Date.now() - startTime;

  parentPort.postMessage({ taskId, result, timeTaken });
});
