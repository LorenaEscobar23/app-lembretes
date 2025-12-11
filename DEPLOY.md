# 🚀 Guia de Publicação - Gestor de Lembretes

Seu app está pronto para publicação! Escolha uma opção abaixo:

## ⭐ Opção 1: Vercel (Recomendado - Mais Fácil)

### Passo 1: Criar conta no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub" ou use email

### Passo 2: Deploy
1. Na dashboard, clique em "Add New..."
2. Selecione "Project"
3. Importe seu repositório GitHub
4. Clique em "Deploy"

**Pronto!** Seu app estará online em minutos.

### Domínio Customizado
1. No Vercel, vá em "Settings" → "Domains"
2. Adicione seu domínio
3. Configure os DNS conforme instruído

---

## ⭐ Opção 2: Netlify (Muito Fácil)

### Passo 1: Preparar o projeto
```bash
npm run build
```

### Passo 2: Deploy
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "Sign up"
3. Use GitHub para autenticação
4. Clique em "Connect to Git"
5. Selecione seu repositório
6. Clique em "Deploy"

**Pronto!** URL automática gerada.

### Configurar domínio
1. Em "Settings" → "Domain Management"
2. Clique em "Add custom domain"
3. Siga as instruções

---

## ⭐ Opção 3: Firebase Hosting (Integrado com seu banco)

### Passo 1: Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### Passo 2: Fazer login
```bash
firebase login
```

### Passo 3: Inicializar Firebase
```bash
firebase init hosting
```

Escolha:
- **Project**: app-lembretes-55c7d
- **Public directory**: dist
- **Single-page app**: Yes
- **Overwrite index.html**: No

### Passo 4: Build e Deploy
```bash
npm run build
firebase deploy
```

**URL gerada**: `https://app-lembretes-55c7d.firebaseapp.com`

---

## 🌐 Opção 4: GitHub Pages (Gratuito)

### Passo 1: Atualizar vite.config.js
```javascript
export default {
  base: '/app-lembretes/',  // seu repositório
  // ... resto da config
}
```

### Passo 2: Instalar gh-pages
```bash
npm install --save-dev gh-pages
```

### Passo 3: Atualizar package.json
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Passo 4: Deploy
```bash
npm run deploy
```

**URL**: `https://seu-username.github.io/app-lembretes`

---

## 🔒 Variáveis de Ambiente

Para segurança, use arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSyBUXaghb1jEjpojzA7TqapwgQK6aFOm36Y
VITE_FIREBASE_AUTH_DOMAIN=app-lembretes-55c7d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=app-lembretes-55c7d
VITE_FIREBASE_DATABASE_URL=https://app-lembretes-55c7d-default-rtdb.firebaseio.com
```

Atualize `src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: "app-lembretes-55c7d.firebasestorage.app",
  messagingSenderId: "663983659382",
  appId: "1:663983659382:web:f8476b4049aa882c6d8257"
};
```

---

## ✅ Checklist Pré-Deploy

- [ ] Firebase Realtime Database criado
- [ ] Regras de segurança configuradas
- [ ] Build compilado sem erros (`npm run build`)
- [ ] Teste local funciona (`npm run dev`)
- [ ] Credenciais Firebase corretas
- [ ] Domínio customizado planejado (opcional)

---

## 🎯 Recomendação

**Use Vercel ou Netlify** para:
- Máxima facilidade
- Deploy automático com Git
- HTTPS grátis
- Domínio customizado simples
- Suporte excelente

**Use Firebase Hosting** se:
- Quiser integração com Firebase
- Já usa Firebase para tudo
- Quer uma URL curta

---

## 🚨 Após Deploy

### Testar em Produção
1. Acesse seu URL publicado
2. Teste adicionar um lembrete
3. Verifique se os dados aparecem no Firebase Console

### Monitorar Performance
- Vercel/Netlify: Dashboard automático
- Firebase: Console Analytics

### Configurar Custom Domain
1. Compre um domínio (Namecheap, GoDaddy, etc)
2. Aponte os nameservers para sua plataforma
3. Ative HTTPS automático

---

## 💡 Dicas

- Mantenha `.env` seguro (nunca commit no GitHub)
- Use branches para desenvolvimento
- Configure CI/CD para testes automáticos
- Monitore erros em produção

---

**Parabéns! Seu app está pronto para o mundo! 🎉**
