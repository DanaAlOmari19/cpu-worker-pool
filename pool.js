const { Worker } = require("worker_threads");

class WorkerPool {
  constructor(poolSize = 4) {
    this.poolSize = poolSize;

    this.workers = [];
    this.idleWorkers = [];
    this.taskQueue = [];

    this.stats = new Map();

    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker("./worker.js");
      worker._id = i + 1;
      worker._currentTask = null;

      this.stats.set(worker._id, { count: 0, totalTime: 0 });

      worker.on("message", (msg) => {
        const { taskId, result, timeTaken } = msg;

        const currentTask = worker._currentTask;
        if (currentTask) {
          const s = this.stats.get(worker._id);
          const t = Number(timeTaken);

          s.count += 1;
          s.totalTime += t;

          currentTask.resolve({
          taskId,
          result,
          timeTaken: t,
          workerId: worker._id,
        });


          worker._currentTask = null;
        }

        this.idleWorkers.push(worker);
        this._runNext();
      });

      worker.on("error", (err) => {
        if (worker._currentTask) {
          worker._currentTask.reject(err);
          worker._currentTask = null;
        }
        this.idleWorkers.push(worker);
        this._runNext();
      });

      this.workers.push(worker);
      this.idleWorkers.push(worker);
    }
  }

  runTask(taskId, payload) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ taskId, payload, resolve, reject });
      this._runNext();
    });
  }

  _runNext() {
    if (this.taskQueue.length === 0) return;
    if (this.idleWorkers.length === 0) return;

    const worker = this.idleWorkers.shift();
    const task = this.taskQueue.shift();

    worker._currentTask = task;

    worker.postMessage({ taskId: task.taskId, payload: task.payload });
  }

  printStats() {
    console.log("\n=== Stats ===");
    for (const [workerId, s] of this.stats.entries()) {
      const avg = s.count === 0 ? 0 : Math.round(s.totalTime / s.count);
      console.log(`Worker ${workerId}: tasks=${s.count}, avgTime=${avg}ms`);
    }
  }

  async close() {
    for (const w of this.workers) {
      await w.terminate();
    }
  }
}

module.exports = WorkerPool;
