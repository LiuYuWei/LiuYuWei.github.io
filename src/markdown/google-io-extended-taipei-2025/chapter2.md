---
title: "開發環境設定"
summary: "開啟 Google Cloud Shell 編輯器進行後續開發、部署作業"
---

# 如何開啟 Google Cloud Shell Editor

## 步驟 1：啟動 Cloud Shell
1. 登入 [Google Cloud Console](https://console.cloud.google.com)。
2. 在右上角工具列，點擊 **Cloud Shell** 圖示，啟動交互式終端機。
![Cloud Shell 啟動 [hint: cloud console]](/images/chapter2/google-cloud-console-activate-shell.png)

## 步驟 2：開啟 Cloud Shell Editor
1. 在 Cloud Shell 視窗的工具列，點擊**Open Editor**。
2. 編輯器會自動在終端機上方開啟，呈現檔案總管、程式碼編輯區及整合終端機。

## 步驟 3：使用 `cloudshell` 命令直接開啟檔案
```bash
# 編輯現有檔案，例如 README-cloudshell.txt
cloudshell edit README-cloudshell.txt
```

## 步驟 4：上傳與下載檔案

1. 在左側檔案總管（Explorer）中，右鍵點擊檔案或資料夾，選擇 **Download** 或 **Upload**。
2. ![上傳檔案介面 [hint: file upload]](https://cloud.google.com/static/shell/docs/images/upload-file-to-cloud-shell-project.png)

## 小技巧

* 可直接在瀏覽器打開：`https://ide.cloud.google.com`
* 按下 `Ctrl/Cmd + B` 可隱藏或顯示側邊欄。
