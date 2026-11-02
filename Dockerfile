FROM node:20-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    # 清理缓存减小体积
    rm -rf /var/lib/apt/lists/*

# 安装依赖
COPY package-docker.json ./package.json
# 使用 npm 安装，国内如果慢可以在 build 时加代理或换源
RUN npm install

# 复制脚本和代码
COPY docker-runner.js .
COPY _worker.js .

# 创建数据目录
RUN mkdir -p /data/kv

EXPOSE 9787

CMD ["npm", "start"]