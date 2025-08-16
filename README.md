# Sistema FAQ - Perguntas Frequentes

Sistema completo de FAQ (Frequently Asked Questions) com backend Java/Spring Boot, frontend React, e banco de dados PostgreSQL.

## 🚀 Funcionalidades

### Tela Pública
- Navegação por categorias expansíveis (similar a pastas do Windows)
- Sistema de busca avançada
- Visualização organizada das FAQs
- Contadores de visualização e utilidade
- Interface responsiva e moderna

### Tela de Administração
- CRUD completo para Categorias
- CRUD completo para FAQs
- Gerenciamento de tags e prioridades
- Reordenação de itens
- Interface intuitiva com Material-UI

### API Backend
- API REST completa
- Documentação automática com Swagger
- Validação de dados
- Suporte a paginação
- Métricas de uso

## 🛠️ Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- PostgreSQL
- SpringDoc OpenAPI (Swagger)
- Maven

### Frontend
- React 18
- Material-UI (MUI)
- React Router DOM
- Axios
- React Query

## 📋 Pré-requisitos

- Java 17 ou superior
- Node.js 16 ou superior
- PostgreSQL 12 ou superior
- Maven 3.6 ou superior

## 🔧 Instalação e Configuração

### 1. Configuração do Banco de Dados

```sql
-- Criar banco de dados
CREATE DATABASE faq_system;

-- Criar usuário (opcional)
CREATE USER faq_user WITH PASSWORD 'faq_password';
GRANT ALL PRIVILEGES ON DATABASE faq_system TO faq_user;
```

### 2. Configuração do Backend

```bash
# Navegar para o diretório do backend
cd backend

# Configurar as propriedades do banco (se necessário)
# Editar src/main/resources/application.yml

# Instalar dependências e executar
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

### 3. Configuração do Frontend

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start
```

O frontend estará disponível em: `http://localhost:3000`

## 🌐 URLs Importantes

- **Interface Pública**: http://localhost:3000/
- **Interface de Administração**: http://localhost:3000/admin
- **Página de Teste**: http://localhost:3000/test
- **API Backend**: http://localhost:8080/api
- **Documentação da API**: http://localhost:8080/swagger-ui.html

## 📊 Estrutura do Banco de Dados

### Tabela: categories
- `id` (BIGINT, PK)
- `name` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `display_order` (INTEGER)
- `active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: faqs
- `id` (BIGINT, PK)
- `question` (TEXT, NOT NULL)
- `answer` (TEXT, NOT NULL)
- `category_id` (BIGINT, FK)
- `tags` (VARCHAR)
- `priority` (INTEGER)
- `active` (BOOLEAN)
- `display_order` (INTEGER)
- `view_count` (INTEGER)
- `helpful_count` (INTEGER)
- `not_helpful_count` (INTEGER)
- `meta_description` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `created_by` (VARCHAR)
- `updated_by` (VARCHAR)

## 🔍 Testando o Sistema

### Teste Automático
1. Acesse `http://localhost:3000/test`
2. Clique em "Executar Todos os Testes"
3. Verifique se todos os testes passaram

### Teste Manual
1. **Administração**:
   - Acesse `/admin`
   - Crie algumas categorias
   - Crie algumas FAQs
   - Teste as funcionalidades de edição e exclusão

2. **Interface Pública**:
   - Acesse `/`
   - Teste a navegação por categorias
   - Teste a funcionalidade de busca
   - Teste os botões de "útil/não útil"

## 📝 API Endpoints

### Categorias
- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/active` - Listar categorias ativas
- `GET /api/categories/{id}` - Buscar categoria por ID
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/{id}` - Atualizar categoria
- `DELETE /api/categories/{id}` - Excluir categoria

### FAQs
- `GET /api/faqs` - Listar todas as FAQs
- `GET /api/faqs/active` - Listar FAQs ativas
- `GET /api/faqs/search?q={termo}` - Buscar FAQs
- `GET /api/faqs/category/{id}` - FAQs por categoria
- `POST /api/faqs` - Criar FAQ
- `PUT /api/faqs/{id}` - Atualizar FAQ
- `DELETE /api/faqs/{id}` - Excluir FAQ
- `PATCH /api/faqs/{id}/view` - Incrementar visualizações
- `PATCH /api/faqs/{id}/helpful` - Marcar como útil

## 🚀 Deploy

### Docker (Recomendado)
```bash
# Construir imagens
docker-compose build

# Executar
docker-compose up -d
```

### Deploy Manual
1. **Backend**: Gerar JAR com `mvn clean package` e executar
2. **Frontend**: Gerar build com `npm run build` e servir com nginx
3. **Banco**: Configurar PostgreSQL em produção

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

**Backend**:
- `DB_HOST` - Host do banco de dados
- `DB_PORT` - Porta do banco de dados
- `DB_NAME` - Nome do banco de dados
- `DB_USER` - Usuário do banco
- `DB_PASSWORD` - Senha do banco

**Frontend**:
- `REACT_APP_API_URL` - URL da API backend

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `application.yml`
- Teste a conexão manualmente

### Erro de CORS
- Verifique se o backend está configurado para aceitar requisições do frontend
- Confirme as URLs nas configurações de CORS

### Erro 404 nas Rotas
- Verifique se o React Router está configurado corretamente
- Confirme se todas as rotas estão definidas no `App.js`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email.

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de FAQs**