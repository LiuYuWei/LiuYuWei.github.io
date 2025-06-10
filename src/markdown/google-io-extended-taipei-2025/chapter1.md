---
title: "Google ADK 簡介"
summary: "介紹 Google ADK 頁面"
---

# Agent Development Kit (ADK) 簡介

![ADK 流程圖](https://google.github.io/adk-docs/assets/quickstart-flow-tool.png)

ADK（Agent Development Kit）是 Google 推出的開發套件，提供統一的 API、CLI 與 Dev UI，協助開發者快速構建並部署具備多工具呼叫能力的智慧代理。核心功能包含：
- **多工具整合**：定義並註冊自訂函式（tools），LLM 可透過 function calling 機制動態調用  
- **即時測試**：支援終端機互動（`adk run`）與瀏覽器 Dev UI（`adk web`），並提供事件與延遲追蹤  
- **部署靈活**：本地運行、API Server（`adk api_server`），或部署至 Google Cloud Run / GKE  

![開發者介面示意](https://google.github.io/adk-docs/assets/adk-web-dev-ui-chat.png)

