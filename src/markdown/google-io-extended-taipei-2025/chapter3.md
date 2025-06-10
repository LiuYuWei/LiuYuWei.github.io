---
title: "Google ADK 基礎設定"
summary: "帶你用最簡單的方式，設定 Google ADK Server"
---

## Quickstart Tutorial 概覽

1. **環境建置**  
   - 建立 Python 3.9+ 虛擬環境  
   - 安裝套件：  
     ```bash
     python -m venv .venv
     source .venv/bin/activate   # macOS/Linux
     pip install google-adk
     ```
2. **專案結構**  
   ```text
   parent_folder/
   └── multi_tool_agent/
       ├── __init__.py
       ├── agent.py
       └── .env
   ```  
   - `agent.py` 中示範以下工具函式：  
     ```python
     def get_weather(city: str) -> dict: ...
     def get_current_time(city: str) -> dict: ...
     ```
3. **模型設定**  
   - 在 `.env` 設定金鑰與模式：  
     ```dotenv
     GOOGLE_API_KEY=PASTE_YOUR_API_KEY
     GOOGLE_GENAI_USE_VERTEXAI=FALSE
     ```
   - 若使用 Vertex AI，將 `USE_VERTEXAI` 參數設為 `TRUE` 並補充專案資訊  
4. **執行與測試**  
   - **啟動 Dev UI**：  
     ```bash
     adk web
     ```  
     選擇代理後，可透過文字或語音互動  
   - **追蹤事件**：  
     在 `Events` 分頁檢視每次函式呼叫、回應與 Trace 日誌  
   - **其他運行方式**：  
     - 終端機互動：`adk run`  
     - 啟動 API 服務：`adk api_server`  