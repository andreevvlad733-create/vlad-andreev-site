# Site Vlad Andreev, fotograf

Site static, fără build. Realizat de markadic.ro.

- `continut/site.json`: pozele din portofoliu și albumele. Se editează din Pages CMS (https://app.pagescms.org), configurat în `.pages.yml`.
- `img/`: pozele urcate. `img-mic/`: copiile de 800 px. Le face `.github/workflows/publica.yml` (rulează `unelte/poze.mjs` și micșorează pozele peste 2400 px).
- `index.html`, `album.html`, `style.css`, `site.js`: pagina, albumele și traducerea RO / EN (dicționarul `EN` din `site.js`).
- Publicare: același `publica.yml` urcă site-ul prin FTP pe găzduirea lui Vlad la fiecare salvare din panou. Secrete: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`; variabile opționale `FTP_DIR`, `FTP_PROTOCOL`. Fără secrete, urcarea se sare.
- Vlad intră în panou ca colaborator, invitat pe e-mail din Pages CMS (Collaborators); nu are nevoie de cont GitHub.
