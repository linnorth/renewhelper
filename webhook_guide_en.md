# RenewHelper Custom Webhook Configuration Guide

RenewHelper supports highly customizable Webhook configurations, allowing you to integrate with Slack, Discord, Feishu, DingTalk, WeCom, or any platform that supports HTTP POST requests.

## Basic Concepts

In **Settings -> Notifications -> Webhook**, you will see the following options:

### 1. **Headers (JSON)**
- **Format**: JSON Object
- **Purpose**: Defines HTTP request headers, commonly used for authentication or specifying content types.
- **Default**: `{"Content-Type": "application/json"}` (if left empty)

### 2. **Body Template (JSON)**
- **Format**: String (usually a JSON string)
- **Purpose**: Defines the data structure sent to the server.
- **Variables**: You can use the following placeholders, which will be automatically replaced with actual content when sending:
    - `{title}`: Message Title (e.g., "RenewHelper Report")
    - `{body}`: Message Body (Multi-line text)

---

## Configuration Examples

### 1. Standard (Default)
If you don't need to integrate with a specific platform, just fill in the **Server URL**.
- **Default Body**: `{"title": "{title}", "content": "{body}"}`

### 2. Lark / Feishu
Feishu bots receive messages in JSON format (`msg_type="text"` or `"interactive"`).

- **Server URL**: `https://open.feishu.cn/open-apis/bot/v2/hook/xxxx...`
- **Headers**: (Leave empty)
- **Body Template**:
```json
{
    "msg_type": "text",
    "content": {
        "text": "{title}\n\n{body}"
    }
}
```

### 3. DingTalk
DingTalk bots require `markdown` or `text` type. Markdown is recommended.

- **Server URL**: `https://oapi.dingtalk.com/robot/send?access_token=xxxx...`
- **Headers**: (Leave empty)
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

### 4. WeCom (Enterprise WeChat)
WeCom bots support markdown.

- **Server URL**: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx...`
- **Headers**: (Leave empty)
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
Slack Incoming Webhook format.

- **Server URL**: `https://hooks.slack.com/services/T000/B000/XXXX`
- **Headers**: (Leave empty)
- **Body Template**:
```json
{
    "text": "*{title}*\n{body}"
}
```

### 6. Discord
Discord Webhook format.

- **Server URL**: `https://discord.com/api/webhooks/xxxx/xxxx`
- **Headers**: (Leave empty)
- **Body Template**:
```json
{
    "content": "**{title}**\n>>> {body}"
}
```

### 7. Bark (Custom Payload)
Although RenewHelper has built-in Bark support, use this if you want finer control via Webhook (e.g., setting sounds or icons):

- **Server URL**: `https://api.day.app/push`
- **Headers**: (Leave empty)
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

## Debugging Tips
1. Click the **"Send Test"** button first to verify if the configuration is correct.
2. If sending fails, check if the JSON format is correct (All Keys and String Values must be wrapped in double quotes `"`).
3. When using `{title}` and `{body}`, the system automatically handles escaping (e.g., newlines in the body), so you don't need to manually escape them.
