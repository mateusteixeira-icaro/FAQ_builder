-- Script para inserir dados de teste no banco PostgreSQL
-- Dados com codificação UTF-8 correta

-- Inserir categorias
INSERT INTO categories (name, description, active, display_order, created_at) VALUES 
('Perguntas Gerais', 'Dúvidas frequentes sobre o uso básico do sistema', true, 1, CURRENT_TIMESTAMP),
('Suporte Técnico', 'Problemas técnicos e soluções de troubleshooting', true, 2, CURRENT_TIMESTAMP),
('Faturamento', 'Questões relacionadas a pagamentos e faturas', true, 3, CURRENT_TIMESTAMP),
('Gerenciamento de Conta', 'Configurações e gerenciamento da conta do usuário', true, 4, CURRENT_TIMESTAMP);

-- Inserir FAQs (usando os IDs corretos das categorias)
INSERT INTO faqs (question, answer, category_id, is_active, priority, view_count, created_at) VALUES 
('Como faço para criar uma conta?', 'Para criar uma conta, clique no botão Registrar no canto superior direito da página inicial e preencha o formulário com suas informações pessoais.', 6, true, 1, 0, CURRENT_TIMESTAMP),
('Esqueci minha senha, como posso recuperá-la?', 'Clique em Esqueci minha senha na página de login e siga as instruções enviadas para seu email cadastrado.', 6, true, 2, 0, CURRENT_TIMESTAMP),
('Como posso alterar meus dados pessoais?', 'Acesse Meu Perfil no menu do usuário e clique em Editar Informações para alterar seus dados.', 9, true, 1, 0, CURRENT_TIMESTAMP),
('O sistema está lento, o que fazer?', 'Verifique sua conexão com a internet e tente limpar o cache do navegador. Se o problema persistir, entre em contato conosco.', 7, true, 1, 0, CURRENT_TIMESTAMP),
('Não consigo fazer login, o que pode ser?', 'Verifique se está usando o email e senha corretos. Certifique-se de que o Caps Lock não está ativado.', 7, true, 2, 0, CURRENT_TIMESTAMP),
('Como entro em contato com o suporte técnico?', 'Você pode nos contatar através do chat online, email suporte@empresa.com ou telefone (11) 1234-5678.', 7, true, 3, 0, CURRENT_TIMESTAMP),
('Posso cancelar minha assinatura a qualquer momento?', 'Sim, você pode cancelar sua assinatura a qualquer momento através da área Minha Conta > Gerenciar Assinatura.', 8, true, 1, 0, CURRENT_TIMESTAMP),
('Como faço para atualizar meus dados de pagamento?', 'Acesse a seção Faturamento no seu painel e clique em Atualizar Dados de Pagamento.', 8, true, 2, 0, CURRENT_TIMESTAMP),
('Por que meu cartão foi recusado?', 'Verifique se os dados estão corretos, se há limite disponível e se o cartão não está vencido. Entre em contato com seu banco se necessário.', 8, true, 3, 0, CURRENT_TIMESTAMP),
('Como altero minha senha?', 'Acesse Configurações da Conta e clique em Alterar Senha. Digite sua senha atual e a nova senha duas vezes.', 9, true, 2, 0, CURRENT_TIMESTAMP),
('Posso ter múltiplas contas?', 'Não, cada usuário pode ter apenas uma conta ativa por endereço de email.', 9, true, 3, 0, CURRENT_TIMESTAMP),
('Como excluo minha conta permanentemente?', 'Para excluir sua conta, acesse Configurações > Excluir Conta. Esta ação é irreversível.', 9, true, 4, 0, CURRENT_TIMESTAMP),
('Não recebo emails de notificação, por quê?', 'Verifique sua caixa de spam e confirme se o email está correto em suas configurações de conta.', 9, true, 5, 0, CURRENT_TIMESTAMP),
('Como ativo a autenticação em duas etapas?', 'Acesse Segurança nas configurações da conta e clique em Ativar Autenticação em Duas Etapas.', 9, true, 6, 0, CURRENT_TIMESTAMP);

COMMIT;