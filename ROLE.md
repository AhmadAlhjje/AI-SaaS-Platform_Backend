# Backend — Project Role & Architecture Rules

> هذا الملف هو المرجع الرسمي والثابت لفريق Backend.
> أي كود أو تصميم يخالف هذه القواعد يجب رفضه أو تعديله قبل الدمج (Merge).

---

# 1. Project Overview

Backend لمنصة AI SaaS Multi-Tenant تسمح للشركات برفع بياناتها (PDF / CSV / Excel) وتحويلها إلى قاعدة معرفة ذكية يمكن استخدامها للإجابة على أسئلة العملاء.

يعتمد النظام على:

* RAG للبيانات غير المنظمة (PDF).
* SQL Query Agent للبيانات المنظمة (CSV / Excel).
* Multi-Tenant Architecture بحيث تكون بيانات كل شركة معزولة بالكامل عن الشركات الأخرى.

---

# 2. Technology Stack

| Component       | Value                    |
| --------------- | ------------------------ |
| Language        | TypeScript (Strict Mode) |
| Runtime         | Node.js LTS (20+)        |
| Framework       | NestJS 10+               |
| ORM             | Prisma                   |
| Database        | PostgreSQL 15+           |
| Cache           | Redis                    |
| Queue           | BullMQ                   |
| Vector Database | Qdrant                   |
| Package Manager | pnpm                     |

---

## AI Service

خدمة الذكاء الاصطناعي منفصلة بالكامل عن Backend.

Technology Example:

* Python
* FastAPI
* LangChain
* LlamaIndex

Backend يتعامل معها كخدمة خارجية عبر HTTP فقط.

---

# 3. Architecture Style

Modular Monolith + Clean Architecture + Feature-Based Modules

الأهداف:

* فصل Business Logic عن Framework.
* سهولة الصيانة والتوسع.
* قابلية الاختبار.
* سهولة تحويل Module إلى Microservice مستقبلاً عند الحاجة.
* منع الترابط القوي بين الميزات.

---

# 4. Project Structure

```text
src
├── shared
├── modules
├── infrastructure
└── main.ts
```

---

# 4.1 Shared

مكونات عامة مشتركة بين جميع Modules.

```text
shared
├── guards
├── decorators
├── interceptors
├── pipes
├── exceptions
├── logger
├── events
├── utils
└── constants
```

ممنوع وضع Business Logic داخل shared.

---

# 4.2 Modules

كل ميزة تمثل Module مستقل.

أمثلة:

```text
auth
companies
documents
data-tables
ai
conversations
subscriptions
settings
```

كل Module يتبع نفس الهيكلية:

```text
module
├── domain
├── application
├── infrastructure
└── presentation
```

---

# 4.3 Domain Layer

مسؤول عن Business Rules فقط.

يحتوي على:

```text
domain
├── entities
├── value-objects
├── repositories
├── events
├── errors
└── interfaces
```

أمثلة:

```text
CompanyEntity
DocumentEntity
ConversationEntity
```

ممنوع:

* NestJS
* Prisma
* Redis
* OpenAI
* Qdrant
* أي Framework أو Library خارجية

Domain يجب أن يكون Pure 100%.

---

# 4.4 Application Layer

تحتوي على Use Cases الخاصة بالنظام.

أمثلة:

```text
CreateCompanyUseCase
UploadDocumentUseCase
AskQuestionUseCase
DeleteDocumentUseCase
```

المسموح:

* Business Workflows
* Validation الخاصة بالمنطق
* Domain Services
* Repository Interfaces

الممنوع:

* Prisma Queries
* HTTP Calls
* OpenAI Calls
* Qdrant Calls
* Redis Calls

Application تعتمد فقط على Interfaces.

---

# 4.5 Infrastructure Layer

تنفيذ Interfaces الموجودة في Domain/Application.

أمثلة:

```text
PrismaCompanyRepository
PrismaDocumentRepository

QdrantVectorStore

RedisCacheService

HttpAIProvider

S3StorageProvider
```

هذه الطبقة فقط يسمح لها بالتعامل مع:

* Prisma
* PostgreSQL
* Redis
* Qdrant
* External APIs
* AI Service

---

# 4.6 Presentation Layer

واجهة النظام.

تحتوي على:

```text
controllers
dto
responses
routes
```

المسموح:

* Request DTO
* Response DTO
* Mapping

الممنوع:

* Business Logic
* Database Logic
* AI Logic

---

# 4.7 Global Infrastructure

بنية عامة لا تخص Module واحد.

```text
infrastructure
├── database
├── redis
├── config
├── health
└── monitoring
```

---

# 5. Request Flow

```text
Controller
      ↓
Use Case
      ↓
Repository Interface
      ↓
Repository Implementation
      ↓
Database / External Service
```

---

# 6. Dependency Rules

الاتجاه الوحيد المسموح:

```text
Presentation
      ↓
Application
      ↓
Domain
```

Infrastructure تعتمد على Domain/Application لتنفيذ Interfaces.

ممنوع العكس.

---

# 7. Module Communication Rules

Modules يجب أن تكون مستقلة قدر الإمكان.

التواصل بينها يتم فقط عبر:

* Public Application Services
* Interfaces
* Domain Events
* Application Events

ممنوع الوصول المباشر إلى Infrastructure الخاصة بـ Module آخر.

---

# 8. AI Integration Rules

AI Service تعتبر External Gateway.

يجب تعريف Interface:

```ts
interface AIProvider {
   ask(...): Promise<any>;
}
```

ثم تنفيذه داخل Infrastructure:

```ts
HttpAIProvider
```

ممنوع استدعاء AI Service مباشرة من:

* Controller
* Use Case

إلا عبر Interface.

---

# 9. Repository Rules

كل Repository يجب أن يملك Interface.

مثال:

```text
domain/repositories/document.repository.ts
```

والتنفيذ:

```text
infrastructure/repositories/prisma-document.repository.ts
```

---

# 10. Multi-Tenancy Rules

هذه القواعد إلزامية.

1. كل Query يجب أن تكون مقيدة بـ company_id.
2. يمنع تمرير company_id من Request Body.
3. company_id يستخرج فقط من:

   * JWT
   * Authenticated User Context
4. أي Use Case يتعامل مع بيانات شركة يجب أن يتحقق من الملكية (Ownership Validation).

أي مخالفة تعتبر ثغرة أمنية.

---

# 11. Database Rules

الكيانات الأساسية:

```text
USERS
COMPANIES
DOCUMENTS
DOCUMENT_CHUNKS
DATA_TABLES
AI_CONFIGURATION
CONVERSATIONS
MESSAGES
PLANS
SUBSCRIPTIONS
```

العلاقات:

```text
USER          1:1   COMPANY

COMPANY       1:N   DOCUMENTS

DOCUMENT      1:N   DOCUMENT_CHUNKS

COMPANY       1:N   DATA_TABLES

COMPANY       1:1   AI_CONFIGURATION

COMPANY       1:N   CONVERSATIONS

CONVERSATION  1:N   MESSAGES

PLAN          1:N   SUBSCRIPTIONS

COMPANY       1:N   SUBSCRIPTIONS
```

---

# 12. Dynamic Tables Rules

CSV و Excel يتم تحويلها إلى جداول PostgreSQL ديناميكية.

DATA_TABLES تحتوي Metadata فقط:

```text
table_name
schema_json
created_at
```

يمنع:

```ts
const sql = "SELECT * FROM " + tableName;
```

يسمح فقط باستخدام:

* Parameterized Queries
* Whitelisted Table Names

لمنع SQL Injection.

---

# 13. Queue Rules

العمليات الثقيلة يجب أن تعمل عبر BullMQ.

أمثلة:

* PDF Parsing
* Chunk Generation
* Embeddings Creation
* Data Import
* Vector Indexing

ممنوع تنفيذها داخل Request مباشرة.

---

# 14. Domain Events

الأحداث جزء أساسي من النظام.

أمثلة:

```text
DocumentUploadedEvent

DocumentDeletedEvent

ConversationCreatedEvent

SubscriptionActivatedEvent
```

مثال:

```text
UploadDocumentUseCase
      ↓
DocumentUploadedEvent
      ↓
GenerateEmbeddingsJob
```

بدلاً من استدعاء الخدمات الثقيلة مباشرة.

---

# 15. Transactions

أي Use Case يعدل أكثر من Aggregate يجب أن يستخدم Transaction.

أمثلة:

```text
CreateCompany
CreateUser
CreateSubscription
```

يجب تنفيذها كعملية واحدة.

في حال الفشل:

```text
Rollback All Changes
```

---

# 16. Validation Rules

التحقق من المدخلات يتم في Presentation Layer فقط.

باستخدام:

```text
class-validator
class-transformer
```

قبل الوصول إلى Use Case.

---

# 17. Security Rules

ممنوع:

* Hardcoded Secrets
* API Keys داخل الكود
* DB Credentials داخل الكود

يسمح فقط عبر:

```text
.env
ConfigService
```

---

# 18. Logging Rules

استخدام Logger موحد فقط.

```text
shared/logger
```

ممنوع:

```ts
console.log()
```

في Production.

---

# 19. Prisma Rules

ممنوع استخدام:

```ts
import { User } from '@prisma/client';
```

داخل:

```text
domain
application
```

يسمح بها فقط داخل:

```text
infrastructure
```

---

# 20. Testing Rules

كل Use Case يجب أن يملك:

* Unit Test للحالة الأساسية.
* Unit Test لحالة الفشل.

يفضل تغطية:

```text
Success Path
Failure Path
Authorization Path
Validation Path
```

---

# 21. Naming Conventions

الملفات:

```text
kebab-case
```

أمثلة:

```text
upload-document.use-case.ts

create-company.use-case.ts
```

الكلاسات:

```text
PascalCase
```

الجداول والأعمدة:

```text
snake_case
```

---

# 22. Feature Checklist

عند إضافة أي ميزة جديدة:

* هل تنتمي إلى Module موجود أم تحتاج Module جديد؟
* هل Domain مستقل ونظيف؟
* هل يوجد Use Case واضح؟
* هل يوجد Repository Interface؟
* هل Controller خالٍ من Business Logic؟
* هل تم تطبيق Multi-Tenant Scoping؟
* هل العمليات الثقيلة عبر Queue؟
* هل يوجد Unit Tests؟
* هل تم تعريف Events عند الحاجة؟

---

# 23. Forbidden Changes

لا يجوز تغيير العناصر التالية دون موافقة Architect المشروع:

* NestJS
* Prisma
* PostgreSQL
* Redis
* Qdrant
* Modular Monolith Architecture
* Clean Architecture Layers
* Multi-Tenant Scoping Rules
* Domain Purity Rules
