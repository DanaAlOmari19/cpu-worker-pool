const WorkerPool = require("./pool");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function runWithoutWorkers(taskCount) {
  console.time("noWorkers");

  const results = [];
  for (let taskId = 1; taskId <= taskCount; taskId++) {
    const payload = 40 + (taskId % 4);
    const start = Date.now();

    const result = fibonacci(payload);
    const timeTaken = Date.now() - start;

    results.push({ taskId, result, timeTaken });
  }

  console.timeEnd("noWorkers");

  console.log("\nSample (no workers) - first 5:");
  results.slice(0, 5).forEach((r) => {
    console.log(`task ${r.taskId} -> result=${r.result} (${r.timeTaken}ms)`);
  });
}

async function runWithPool(taskCount) {
  const pool = new WorkerPool(4);

  console.time("withPool");

  const taskPromises = [];
  for (let taskId = 1; taskId <= taskCount; taskId++) {
    const payload = 40 + (taskId % 4);
    taskPromises.push(pool.runTask(taskId, payload));
  }

  const results = await Promise.all(taskPromises);

  console.timeEnd("withPool");

  console.log("\nSample (pool) - first 5:");
  results.slice(0, 5).forEach((r) => {
    console.log(
      `task ${r.taskId} -> result=${r.result} (worker ${r.workerId}, ${r.timeTaken}ms)`
    );
  });

  pool.printStats();
  await pool.close();
}

async function main() {
  const TASKS = 65;

  runWithoutWorkers(TASKS);
  await runWithPool(TASKS);
}

main();
