# 🔔 Notificações e PWA - Guia Completo

## O que foi implementado

O app agora suporta **notificações push no celular** e pode ser instalado como um aplicativo nativo!

### ✨ Funcionalidades

1. **Notificações de Lembretes Próximos**
   - Notifica quando um lembrete está a 15 minutos do vencimento
   - Alerta quando um lembrete venceu
   - Vibração automática (em celulares com suporte)

2. **Notificações de Ações**
   - Notifica quando você adiciona um novo lembrete
   - Notifica quando marca um lembrete como concluído
   - Notifica quando adiciona um filme/livro

3. **Modo Offline**
   - O app funciona offline após a primeira visita
   - Service Worker armazena em cache os assets essenciais
   - Sincroniza dados automaticamente quando volta a conexão

4. **Progressive Web App (PWA)**
   - Instalável em celulares como app nativo
   - Pode ser acessado pela tela inicial
   - Ícone personalizado
   - Atalhos para cada seção

---

## 🚀 Como Habilitar Notificações

### No Navegador (Desktop/Mobile)

1. Abra o app em `http://localhost:5173`
2. Veja o banner azul no topo: **"Receba notificações"**
3. Clique em **"Ativar"**
4. Autorize as notificações do navegador
5. Pronto! Você receberá notificações

### Instalando como App (PWA)

#### No Android (Chrome, Firefox, Edge):
1. Abra o app em https://seu-dominio.netlify.app
2. Clique no menu (⋮) → **"Instalar app"** ou **"Adicionar à tela inicial"**
3. O app será instalado como um ícone na tela inicial
4. Abra o app instalado
5. Ative as notificações quando solicitado

#### No iOS (Safari):
1. Abra o app em https://seu-dominio.netlify.app
2. Clique no botão **Compartilhar** (↗)
3. Escolha **"Adicionar à Tela Inicial"**
4. Toque em **Adicionar**
5. O app será instalado
6. Ative as notificações quando solicitado

#### No Desktop (Chrome, Firefox, Edge):
1. Abra o app
2. Clique no ícone de **instalação** (canto superior direito do navegador)
3. Clique em **"Instalar"**
4. O app abrirá em uma janela separada
5. Ative as notificações quando solicitado

---

## 📱 Quando Você Recebe Notificações

### Notificações Automáticas

**Lembretes Próximos (⏰)**
- Você recebe notificação quando um lembrete está a **15 minutos** do vencimento
- Exemplo: "Ligar para mãe vence em 10 minutos"

**Lembretes Vencidos (⏱️)**
- Se você não completou o lembrete, recebe notificação de atraso
- Exemplo: "Estudar venceu há 2 horas"

### Notificações de Ação

**Lembrete Adicionado (✅)**
- Quando você cria um novo lembrete
- Confirma que foi salvo no banco de dados

**Lembrete Concluído (✓)**
- Quando você marca um lembrete como completo
- Celebra sua conclusão!

**Filme/Livro Adicionado (✅)**
- Quando você adiciona um novo filme ou livro
- Confirma o salvamento na base de dados

---

## ⚙️ Configurações de Notificações

### Verificação de Lembretes

O app verifica lembretes próximos a cada **30 segundos** enquanto você está usando.

### Limpeza de Cache

O navegador limpa notificações após **5 segundos** de tela.

Se você quer notificações persistentes, use o botão com `requireInteraction: true` (notificações de atraso).

---

## 🔐 Permissões Necessárias

O app solicita as seguintes permissões:

1. **Notificações** - Para enviar alertas
2. **Acesso ao Banco de Dados** - Para ler/salvar lembretes (Firebase)
3. **Acesso ao Armazenamento** - Para cache offline

Todas as permissões são **opcionais**. Se negar:
- ✅ O app continua funcionando
- ❌ Você não receberá notificações
- ✅ Dados serão sincronizados online

---

## 🛡️ Privacidade e Segurança

- ✅ Notificações são **locais** (no seu dispositivo)
- ✅ Seus dados estão no **Firebase** protegido
- ✅ Sem rastreamento de dados
- ✅ Sem publicidade
- ✅ Código aberto no GitHub

---

## 📊 Testando Notificações

### Test Case 1: Lembrete Próximo
1. Crie um lembrete
2. Defina a data de vencimento para **15 minutos a partir de agora**
3. Aguarde 30 segundos
4. Você receberá uma notificação

### Test Case 2: Ação Confirmada
1. Ative as notificações
2. Adicione um novo lembrete
3. Você receberá notificação confirmando

### Test Case 3: Offline
1. Desconecte a internet
2. O app continua funcionando
3. Reconecte e veja os dados sincronizados

---

## 🐛 Troubleshooting

### Não estou recebendo notificações

**Solução:**
1. Verifique se clicou em **"Ativar"** no banner
2. Vá em Configurações → Notificações → App
3. Certifique-se que as notificações estão **habilitadas**
4. Recarregue a página (F5)

### Não consigo instalar como app

**Solução:**
1. Certifique-se que está acessando via HTTPS (não localhost)
2. Use um navegador moderno (Chrome, Firefox, Edge, Safari)
3. Aguarde 30 segundos na página
4. O botão de instalação deve aparecer

### O app não funciona offline

**Solução:**
1. Visite o app uma vez enquanto online
2. O Service Worker cacheia os assets
3. A próxima vez funcionará offline
4. Dados do Firebase precisam de internet

---

## 📚 Arquivos Relacionados

- `src/NotificationService.js` - Lógica de notificações
- `src/NotificationBanner.jsx` - Banner pedindo permissão
- `src/NotificationBanner.css` - Estilo do banner
- `public/manifest.json` - Configurações PWA
- `public/sw.js` - Service Worker
- `index.html` - Meta tags PWA

---

## 🎯 Próximos Passos

Para melhorar ainda mais:

1. **Notificações Agendadas** - Enviar notificações em horários específicos
2. **Som Personalizado** - Som ao receber notificação
3. **Lembretes Recorrentes** - Notificações para tarefas repetidas
4. **Dark Mode** - Tema escuro para economia de bateria
5. **Categorias** - Agrupar lembretes por categoria

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique a conexão com Firebase
2. Limpe o cache do navegador
3. Abra as ferramentas do desenvolvedor (F12)
4. Verifique o Console para mensagens de erro

---

**Aproveite suas notificações! 🎉**
