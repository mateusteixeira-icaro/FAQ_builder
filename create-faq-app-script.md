# Script para Criar Aplicação FAQ - Guia Completo para IA

## 📋 Visão Geral
Este script permite recriar uma aplicação FAQ completa usando:
- **Backend**: Spring Boot 3.2.0 + Java 17 + JPA + H2/PostgreSQL
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Radix UI
- **Funcionalidades**: CRUD completo, busca, painel admin, API REST

## 🚀 Estrutura do Projeto

```
ProjetoFAQ/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/faq/
│   │   ├── FaqApplication.java
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   ├── controller/
│   │   │   ├── CategoryController.java
│   │   │   └── FaqController.java
│   │   ├── dto/
│   │   │   ├── CategoryDTO.java
│   │   │   └── FaqDTO.java
│   │   ├── entity/
│   │   │   ├── Category.java
│   │   │   └── Faq.java
│   │   ├── repository/
│   │   │   ├── CategoryRepository.java
│   │   │   └── FaqRepository.java
│   │   └── service/
│   │       ├── CategoryService.java
│   │       └── FaqService.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-dev.properties
│   │   ├── application-prod.properties
│   │   ├── data-h2.sql
│   │   ├── data-postgresql.sql
│   │   ├── schema-h2.sql
│   │   ├── schema-postgresql.sql
│   │   └── test-data.sql
│   ├── pom.xml
│   └── mvnw.cmd
├── frontend/                # React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Radix UI components
│   │   │   ├── FAQ.tsx
│   │   │   ├── FAQAdmin.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── faq.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Comandos de Criação

### 1. Inicialização do Projeto

```bash
# Criar diretório principal
mkdir ProjetoFAQ
cd ProjetoFAQ

# Inicializar Git
git init
```

### 2. Backend Spring Boot

```bash
# Criar estrutura backend
mkdir backend
cd backend

# Criar estrutura de diretórios
mkdir -p src/main/java/com/faq/{config,controller,dto,entity,repository,service}
mkdir -p src/main/resources
mkdir -p src/test/java/com/faq
```

#### 2.1 Arquivo pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.faq</groupId>
    <artifactId>faq-backend</artifactId>
    <version>1.0.0</version>
    <name>FAQ Backend</name>
    <description>Backend API para sistema de FAQ</description>
    <packaging>jar</packaging>

    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Starter Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Boot Starter Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- H2 Database -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- PostgreSQL Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Boot DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Jackson for JSON processing -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

#### 2.2 Configurações (application.properties)

```properties
# application.properties
spring.application.name=FAQ System
spring.profiles.active=dev
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.com.faq=DEBUG
logging.level.org.springframework.web=DEBUG
```

```properties
# application-dev.properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:faqdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Initialize with data
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:test-data.sql
```

```properties
# application-prod.properties
# PostgreSQL Configuration
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/faqdb}
spring.datasource.username=${DB_USERNAME:faq_user}
spring.datasource.password=${DB_PASSWORD:faq_password}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Connection Pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

### 3. Frontend React

```bash
# Voltar para raiz e criar frontend
cd ..
npx create-react-app frontend --template typescript
cd frontend

# Instalar dependências específicas
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast
npm install class-variance-authority clsx lucide-react react-hook-form react-router-dom tailwind-merge tailwindcss-animate
npm install -D tailwindcss postcss autoprefixer @types/node

# Configurar Tailwind
npx tailwindcss init -p
```

#### 3.1 Configuração Tailwind (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 🔧 Arquivos Principais

### Backend - Entidades

#### Category.java
```java
package com.faq.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    @Column(length = 500)
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 1;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Faq> faqs;

    // Constructors, getters, setters...
}
```

#### Faq.java
```java
package com.faq.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "faqs")
public class Faq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Pergunta é obrigatória")
    @Size(max = 500, message = "Pergunta deve ter no máximo 500 caracteres")
    @Column(nullable = false, length = 500)
    private String question;

    @NotBlank(message = "Resposta é obrigatória")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false)
    private Integer priority = 1;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Constructors, getters, setters...
}
```

### Frontend - Tipos TypeScript

#### types/faq.ts
```typescript
export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ordem: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface FAQ {
  id: number;
  pergunta: string;
  resposta: string;
  prioridade: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm?: string;
  categoria: Categoria;
}

export interface CategoriaComFAQs extends Categoria {
  faqs: FAQ[];
}
```

### API Service

#### services/api.ts
```typescript
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Categorias
  async getCategorias(): Promise<Categoria[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
  },

  async getCategoriasComFAQs(): Promise<CategoriaComFAQs[]> {
    const response = await fetch(`${API_BASE_URL}/categories/with-faqs`);
    return response.json();
  },

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    const response = await fetch(`${API_BASE_URL}/faqs`);
    return response.json();
  },

  async searchFAQs(query: string): Promise<FAQ[]> {
    const response = await fetch(`${API_BASE_URL}/faqs/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // CRUD operations...
};
```

## 🚀 Comandos de Execução

### Desenvolvimento
```bash
# Backend (Terminal 1)
cd backend
./mvnw spring-boot:run
# ou no Windows: .\mvnw.cmd spring-boot:run

# Frontend (Terminal 2)
cd frontend
npm start
```

### Produção
```bash
# Backend
cd backend
./mvnw clean package
java -jar target/faq-backend-1.0.0.jar --spring.profiles.active=prod

# Frontend
cd frontend
npm run build
# Servir arquivos estáticos
```

## 📋 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/api/h2-console

## 🔍 Funcionalidades Implementadas

### Backend
- ✅ API REST completa (CRUD)
- ✅ Validação de dados
- ✅ Suporte H2 e PostgreSQL
- ✅ Profiles de desenvolvimento/produção
- ✅ CORS configurado
- ✅ Busca de FAQs
- ✅ Ordenação por prioridade/ordem

### Frontend
- ✅ Interface responsiva
- ✅ Componentes Radix UI
- ✅ Tailwind CSS
- ✅ TypeScript
- ✅ Roteamento (React Router)
- ✅ Painel administrativo
- ✅ Busca em tempo real
- ✅ CRUD completo

## 📝 Próximos Passos

1. **Personalização**: Adapte cores, layout e funcionalidades
2. **Autenticação**: Adicione login/logout se necessário
3. **Deploy**: Configure para produção (Docker, Kubernetes)
4. **Testes**: Implemente testes unitários e integração
5. **Documentação**: Adicione Swagger/OpenAPI

---

**Este script fornece uma base completa para criar aplicações FAQ similares usando as mesmas tecnologias e padrões arquiteturais.**