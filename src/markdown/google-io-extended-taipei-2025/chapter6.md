---
title: "部署至 Google Cloud Run"
summary: ""
---

# 將 ADK 應用程式部署到 Cloud Run

本文件說明如何將 Agent Development Kit (ADK) 應用程式部署到 Google Cloud Run。Cloud Run 是一個全代管平台，可讓您執行容器化的應用程式。

## 部署方法

主要有兩種部署方法：

1.  **使用 `adk` 命令列介面 (CLI) (建議用於 Python)**：
    * 為 Python agent 提供簡化的部署流程。
    * 提供最小和完整的命令範例，並可選擇啟用使用者介面。

2.  **使用標準 `gcloud` CLI (建議用於 Java)**：
    * 需要使用 `Dockerfile` 進行更多手動設定。
    * 提供更大的靈活性。

## 專案結構與設定

* **Python Agent**:
    * 需注意 `agent` 程式碼的放置位置。
    * 使用 `__init__.py` 檔案。
* **Java Agent**:
    * 遵循特定的類別和變數命名慣例。
* **環境變數**:
    * 設定您的 Google Cloud 專案 ID、位置和其他組態。

## 部署步驟

* **使用 `adk` CLI**:
    * 提供帶有必要參數的最小命令。
    * 提供帶有可選旗標的完整命令以進行自訂（例如啟用 UI）。

* **使用 `gcloud` CLI**:
    * **Python**: 建立 `main.py` 和 `requirements.txt` 檔案。
    * **Java**: 建立 `pom.xml` 檔案。
    * 建立一個 `Dockerfile` 來定義容器映像。
    * 文件也說明如何在單一 Cloud Run 執行個體中部署多個 agent。

## 測試已部署的 Agent

您可以透過以下方式測試已部署的 agent：

* **Web UI**: 如果在部署期間啟用，可透過網頁介面進行測試。
* **程式化**: 使用 `curl` 等工具發送 API 請求。

文件說明了如何：
* 列出可用的應用程式。
* 建立工作階段。
* 執行 agent。
* 如果服務不是公開的，如何處理身份驗證。