# RenewHelper 自定义 Webhook 配置教程

RenewHelper 支持高度自定义的 Webhook 配置，允许您对接 Slack、Discord、飞书、钉钉、企业微信等任意支持 HTTP POST 请求的平台。

## 基本概念

在 **设置 -> 通知配置 -> Webhook** 中，您会看到以下新选项：

### 1. **请求头 (Headers)**
- **格式**: JSON 对象
- **作用**: 定义 HTTP 请求头，常用于鉴权或指定内容类型。
- **默认值**: `{"Content-Type": "application/json"}` (如果不填)

### 2. **消息体 (Body Template)**
- **格式**: 字符串 (通常是 JSON 字符串)
- **作用**: 定义发送给服务器的数据结构。
- **变量**: 您可以使用以下占位符，发送时会被自动替换为实际内容：
    - `{title}`: 消息标题 (例如 "RenewHelper 报告")
    - `{body}`: 消息正文 (多行文本)

---

## 常用平台配置示例

### 1. standard (默认)
如果您不需要对接特定平台，只需填写 **Server URL** 即可。
- **Body 默认为**: `{"title": "{title}", "content": "{body}"}`

### 2. Lark / Feishu (飞书)
飞书机器人接收 JSON 格式的消息 (`msg_type="text"` or `"interactive"`).

- **Server URL**: `https://open.feishu.cn/open-apis/bot/v2/hook/xxxx...`
- **Headers**: (留空即可)
- **Body Template**:
```json
{
    "msg_type": "text",
    "content": {
        "text": "{title}\n\n{body}"
    }
}
```

### 3. DingTalk (钉钉)
钉钉机器人需要 `markdown` 或 `text` 类型。推荐使用 markdown。

- **Server URL**: `https://oapi.dingtalk.com/robot/send?access_token=xxxx...`
- **Headers**: (留空即可)
- **Body Template**:
```json
{
    "msgtype": "markdown",
    "markdown": {
        "title": "{title}",
        "text": "# {title}\n\n{body}"
    }
}
```

### 4. WeCom (企业微信)
企业微信机器人支持 markdown。

- **Server URL**: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx...`
- **Headers**: (留空即可)
- **Body Template**:
```json
{
    "msgtype": "markdown",
    "markdown": {
        "content": "<font color=\"warning\">{title}</font>\n\n{body}"
    }
}
```

### 5. Slack
Slack Incoming Webhook 格式。

- **Server URL**: `https://hooks.slack.com/services/T000/B000/XXXX`
- **Headers**: (留空即可)
- **Body Template**:
```json
{
    "text": "*{title}*\n{body}"
}
```

### 6. Discord
Discord Webhook 格式。

- **Server URL**: `https://discord.com/api/webhooks/xxxx/xxxx`
- **Headers**: (留空即可)
- **Body Template**:
```json
{
    "content": "**{title}**\n>>> {body}"
}
```

### 7. Bark (自定义 Payload)
虽然 RenewHelper 内置了 Bark 支持，但如果您想通过 Webhook 方式更精细控制（如设置铃声、图标）：

- **Server URL**: `https://api.day.app/push`
- **Headers**: (留空即可)
- **Body Template**:
```json
{
    "device_key": "YOUR_KEY",
    "title": "{title}",
    "body": "{body}",
    "sound": "minuet",
    "icon": "https://example.com/icon.png"
}
```

---

## 调试建议
1. 先点击 **"发送测试" (Test)** 按钮，确认配置是否正确。
2. 如果发送失败，请检查 JSON 格式是否正确 (所有的 Key 和 String Value 必须用双引号 `"` 包裹)。
3. 使用 `{title}` 和 `{body}` 时，系统会自动处理转义（例如正文中的换行符），您无需手动转义。
