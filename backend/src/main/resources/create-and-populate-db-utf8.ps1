# Script PowerShell para inserir dados no PostgreSQL com codificação UTF-8 correta
# Configuração de codificação UTF-8 para o PowerShell
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Configurações do banco
$env:PGPASSWORD = 'postgres'
$psqlPath = 'C:\Program Files\PostgreSQL\15\bin\psql.exe'
$hostname = 'localhost'
$user = 'postgres'
$database = 'faq_system'

# Script SQL com caracteres UTF-8 corretos
$sqlScript = @'
-- Corrigir dados com codificação UTF-8 adequada

-- Atualizar categorias com caracteres especiais corretos
UPDATE categories SET 
    name = 'Suporte Técnico',
    description = 'Questões relacionadas a problemas técnicos'
WHERE id = 3;

UPDATE categories SET 
    description = 'Dúvidas sobre cobrança e pagamentos'
WHERE id = 4;

UPDATE categories SET 
    description = 'Informações sobre gerenciamento de conta de usuário'
WHERE id = 5;

-- Atualizar FAQs com acentuação correta
UPDATE faqs SET 
    question = 'Como faço para criar uma conta?',
    answer = 'Para criar uma conta, clique no botão "Registrar" no canto superior direito da página inicial e preencha o formulário com suas informações pessoais.'
WHERE id = 12;

UPDATE faqs SET 
    question = 'Esqueci minha senha, como posso recuperá-la?',
    answer = 'Clique em "Esqueci minha senha" na página de login e siga as instruções enviadas para seu email cadastrado.'
WHERE id = 13;

UPDATE faqs SET 
    question = 'Como posso alterar meu email cadastrado?',
    answer = 'Acesse "Meu Perfil" no menu do usuário e clique em "Editar Informações" para alterar seu email.'
WHERE id = 14;

UPDATE faqs SET 
    question = 'O sistema está lento, o que posso fazer?',
    answer = 'Verifique sua conexão com a internet e tente limpar o cache do navegador. Se o problema persistir, entre em contato conosco.'
WHERE id = 15;

UPDATE faqs SET 
    question = 'Não consigo fazer login, o que pode ser?',
    answer = 'Verifique se você está usando o email e senha corretos. Se esqueceu a senha, use a opção "Esqueci minha senha".'
WHERE id = 16;

UPDATE faqs SET 
    question = 'Como visualizar minha fatura?',
    answer = 'Acesse "Minha Conta" > "Faturas" para visualizar e baixar suas faturas em PDF.'
WHERE id = 17;

UPDATE faqs SET 
    question = 'Quais formas de pagamento são aceitas?',
    answer = 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), débito e PIX.'
WHERE id = 18;

UPDATE faqs SET 
    question = 'Posso cancelar minha assinatura a qualquer momento?',
    answer = 'Sim, você pode cancelar sua assinatura a qualquer momento através da área "Minha Conta" > "Gerenciar Assinatura".'
WHERE id = 19;

UPDATE faqs SET 
    question = 'Posso pausar minha conta temporariamente?',
    answer = 'Sim, oferecemos a opção de pausar sua conta por até 3 meses. Entre em contato conosco para mais detalhes.'
WHERE id = 20;

UPDATE faqs SET 
    question = 'Como entro em contato com o suporte técnico?',
    answer = 'Você pode entrar em contato através do email suporte@empresa.com ou pelo telefone (11) 1234-5678 em horário comercial.'
WHERE id = 21;

-- Verificar resultados
SELECT 'Categorias atualizadas:' as status;
SELECT id, name, description FROM categories WHERE id IN (3, 4, 5) ORDER BY id;

SELECT 'FAQs atualizadas:' as status;
SELECT id, question FROM faqs WHERE id BETWEEN 12 AND 21 ORDER BY id;
'@

# Salvar o script SQL em um arquivo temporário com codificação UTF-8
$tempSqlFile = "$env:TEMP\fix-utf8-data.sql"
$sqlScript | Out-File -FilePath $tempSqlFile -Encoding UTF8

Write-Host "Executando correção de codificação UTF-8..." -ForegroundColor Green

# Executar o script SQL com psql
try {
    & $psqlPath -h $hostname -U $user -d $database -f $tempSqlFile
    Write-Host "Correção executada com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao executar correção: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Limpar arquivo temporário
    if (Test-Path $tempSqlFile) {
        Remove-Item $tempSqlFile
    }
}

Write-Host "Processo concluído. Verifique a aplicação web em http://localhost:3000" -ForegroundColor Cyan