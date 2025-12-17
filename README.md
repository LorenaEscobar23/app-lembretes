# 📋 Gestor de Lembretes Pessoais

Um app moderno, robusto e responsivo para gerenciar seus lembretes pessoais com autenticação Firebase e banco de dados em tempo real. Interface intuitiva com design premium e excelente UX.

## ✨ Recursos Principais

### Gerenciamento de Lembretes
- ✅ **CRUD Completo**: Adicionar, editar, deletar e visualizar lembretes
- ✅ **Marcar como Concluído**: Acompanhe o progresso das tarefas
- ✅ **Data de Vencimento**: Configure prazos para seus lembretes
- ✅ **Descrição Detalhada**: Adicione contexto e informações extras

### Busca e Filtros
- 🔍 **Busca em Tempo Real**: Encontre lembretes por título ou descrição
- 🎯 **Filtros Inteligentes**: Todos, Pendentes ou Concluídos
- 📊 **Estatísticas**: Veja o resumo dos seus lembretes
- 🔄 **Ordenação**: Por data, data de vencimento ou alfabético

### Interface e Design
- 🎨 **Design Premium**: Interface moderna com gradientes e sombras
- 📱 **Responsivo**: Perfeito em desktop, tablet e smartphone
- ⚡ **Animações Suaves**: Transições fluidas e agradáveis
- 🌙 **Acessibilidade**: Contraste adequado e navegação por teclado

### Sincronização
- ☁️ **Tempo Real**: Dados sincronizados com Firebase Realtime Database
- 🔄 **Atualizações Instantâneas**: Veja mudanças assim que acontecem
- 💾 **Armazenamento em Nuvem**: Sem perder seus dados

### Robustez
- ⚠️ **Validação de Formulários**: Garante dados consistentes
- 🛡️ **Tratamento de Erros**: Mensagens claras quando algo falha
- ⏳ **Estados de Carregamento**: Feedback visual durante operações
- 🔐 **Segurança**: Acesso protegido aos dados

## 🎯 O que há de Novo

### V2.0 - Melhorias Massivas
- Redesign completo da interface com novo sistema de cores
- Sistema de busca avançado em tempo real
- Ordenação por múltiplos critérios
- Contador de caracteres nos campos de texto
- Mensagens de erro melhoradas com botoão de fechar
- Carregamento com spinner animado
- Estado vazio mais intuitivo
- Modo de edição destacado visualmente
- Responsividade extrema melhorada
- Validação de formulários robusta
- Estatísticas em tempo real

### V3.0 - Filmes & Livros + Notificações
- 🎬 **Nova aba Filmes & Livros** para registrar mídias
- 🔔 **Notificações Push** no celular para lembretes próximos
- 📱 **PWA Instalável** - App nativo no celular
- 💾 **Modo Offline** - Funciona sem internet
- 🚀 **Service Worker** para cache inteligente
- 📌 **Anotações** - Seção separada para notas sem data

## 🚀 Quick Start

### 1. Clonar/Baixar o Projeto

```bash
git clone <url-do-repositorio>
cd app-lembretes
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Firebase (Importante!)

Siga o guia completo em [CONFIGURAR_FIREBASE.md](CONFIGURAR_FIREBASE.md):

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Vá para **Realtime Database**
3. Configure as regras de segurança

### 4. Executar o Projeto

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 📱 Layout Responsivo

- **Desktop** (1920px+): Layout completo com sidebars
- **Tablet** (768px - 1024px): Ajustes inteligentes
- **Mobile** (< 768px): Interface otimizada para toque

## 🔔 Notificações no Celular

O app envia notificações quando:
- Um lembrete está próximo ao vencimento (15 minutos)
- Um lembrete venceu e ainda não foi completado
- Você adiciona um novo lembrete, anotação ou filme

**Para habilitar:**
1. Clique em "Ativar" no banner azul
2. Autorize as notificações do navegador
3. Pronto! Você receberá alertas

[Ver guia completo de notificações →](NOTIFICACOES.md)

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 18+ | Framework UI |
| Vite | 5+ | Build tool moderno |
| Firebase | Latest | Auth + Realtime Database |
| CSS3 | Latest | Estilos modernos |
| PWA | Latest | App instalável |

## 📂 Estrutura de Arquivos

```
src/
├── App.jsx              # Componente raiz
├── App.css              # Estilos globais
├── Reminders.jsx        # Lógica dos lembretes
├── Reminders.css        # Estilos dos lembretes
├── Auth.jsx             # Autenticação (removida)
├── Auth.css             # (removida)
├── firebase.js          # Configuração Firebase
├── main.jsx             # Entry point
└── index.css            # Estilos base
```

## 🎨 Customização

### Cores
Edite as variáveis CSS em `src/App.css`:

```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --success: #10b981;
  --danger: #ef4444;
  /* ... mais cores */
}
```

### Fontes
Mude a font-family em `body` do `src/App.css`

### Tema
Adicione um arquivo de tema separado para switches light/dark

## 🔐 Segurança

### Regras Firebase Básicas (Desenvolvimento)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Regras Firebase Seguras (Produção)
```json
{
  "rules": {
    "reminders": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

## 📊 Estrutura de Dados

```
reminders/
  └── local-user/
      ├── lembrete-1/
      │   ├── title: string
      │   ├── description: string
      │   ├── dueDate: string (YYYY-MM-DD)
      │   ├── completed: boolean
      │   ├── createdAt: ISO timestamp
      │   └── updatedAt: ISO timestamp
      └── lembrete-2/
          └── ...
```

## 🚀 Build para Produção

```bash
npm run build
```

Gera pasta `dist/` pronta para deploy.

## 🐛 Troubleshooting

### "Permission denied" no Firebase
- Verifique as regras de segurança
- Aguarde 30 segundos e atualize a página
- Confirme que está em Realtime Database (não Firestore)

### Lembretes não aparecem
- Verifique o console (F12)
- Confirme as credenciais em `src/firebase.js`
- Teste a conexão com Firebase

### App lento
- Limpe o cache do navegador
- Reduza número de lembretes
- Verifique a conexão de internet

## 📝 Recursos Futuros

- [ ] Autenticação com Google/GitHub
- [ ] Categorias de lembretes
- [ ] Lembretes recorrentes
- [ ] Notificações push
- [ ] Anexos e imagens
- [ ] Compartilhamento de listas
- [ ] Dark mode
- [ ] Modo offline com sincronização

## 💡 Dicas de Uso

1. **Backup**: Exporte seus dados regularmente do Firebase
2. **Limpeza**: Delente lembretes concluídos regularmente
3. **Organização**: Use descrições detalhadas
4. **Prazos**: Sempre defina datas de vencimento
5. **Busca**: Use a busca para encontrar lembretes antigos

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir melhorias
- Fazer pull requests
- Compartilhar feedback

## 📄 Licença

Este projeto é open source e livre para uso pessoal e comercial.

## 🙏 Agradecimentos

- Firebase por fornecer backend robusto
- Comunidade React pelos componentes e ferramentas
- Inspiração em design systems modernos

---

## 📞 Suporte

Tem dúvidas ou problemas? Consulte:
- [Guia de Configuração do Firebase](CONFIGURAR_FIREBASE.md)
- Console do navegador (F12) para erros
- Documentação oficial do [Firebase](https://firebase.google.com/docs)

---

**Desenvolvido com ❤️ para melhorar sua produtividade**

Última atualização: Dezembro 2025
