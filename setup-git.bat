@echo off
chcp 65001 >nul
cd "C:\Users\Lorena Escobar\Desktop\Pessoal\App Pessoal"

echo ========================================
echo Configurando Git...
echo ========================================

git config --global user.name "Lorena"
git config --global user.email "seu@email.com"

echo.
echo ========================================
echo Inicializando repositório Git...
echo ========================================

git init
git add .
git commit -m "app-lembretes v1.0"
git branch -M main

echo.
echo ========================================
echo ✅ Git configurado com sucesso!
echo ========================================
echo.
echo Próximos passos:
echo 1. Acesse https://github.com/new
echo 2. Crie um novo repositório chamado "app-lembretes"
echo 3. Copie os comandos mostrados (push)
echo 4. Cole e execute neste terminal
echo.
pause
