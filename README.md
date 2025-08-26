# Sistema de FAQ

Sistema completo de FAQ (Frequently Asked Questions) com frontend React e backend Spring Boot, suportando tanto dados mockados para desenvolvimento quanto banco PostgreSQL para produção.

## 🚀 Características

- **Frontend React** com TypeScript e Tailwind CSS
- **Backend Spring Boot** com API REST
- **Suporte Híbrido**: Mockup (H2) para desenvolvimento e PostgreSQL para produção
- **CRUD Completo** para FAQs e Categorias
- **Busca Avançada** com filtros
- **Interface Responsiva** e moderna
- **Painel Administrativo** completo

## 📋 Pré-requisitos

### Para Desenvolvimento (Mockup)
- **Java 17** ou superior
- **Node.js 18** ou superior
- **npm** ou **yarn**
- **Git**

### Para Produção (PostgreSQL)
- Todos os itens acima +
- **PostgreSQL 12** ou superior

## 🛠️ Instalação

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd ProjetoFAQ
```

### 2. Configuração do Backend

#### Modo Desenvolvimento (Mockup - Padrão)
```bash
cd backend

# Compilar e executar
./mvnw spring-boot:run

# Ou no Windows
.\mvnw.cmd spring-boot:run
```

O backend estará disponível em: `http://localhost:8080/api`

#### Modo Produção (PostgreSQL)

1. **Instalar e configurar PostgreSQL:**
```sql
-- Conectar como superusuário
CREATE DATABASE faqdb;
CREATE USER faq_user WITH PASSWORD 'faq_password';
GRANT ALL PRIVILEGES ON DATABASE faqdb TO faq_user;
```

2. **Executar scripts de inicialização:**
```bash
# Conectar ao banco faqdb
psql -U faq_user -d faqdb

# Executar schema
\i src/main/resources/schema-postgresql.sql

# Executar dados de exemplo (opcional)
\i src/main/resources/data-postgresql.sql
```

3. **Executar com profile de produção:**
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod

# Ou compilar JAR e executar
./mvnw clean package
java -jar target/faq-backend-1.0.0.jar --spring.profiles.active=prod
```

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start
```

O frontend estará disponível em: `http://localhost:3000`

## 🔧 Configuração

### Profiles do Spring Boot

#### Desenvolvimento (`dev` - padrão)
- Banco H2 em memória
- Dados mockados
- Logs detalhados
- Console H2 habilitado

#### Produção (`prod`)
- Banco PostgreSQL
- Logs otimizados
- Configurações de segurança
- Pool de conexões configurado

### Variáveis de Ambiente (Produção)

```bash
# Banco de dados
export DB_URL=jdbc:postgresql://localhost:5432/faqdb
export DB_USERNAME=faq_user
export DB_PASSWORD=faq_password

# Executar com variáveis
java -jar faq-backend-1.0.0.jar --spring.profiles.active=prod
```

### Configuração do Frontend

O frontend está configurado para se conectar ao backend em `http://localhost:8080/api`. Para alterar:

```typescript
// src/services/api.ts
const API_BASE_URL = 'http://seu-servidor:8080/api';
```

## 📚 Uso

### Página Pública
- Acesse `http://localhost:3000`
- Visualize FAQs por categoria
- Use a busca para encontrar respostas
- Navegue pelas categorias

### Painel Administrativo
- Acesse `http://localhost:3000/admin`
- Gerencie categorias e FAQs
- Ative/desative itens
- Organize por prioridade

### API REST

Base URL: `http://localhost:8080/api`

#### Categorias
- `GET /categories` - Listar todas
- `GET /categories/with-faqs` - Categorias com FAQs ativos
- `POST /categories` - Criar categoria
- `PUT /categories/{id}` - Atualizar categoria
- `DELETE /categories/{id}` - Excluir categoria

#### FAQs
- `GET /faqs` - Listar FAQs ativos
- `GET /faqs/search?q=termo` - Buscar FAQs
- `POST /faqs` - Criar FAQ
- `PUT /faqs/{id}` - Atualizar FAQ
- `PATCH /faqs/{id}/status` - Alterar status
- `DELETE /faqs/{id}` - Excluir FAQ

## 🐳 Docker (Opcional)

### Backend
```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim
COPY target/faq-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Frontend
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🚀 Deploy

### Desenvolvimento
1. Execute o backend: `./mvnw spring-boot:run`
2. Execute o frontend: `npm start`

### Produção
1. Configure PostgreSQL
2. Execute scripts de banco
3. Compile: `./mvnw clean package`
4. Execute: `java -jar target/faq-backend-1.0.0.jar --spring.profiles.active=prod`
5. Build frontend: `npm run build`
6. Sirva arquivos estáticos

## 🔍 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco:**
   - Verifique se PostgreSQL está rodando
   - Confirme credenciais em `application-prod.properties`

2. **Frontend não conecta com backend:**
   - Verifique se backend está rodando na porta 8080
   - Confirme URL em `src/services/api.ts`

3. **Erro de CORS:**
   - Backend já configurado para `http://localhost:3000`
   - Para outros domínios, ajuste `@CrossOrigin` nos controllers

### Logs

```bash
# Backend logs
tail -f logs/spring.log

# Frontend logs
# Disponíveis no console do navegador
```

## 📝 Estrutura do Projeto

```
ProjetoFAQ/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Código fonte Java
│   ├── src/main/resources/ # Configurações e SQL
│   └── pom.xml            # Dependências Maven
├── frontend/               # React App
│   ├── src/               # Código fonte TypeScript
│   ├── public/            # Arquivos públicos
│   └── package.json       # Dependências npm
└── README.md              # Esta documentação
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue com Leandro Ruiz :D

---
