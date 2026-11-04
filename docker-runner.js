/**
 * RenewHelper Adapter: docker-runner.js
 * Author: LOSTFREE
 * Features: 以Miniflare模拟环境做为worker启动器，实现Docker环境运行
 *
 */
import { Miniflare, Log, LogLevel } from "miniflare";
import cron from "node-cron";

// 1. 获取 Docker 环境变量
const PORT = parseInt(process.env.PORT || "9787");
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || "admin"; // 默认密码
// 不要修改Cron！！！
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/5 * * * *"; 

async function start() {
  // 2. 初始化 Miniflare
  const mf = new Miniflare({
    // 指定你的 Worker 文件名
    scriptPath: "./_worker.js",
    modules: true, // 开启 ES Modules 模式

    // 网络配置
    host: "0.0.0.0",
    port: PORT,

    // 环境变量注入 (Bindings)
    // 这里把 docker-compose 里的 AUTH_PASSWORD 传给 worker 的 env.AUTH_PASSWORD
    bindings: {
      AUTH_PASSWORD: AUTH_PASSWORD,
    },

    // KV 存储配置 (对应 env.RENEW_KV)
    kvNamespaces: ["RENEW_KV"],
    // 数据持久化路径，映射到容器内的 /data/kv
    kvPersist: "/data/kv",

    // 日志配置
    log: new Log(LogLevel.INFO),
  });

  console.log(`\n🚀 RenewHelper running inside Docker!`);
  console.log(`⏰ Cron Schedule: ${CRON_SCHEDULE}`);
  console.log(`📂 Data Dir: /data/kv`);
  console.log(`👉 Access: http://localhost:${PORT}\n`);

  // 启动服务
  await mf.ready;
  // 3.使用 Node.js 手动触发 Cron
  const task = cron.schedule(CRON_SCHEDULE, async () => {
    console.log(`\n[Cron] ⏰ Time match! Triggering Worker scheduled event...`);
    try {

      const worker = await mf.getWorker();
      await worker.scheduled({
        cron: CRON_SCHEDULE,
        scheduledTime: Date.now(),
      });
      
    } catch (e) {
      console.error(`[Cron] ❌ Trigger failed:`, e);
    }
  });
  
  task.start();  
}

start().catch((err) => {
  console.error("❌ Startup failed:", err);
  process.exit(1);
});