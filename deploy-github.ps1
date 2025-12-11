$ErrorActionPreference = "Stop"

Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "Publicando seu app no GitHub..."  -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$path = "C:\Users\Lorena Escobar\Desktop\Pessoal\App Pessoal"
Set-Location $path

Write-Host "📍 Diretório: $path" -ForegroundColor Green
Write-Host ""

try {
    Write-Host "1️⃣ Adicionando remote do GitHub..." -ForegroundColor Yellow
    & git remote add origin https://github.com/LorenaEscobar23/app-lembretes.git
    Write-Host "✅ Remote adicionado" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "2️⃣ Configurando branch principal..." -ForegroundColor Yellow
    & git branch -M main
    Write-Host "✅ Branch configurado" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "3️⃣ Fazendo push para GitHub..." -ForegroundColor Yellow
    & git push -u origin main
    Write-Host "✅ Push realizado" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "🎉 SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Seu código está no GitHub!" -ForegroundColor Green
    Write-Host "URL: https://github.com/LorenaEscobar23/app-lembretes" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Yellow
    Write-Host "1. Acesse https://app.netlify.com" -ForegroundColor White
    Write-Host "2. Clique em 'Sign up with GitHub'" -ForegroundColor White
    Write-Host "3. Selecione o repositório app-lembretes" -ForegroundColor White
    Write-Host "4. Configure e clique em 'Deploy'" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Dica: Feche o PowerShell completamente e reabra" -ForegroundColor Yellow
}

Read-Host "Pressione ENTER para sair"
