<div align="center">

<img width="180" height="180" alt="image" src="https://github.com/user-attachments/assets/8adeeae2-3268-4930-b605-4031e451b263" />

# 🎬 EHSAAN MOVIE

### Your personal movie & series hub. Completely Open Source

## **In Development Stage**

<a href="https://www.youtube.com/watch?v=gPZd-t4EcNs" target="_blank">
  <img
    width="200"
    src="https://github.com/user-attachments/assets/bf633cc6-a8ed-4fca-b7b1-1aef2df991d3"
    alt="Watch EHSAAN MOVIE Demo Video"
  />
</a>

<p>
  <a href="https://ehsaancolour.ai.studio/" target="_blank">
    <img height="70" src="https://github.com/user-attachments/assets/102323a5-e5f2-4174-8a25-7be76d1ef7d3" />
  </a>
  <a href="https://ehsaanflow.ai.studio/" target="_blank">
    <img height="70" src="https://github.com/user-attachments/assets/934bccf2-cafa-4494-a773-dd315ab51ccf" />
  </a>
  <a href="https://ehsaanqr.ai.studio/" target="_blank">
    <img height="70" src="https://github.com/user-attachments/assets/1f63c7f3-7c86-45fd-9af6-ed9b14805820" />
  </a>
  <a href="https://ehsaanmovie.ai.studio/" target="_blank">
   <img height="70" src="https://github.com/user-attachments/assets/7e3c4963-7c62-4175-9a77-b389a78a42e6" />
  </a>
  <a href="https://ehsaancompress.ai.studio/" target="_blank">
   <img height="70" src="https://github.com/user-attachments/assets/de9dd1ed-3480-442f-af74-62c3924dd747" />
</p>
<br>

# A beautiful, minimal, and personal space to discover, organize, and manage your movies & series.
#  [**ehsaanmovie.ai.studio**](https://ehsaanmovie.ai.studio/)


</div>

## I am using the google cloud console to publish this app as a web-interface

### ✦ What it does

* 🎞️ **Discover** movies & series with universal search
* 🔎 **Search** rich movie data and posters
* ❤️ **Watchlist** your personal collection
* ⭐ **Rate** what you watch
* 🏷️ **Organize** with genres, status & personal notes
* 📊 **Track** your watching journey
* 💾 **Local-first** — your collection stays in your browser

### ✨ Philosophy

**Simple to use. Beautiful to look at. Yours to manage.**

EHSAAN MOVIE is built as a personal entertainment hub — combining a clean interface with the features you actually need to manage your movie and series collection.

## 💡 TIPS

- **Start with shortcuts** — Assign keyboard shortcuts to pages for smooth, quick navigation.
- **Make it yours** — Create custom genre themes that match your personal taste.
- **Keep it clean** — De-clutter your Movie Preview and Settings pages using the built-in editing tools.
---

### 🛠️ Built With

`HTML` · `CSS` · `JavaScript` · `TMDB API` · `Local Storage` . `Vite` . `React` . `Typescript`

---

## 🎥 Preview

<img width="1362" height="642" alt="image" src="https://github.com/user-attachments/assets/67b09696-9899-4509-bad7-b46a8bc9beae" />

<img width="1365" height="743" alt="image" src="https://github.com/user-attachments/assets/5b269f73-12b9-49fa-a3c6-9c20bb6f0b4e" />

<img width="1366" height="542" alt="image" src="https://github.com/user-attachments/assets/a2e7b9b5-e3e3-4d2a-a58b-0a3637d03e27" />

<details>
<summary>View More Screenshots</summary>

<img width="1084" height="630" alt="image" src="https://github.com/user-attachments/assets/0be3eea2-9d80-4acb-84a6-bfd4ccc4cdfc" />

<img width="1366" height="670" alt="image" src="https://github.com/user-attachments/assets/171492be-b2c4-4878-a71c-fcdde32132c1" />

<img width="1366" height="644" alt="image" src="https://github.com/user-attachments/assets/fc10ddb1-0d12-4e8f-babb-e7a3821be4b9" />

<img width="1366" height="575" alt="image" src="https://github.com/user-attachments/assets/93e7d9cc-3cf5-40a5-a31d-b0caaa6588d2" />

<img width="1366" height="741" alt="image" src="https://github.com/user-attachments/assets/299aaf6e-9a76-40b7-b4a0-9dc16da83021" />

<img width="1366" height="722" alt="image" src="https://github.com/user-attachments/assets/7fa24011-8b39-46e7-ba69-8ce89ed18dcf" />

<img width="1366" height="543" alt="image" src="https://github.com/user-attachments/assets/9be196a5-4741-4661-8b6d-1f9b581b45e9" />

<img width="1366" height="701" alt="image" src="https://github.com/user-attachments/assets/af53afc7-932b-4b9c-8906-944e8cb0d5be" />

<img width="1298" height="728" alt="image" src="https://github.com/user-attachments/assets/0ee180c6-06bc-449e-ae5d-10f38ecb519b" />

</details>

---

## 🗂️ Data Management

EHSAAN Movie keeps **personal user data** separate from **TMDB artwork**, so your library stays lightweight while giving you control over offline artwork.

```text
EHSAAN MOVIE
│
├── 👤 PERSONAL USER DATA
│   │
│   ├── Watchlist & watched status
│   ├── Episode progress & seasonal checkmarks
│   ├── Star ratings & personal notes
│   ├── Custom lists & activities
│   └── Preferences & custom genre palettes
│
│   → Stored locally in browser localStorage
│   → Uses versioned storage keys
│   → Never stores base64 images or image blobs
│   → Compact JSON export for backup
│
└── 🎨 TMDB ARTWORK
    │
    ├── 🌐 ONLINE MODE · Default
    │   │
    │   ├── Posters & backdrops load from TMDB when needed
    │   ├── No intentional permanent image archive
    │   └── Helps prevent uncontrolled storage growth
    │
    └── 📦 OFFLINE MODE
        │
        ├── Artwork stored in a dedicated browser cache
        ├── "Download Artwork for My Library"
        │   saves artwork for your library
        ├── Automatic cache capacity limits
        └── LRU-based trimming removes older unused artwork
```

> **Privacy first:** Your personal library data stays in your browser. Artwork caching is handled separately, so image data does not become part of your personal-data backup.

### 💾 Backup

Your personal data can be exported as a **compact JSON backup**.
Artwork is **not included** in the JSON export, keeping backups small and portable.

---

## THIS PROJECT IS FOR PERSONAL USE ONLY IT DOES NOT STORE ANY DATABASE OF MOVIES AND POSTERS. IT USES TMDB API BUT NOT ENDORSED AND CERTIFY BY TMDB.

<div align="center">

## MADE BY EHSAAN ULLAH
**Make useful things. Make them feel good to use.**

# 💛 SUPPORT THE DEVELOPMENT
## [ CLICK HERE TO PAY DIRECTLY.](https://ehsaan.odoo.com/support)

<img width="250" height="250" alt="ehsaan-qr-1024x1024 (1)" src="https://github.com/user-attachments/assets/7139284e-c5e5-424a-bd52-aa71ccc392a8" />
</p>

<p align="center">
  <sub>If you find something useful here, a ⭐ is always appreciated.</sub>
</p>


## **EHSAAN ULLAH**

<a href="mailto:worsmon@gmail.com">
  <img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
</a>
&nbsp;
<a href="https://github.com/ehsaanullah0">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>
&nbsp;
<a href="https://ehsaan.odoo.com/">
  <img src="https://img.shields.io/badge/Website-0A84FF?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Website">
</a>

<sub>Built with curiosity, too many tabs, and the occasional “let's see what happens.”</sub>

</div>
