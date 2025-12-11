# 🚀 GUIA PASSO-A-PASSO: Publicar no Netlify

Vou guiá-lo manualmente (Git precisa ser instalado primeiro).

---

## ⚠️ PASSO PRÉVIO: Instalar Git (se não tiver)

1. Acesse [git-scm.com](https://git-scm.com/download/win)
2. Baixe o instalador para Windows
3. Execute e siga as instruções (deixe tudo padrão)
4. Reinicie o PC

Depois continue abaixo...

---

## 📍 PASSO 1: Preparar Repositório Git

Abra PowerShell/CMD na pasta do projeto e execute:

```powershell
cd "C:\Users\Lorena Escobar\Desktop\Pessoal\App Pessoal"
git init
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
git add .
git commit -m "app-lembretes v1.0"
git branch -M main
```

**Resultado esperado**: 
```
[main (root-commit) xxxxx] app-lembretes v1.0
 XX files changed, XXX insertions(+)
```

---

## 📍 PASSO 2: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
   - Se não tem conta, crie uma em [github.com/signup](https://github.com/signup)

2. Clique em **"+"** (canto superior direito)

3. Selecione **"New repository"**

4. Preencha:
   - **Repository name**: `app-lembretes`
   - **Description**: `Gestor de lembretes pessoais com Firebase`
   - Selecione **"Public"**
   
5. Clique em **"Create repository"**

6. Você verá uma página com 2 opções:
   - Selecione **"…or push an existing repository from the command line"**
   
7. Copie as 3 linhas de código mostradas (algo como):
   ```
   git remote add origin https://github.com/SEU_USUARIO/app-lembretes.git
   git branch -M main
   git push -u origin main
   ```

---

## 📍 PASSO 3: Upload para GitHub

No PowerShell, execute as 3 linhas que você copiou:

```powershell
git remote add origin https://github.com/SEU_USUARIO/app-lembretes.git
git branch -M main
git push -u origin main
```

(Substitua `SEU_USUARIO` pelo seu username do GitHub)

**Resultado esperado**:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
...
To https://github.com/SEU_USUARIO/app-lembretes.git
 * [new branch]      main -> main
```

✅ Seu código agora está no GitHub!

---

## 📍 PASSO 4: Deploy no Netlify

1. Acesse [app.netlify.com](https://app.netlify.com)

2. Clique em **"Sign up"**
   - Escolha **"Sign up with GitHub"**
   - Autorize o acesso

3. Na dashboard, clique em **"Add new site"**

4. Selecione **"Import an existing project"**

5. Conecte seu GitHub:
   - Clique em **"GitHub"**
   - Autorize Netlify a acessar seus repositórios

6. Selecione seu repositório:
   - Procure por **"app-lembretes"**
   - Clique nele

7. Configure o deploy:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Clique em **"Deploy site"**

8. Aguarde 1-2 minutos...

✅ **Seu app está online!**

---

## 🎉 Seu App Está Publicado!

Netlify gerará uma URL como:
```
https://seu-site.netlify.app
```

Você pode ver em:
- **Site name** na dashboard do Netlify
- Clique em **"Site settings"** para customizar o nome

---

## ✅ Teste Seu App

1. Acesse a URL publicada
2. Tente adicionar um lembrete
3. Verifique se aparece no [Firebase Console](https://console.firebase.google.com)
4. **Compartilhe a URL!** 🌐

---

## 🎁 Bonus: Customizar Nome da URL

1. No Netlify, acesse seu site
2. Vá em **"Site settings"**
3. Em **"Site details"**, clique em **"Change site name"**
4. Escolha um nome único (ex: `meus-lembretes-lorena`)
5. Nova URL: `https://meus-lembretes-lorena.netlify.app`

---

## 🆘 Se der erro...

### "Git não reconhecido"
→ Instale Git de [git-scm.com](https://git-scm.com) e reinicie o PC

### "Permission denied" no GitHub
→ Gere um Personal Access Token em [github.com/settings/tokens](https://github.com/settings/tokens)
→ Use o token como senha

### "Build failed" no Netlify
→ Verifique o log de deploy no Netlify
→ Contate o suporte ou verifique DEPLOY.md

---

## 📞 Precisa de ajuda?

- Consulte [DEPLOY.md](DEPLOY.md) para mais detalhes
- Verifique [Documentação Netlify](https://docs.netlify.com)
- Abra issue no GitHub

---

**Parabéns! Você conseguiu! 🚀**
