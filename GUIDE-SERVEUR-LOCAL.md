# Guide : Lancer un serveur local pour Lexio

Pour des raisons de sécurité, les navigateurs web bloquent le chargement de fichiers externes (comme les listes de mots au format JSON) lorsque vous ouvrez directement un fichier HTML local (`index.html`) depuis votre explorateur de fichiers (ce qui donne une adresse du type `file:///C:/...`). C'est ce qu'on appelle la politique CORS (Cross-Origin Resource Sharing).

Pour utiliser Lexio, vous devez **servir** l'application via un serveur web local. Voici trois manières simples de faire cela.

---

## Option 1 : Utiliser l'extension VS Code "Live Server" (Recommandé)

C'est la méthode la plus simple si vous utilisez Visual Studio Code.

1. Ouvrez Visual Studio Code.
2. Ouvrez le dossier du projet : **Fichier** > **Ouvrir le dossier...** > Sélectionnez `c:\Users\sarah\Desktop\App`.
3. Allez dans l'onglet des extensions à gauche (ou appuyez sur `Ctrl+Shift+X`).
4. Recherchez **Live Server** (créé par *Ritwick Dey*) et cliquez sur **Installer**.
5. Une fois installée, ouvrez le fichier `index.html`.
6. Cliquez sur le bouton **Go Live** tout en bas à droite de la fenêtre de VS Code (dans la barre d'état bleue).
7. Votre navigateur s'ouvrira automatiquement à l'adresse du serveur local (généralement `http://127.0.0.1:5500/index.html`).

---

## Option 2 : Utiliser Python

Si Python est installé sur votre ordinateur, vous pouvez lancer un serveur en une seule ligne de commande.

1. Ouvrez votre terminal (PowerShell ou Invite de commandes).
2. Déplacez-vous dans le dossier du projet :
   ```powershell
   cd c:\Users\sarah\Desktop\App
   ```
3. Lancez le serveur local avec la commande suivante :
   ```powershell
   python -m http.server 8000
   ```
4. Ouvrez votre navigateur internet et allez à l'adresse :
   [http://localhost:8000](http://localhost:8000)

---

## Option 3 : Utiliser Node.js / npx

Si vous préférez utiliser Node.js :

1. Ouvrez votre terminal.
2. Déplacez-vous dans le dossier du projet :
   ```powershell
   cd c:\Users\sarah\Desktop\App
   ```
3. Lancez un serveur temporaire avec la commande :
   ```powershell
   npx http-server -p 8000
   ```
4. Ouvrez votre navigateur internet et allez à l'adresse :
   [http://localhost:8000](http://localhost:8000)
