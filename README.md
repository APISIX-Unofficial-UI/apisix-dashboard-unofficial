# Apisix Dashboard Unofficial

**项目状态：** 当前项目仍在开发中，目标是发布第一个可用版本。

## 项目简介

由于官方 APISIX Dashboard 长期无人维护，且在 APISIX 3.9 及后续版本上已无法正常运行，**apisix-dashboard-unofficial** 项目旨在为 Apache APISIX 提供一个可持续发展的前端管理面板。该项目采用 **TypeScript + Vue** 技术栈开发，遵循云原生理念，我们的目标是将其打磨得比官方版本拥有更丰富的功能、更优的使用体验和更高的稳定性，从而真正适用于生产环境。

## 快速开始

你可以直接使用 [预览地址](https://apisix-dashboard.lensual.space/) 体验。推荐使用 yarn 或 pnpm 进行依赖管理。

### 安装依赖

在项目根目录下执行：

```bash
yarn
```

### 启动测试环境

```bash
yarn run dev
```

## 项目路线图

详见：[Roadmap](https://github.com/APISIX-Unofficial-UI/apisix-dashboard-unofficial/tree/main/docs/roadmap_2025_zh.md)

## FAQ

**问题：** 登录时控制台报错如下信息：

```
Mixed Content: The page at 'xxx' was loaded over HTTPS, but requested an insecure script 'xxx'. This request has been blocked; the content must be served over HTTPS.
```

**原因及解决方案：**

由于 Apisix Admin API 使用 HTTP，而当前页面为 HTTPS，浏览器安全策略不允许混合内容加载。建议使用其他工具将 Apisix 端口映射到本地，例如将 `192.168.233.11:9180` 映射到 `127.0.0.1:9180`，然后使用 `http://127.0.0.1:9180` 进行访问。

---

欢迎大家参与 **apisix-dashboard-unofficial** 项目的开发，共同为更好的 APISIX 网关管理体验而努力！

