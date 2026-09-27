export interface Section {
  id: string;
  number: string;
  title: string;
  content: SectionContent[];
}

export type SectionContent =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level: 2 | 3 }
  | { type: 'code'; text: string; label?: string }
  | { type: 'tree'; text: string; label?: string }
  | { type: 'list'; items: string[] }
  | { type: 'numbered-list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'highlight'; text: string }
  | { type: 'invariants'; items: string[] }
  | { type: 'blockquote'; text: string };

export const sections: Section[] = [
  {
    id: 'a1',
    number: 'A.1',
    title: 'هدف سیستم',
    content: [
      { type: 'paragraph', text: 'این پروژه یک AI App Platform است که هدف آن فراهم کردن یک پلتفرم عمومی برای اجرای Agentهای هوشمند و انجام Taskهای نرم‌افزاری روی پروژه‌های واقعی است.' },
      { type: 'paragraph', text: 'پلتفرم باید بتواند یک Project را از یک Repository موجود در Git دریافت کند، Repository را در Workspace مربوط به پروژه Clone/Checkout کند، Source Code و سایر اطلاعات پروژه را تحلیل و Index کند و سپس بر اساس Task جاری، Context مناسب را ساخته و در اختیار Agent و در نهایت LLM قرار دهد.' },
      { type: 'paragraph', text: 'Agentها باید بتوانند با استفاده از Toolها روی پروژه عملیات انجام دهند؛ از جمله: بررسی و تحلیل Source Code، جستجو در Codebase، ایجاد و ویرایش فایل، اجرای Build و Test، اجرای ابزارهای پروژه، تحلیل خطاها، اعمال تغییرات، اجرای Validation، ایجاد Commit، Push کردن تغییرات و ایجاد Pull Request.' },
      { type: 'paragraph', text: 'معماری سیستم باید به شکلی طراحی شود که اضافه کردن Agent، Role، Skill، Tool، Workflow، Prompt یا Knowledge جدید بدون تغییر Hard-Code در Core Platform امکان‌پذیر باشد.' },
      { type: 'heading', text: 'اصل کلی سیستم', level: 3 },
      { type: 'code', text: `Git / Files = Source of Truth
Database = Metadata / Index
RAG = Retrieval
Disk / Workspace = Active Runtime State` },
      { type: 'heading', text: 'تفکیک دامنه‌ها', level: 3 },
      { type: 'code', text: `Knowledge ≠ Memory
Knowledge ≠ Prompt
Memory ≠ RAG
Prompt ≠ Workflow
Workflow ≠ Agent
Agent ≠ Tool
Role ≠ Agent
Agent ≠ Team
Agent ≠ Skill
Tool Definition ≠ Tool Implementation
Git ≠ Workspace
Codebase Intelligence ≠ Knowledge
Codebase Intelligence ≠ RAG
RAG ≠ Source of Truth
Context Engine ≠ Knowledge Management
LangGraph ≠ Workflow Definition
LangChain / Spring AI ≠ Platform Domain Management
Connector ≠ MCP
Connector ≠ Tool
Connector ≠ Tool Executor
Connector ≠ External System` },
      { type: 'paragraph', text: 'هر ماژول باید مسئولیت مشخص خود را داشته باشد و مسئولیت‌ها نباید با یکدیگر ترکیب شوند.' },
    ]
  },
  {
    id: 'a2',
    number: 'A.2',
    title: 'اصول معماری',
    content: [
      { type: 'paragraph', text: 'سیستم باید:' },
      { type: 'list', items: [
        'Configuration-Driven باشد.',
        'Versioned باشد.',
        'Dynamic باشد.',
        'Extensible باشد.',
        'Modular باشد.',
        'دارای Separation of Concerns مشخص باشد.',
        'از Hard-Code کردن رفتار Agentها و Workflowها در Core جلوگیری کند.',
        'Source of Truth را از Runtime State و Retrieval جدا نگه دارد.',
        'امکان اجرای Incremental و Full Processing را داشته باشد.',
        'قابلیت استفاده از چند Agent در قالب Agent Team را داشته باشد.',
        'Workflowها را به صورت Machine-Readable تعریف کند.',
        'امکان Trace و Reproduce کردن Context و تصمیمات Agent را فراهم کند.',
      ]},
    ]
  },
  {
    id: 'a3',
    number: 'A.3',
    title: 'Technology Stack',
    content: [
      { type: 'list', items: [
        'Java 21',
        'Spring Boot 4',
        'LangChain و/یا Spring AI برای LLM، Tool Calling، Retrieval و Agent Execution',
        'LangGraph برای Orchestration، State، Workflow Execution و Agent Team Coordination',
        'Frontend: React 19، کاملاً RTL، طراحی حرفه‌ای/Enterprise و مناسب کاربر ایرانی',
      ]},
    ]
  },
  {
    id: 'a4',
    number: 'A.4',
    title: 'معماری سطح بالا',
    content: [
      { type: 'tree', text: `Platform
 ├── Project Management
 ├── Prompt Management
 ├── Tool Management
 ├── Skill Management
 ├── Role Management
 ├── Agent Management
 ├── Connector Management
 ├── Git Management
 ├── Workspace
 ├── Knowledge Management
 ├── Memory
 ├── RAG
 ├── Project Codebase Intelligence
 ├── Context Engine
 └── Workflow` },
      { type: 'heading', text: 'جریان اجرا', level: 3 },
      { type: 'tree', text: `              Context Engine
                    ↓
              Workflow / LangGraph
                    ↓
               Agent Team
                    ↓
               Agent Runtime
                    ↓
                  LLM
                    ↓
              Tool Execution
                    ↓
                Workspace
                    ↓
          Build / Test / Review
                    ↓
              Git Commit / Push
                    ↓
                   PR` },
      { type: 'highlight', text: 'اصل کلیدی: Agent نباید برای هر Task مجبور باشد کل Project را دوباره بخواند.' },
    ]
  },
  {
    id: 'a5',
    number: 'A.5',
    title: 'مدل پروژه',
    content: [
      { type: 'tree', text: `Project
 ├── Git Repository
 ├── Git Connector
 ├── Workspace
 ├── Project Configuration
 ├── Project Knowledge
 ├── Project Instructions
 ├── Project Agent Team
 ├── Project Roles
 ├── Project Skills
 ├── Project Workflows
 ├── Project Runtime Memory
 ├── Codebase Intelligence
 └── RAG Index` },
      { type: 'paragraph', text: 'Git منبع اصلی Source Code است. Workspace نسخه Runtime و Working Copy پروژه است و Source of Truth مستقل نیست. Platform نباید Source Code را به‌عنوان یک کپی مستقل و دائمی از Git نگهداری کند.' },
    ]
  },
  {
    id: 'a6',
    number: 'A.6',
    title: 'مدیریت Git',
    content: [
      { type: 'paragraph', text: 'Git Management یک Module مستقل برای Repository/Git Lifecycle است.' },
      { type: 'paragraph', text: 'مسئولیت‌ها: Repository Configuration، Clone، Fetch، Pull، Checkout، Branch Management، Task Branch، Commit، Push، Diff، Merge Information، Pull Request، History، Revision/SHA، مقایسه Revisionها.' },
      { type: 'paragraph', text: 'مسئول Knowledge، Memory، RAG، Agent Execution، Prompt، Workflow یا Tool Definition نیست.' },
      { type: 'paragraph', text: 'هر Task روی Branch مخصوص همان Task اجرا می‌شود:' },
      { type: 'code', text: `Repository → Task Branch → Agent Execution → Changes →
Validation / Test → Commit → Push → Pull Request` },
    ]
  },
  {
    id: 'a7',
    number: 'A.7',
    title: 'Workspace',
    content: [
      { type: 'paragraph', text: 'Workspace محیط Runtime پروژه است و شامل: Repository Files، Generated Files، Build Artifacts، Temporary Runtime Files، Command Execution Environment، Agent Changes، Test Outputs، Build Outputs.' },
      { type: 'code', text: `Git Repository = Remote / Canonical Source
Workspace      = Local Runtime Working Copy` },
      { type: 'paragraph', text: 'Agent نباید برای هر operation مستقیماً Git Command اجرا کند؛ عملیات باید از Connector + Tool Executor عبور کند.' },
    ]
  },
  {
    id: 'a8',
    number: 'A.8',
    title: 'Knowledge',
    content: [
      { type: 'paragraph', text: 'Knowledge شامل اطلاعات دائمی، پایدار و قابل استناد است: Architecture، Coding Standards، Design Rules، Engineering Conventions، API Contracts، Domain Rules، ADRها، Platform Standards، Project Instructions، Engineering Standards.' },
      { type: 'paragraph', text: 'Knowledge باید در Versioned Files/Git به‌عنوان Source of Truth نگهداری شود. RAG فقط Index و Retrieval این اطلاعات است و Source of Truth نیست.' },
      { type: 'heading', text: 'Knowledge vs Memory', level: 3 },
      { type: 'table', headers: ['Knowledge', 'Memory'], rows: [
        ['دائمی', 'Runtime'],
        ['پایدار', 'History'],
        ['قابل استناد', 'Current Task State / Plan'],
        ['Versioned', 'Decisions, Discoveries'],
        ['قابل استفاده مجدد', 'Test Results, Execution History'],
        ['دارای Source of Truth', 'Intermediate Results, Task Summary'],
      ]},
      { type: 'highlight', text: 'Knowledge ≠ Memory' },
      { type: 'heading', text: 'Platform Knowledge', level: 3 },
      { type: 'paragraph', text: 'برای همه Projectها قابل استفاده: Platform Architecture، General Coding Standards، Java Standards، Spring Boot Standards، Testing Standards، Git Standards، Security Standards، General AI Instructions، Engineering Standards. Versioned است؛ Project نسخه مورد استفاده را انتخاب می‌کند.' },
      { type: 'heading', text: 'Project Knowledge', level: 3 },
      { type: 'paragraph', text: 'مخصوص همان پروژه، در Repository نگهداری می‌شود:' },
      { type: 'tree', text: `.ai/
├── knowledge/
├── instructions/
├── decisions/
├── agents/
├── workflows/
├── codebase/
└── runtime/` },
      { type: 'heading', text: 'Knowledge & Instruction Management', level: 3 },
      { type: 'paragraph', text: 'ماژول مستقل مسئول: Storage، Versioning، Validation، Discovery، Resolution، Scope، Priority، References، Project Binding، Task-specific Knowledge Resolution، Conflict Detection، Conflict Resolution.' },
      { type: 'paragraph', text: 'نباید با RAG، Memory، Prompt Management یا Context Engine یکی شود.' },
      { type: 'heading', text: 'Resolution Hierarchy', level: 3 },
      { type: 'code', text: 'Platform → Project → Workflow → Task' },
      { type: 'paragraph', text: 'Overrideها باید Explicit و Traceable باشند، نه Silent.' },
    ]
  },
  {
    id: 'a9',
    number: 'A.9',
    title: 'مدیریت Prompt',
    content: [
      { type: 'paragraph', text: 'مستقل از Knowledge Management. مسئول: Prompt Definition، Version، Template، Variables، Composition، Runtime Configuration، Model Configuration، Rendering.' },
      { type: 'code', text: `Knowledge = Agent باید چه چیزی را بداند
Prompt    = اطلاعات چگونه در Model Input استفاده شود` },
      { type: 'heading', text: 'مدل Final Prompt', level: 3 },
      { type: 'code', text: `Prompt Template
+ Resolved Knowledge
+ Instructions
+ Role
+ Skill
+ Workflow Context
+ Task
+ Relevant Code Context
+ Memory
+ Tool Definitions
= Model Input` },
      { type: 'heading', text: 'تقسیم مسئولیت', level: 3 },
      { type: 'list', items: [
        'Knowledge Manager = Resolve Knowledge',
        'Context Engine = Assemble Context',
        'Prompt Manager = Template/Composition/Rendering',
      ]},
    ]
  },
  {
    id: 'a10',
    number: 'A.10',
    title: 'مدیریت Agent',
    content: [
      { type: 'paragraph', text: 'Agent یک Execution Entity قابل استفاده مجدد در Platform است.' },
      { type: 'paragraph', text: 'Agent Definition شامل: Agent Type، Capabilities، Configuration، Default Prompt، Allowed Tools، Skills، Model Configuration، Runtime Configuration، Execution Policies.' },
      { type: 'paragraph', text: 'Agent مستقل از Project است و نباید شامل Project، Knowledge، Instructions، Memory، Source Code، Repository یا Task باشد.' },
      { type: 'code', text: 'Agent Definition + Project Context + Task Context + Workflow State = Agent Runtime Context' },
      { type: 'paragraph', text: 'Agentهای اصلی در سطح Platform تعریف می‌شوند و بین Projectها Reusable هستند. Project تعریف اصلی Agent را تغییر نمی‌دهد و فقط Agentهای موجود را Add/Enable/Disable و Configure می‌کند. Custom/Extension Agent فقط از طریق Mechanism صریح و Versioned اضافه می‌شود.' },
    ]
  },
  {
    id: 'a11',
    number: 'A.11',
    title: 'مدیریت Role',
    content: [
      { type: 'paragraph', text: 'Role با Agent متفاوت است. Role تعریف می‌کند: Responsibility، Position، Capability، Constraints، جایگاه در Team یا Process.' },
      { type: 'paragraph', text: 'نمونه‌ها: Architect، Developer، Reviewer، Tester، Security Reviewer، Planner.' },
      { type: 'paragraph', text: 'Role مالک Prompt/Skill/Tool نیست؛ آن‌ها را Reference یا Policy می‌کند. یک Agent می‌تواند در Workflowهای مختلف Roleهای متفاوت داشته باشد.' },
    ]
  },
  {
    id: 'a12',
    number: 'A.12',
    title: 'مدیریت Skill',
    content: [
      { type: 'paragraph', text: 'Skill یک Capability/Expertise قابل استفاده توسط Agent است: Java، Spring Boot، Database Design، API Design، Testing، Security، Refactoring، Git.' },
      { type: 'code', text: `Agent = چه کسی اجرا می‌کند
Role  = در چه نقشی اجرا می‌کند
Skill = چه تخصصی دارد` },
    ]
  },
  {
    id: 'a13',
    number: 'A.13',
    title: 'Agent Team',
    content: [
      { type: 'paragraph', text: 'Platform Agentهای Reusable دارد؛ هر Project یک Project Agent Team/Agent Pool دارد.' },
      { type: 'code', text: `Platform Agents → Project Agent Team → Task → Planning →
Dynamic Agent Selection → LangGraph Execution Graph → Agent Runtime` },
      { type: 'paragraph', text: 'Team در سطح Project نسبتاً Static است و به ازای هر Task ساخته نمی‌شود. Project Owner/Admin در Project Settings آن را مدیریت می‌کند (Add/Remove/Enable/Disable/Project-level Settings).' },
      { type: 'heading', text: 'Team vs Task', level: 3 },
      { type: 'paragraph', text: 'یک Project Team برای تعداد زیادی Task استفاده می‌شود؛ هر Task فقط Agentهای مرتبط را انتخاب می‌کند.' },
      { type: 'heading', text: 'Team vs Workflow', level: 3 },
      { type: 'code', text: `Team     = Which Agents Are Available
Workflow = How Agents Execute` },
      { type: 'paragraph', text: 'Team مسئول Membership/Availability است؛ Workflow مسئول Order، Dependency، Condition، Parallelism، Validation، Approval، Retry، Failure، Handoff، Branching. Team ترتیب اجرا را تعیین نمی‌کند.' },
      { type: 'heading', text: 'Dynamic Agent Selection', level: 3 },
      { type: 'paragraph', text: 'مثال: Team پروژه شامل Architect/Backend/Frontend/Security/Reviewer/QA است؛ یک Task مربوط به OAuth فقط Architect/Backend/Security/Reviewer/QA را انتخاب می‌کند؛ یک Task مربوط به React UI فقط Frontend/Reviewer/QA را.' },
      { type: 'paragraph', text: 'Project Team باید Versioned باشد؛ Task Execution باید Team Version مورد استفاده را ثبت کند؛ تغییر Team نباید Executionهای قبلی را Retroactively تغییر دهد.' },
    ]
  },
  {
    id: 'a14',
    number: 'A.14',
    title: 'Planner',
    content: [
      { type: 'paragraph', text: 'Planner Task را تحلیل می‌کند و Plan می‌سازد. Plan شامل: Steps، Required Capabilities، Required Agents، Dependencies، Parallelizable Steps، Validation، Expected Outputs، Handoffs.' },
      { type: 'paragraph', text: 'Planner Stepها را به Agentهای موجود در Project Team Map می‌کند و نمی‌تواند Agent خارج از Team انتخاب کند.' },
    ]
  },
  {
    id: 'a15',
    number: 'A.15',
    title: 'LangGraph',
    content: [
      { type: 'paragraph', text: 'مسئول: Orchestration، State Management، Agent Coordination، Execution، Branching، Conditional Routing، Parallel Execution، Handoff، Retry، Validation، Re-planning، Workflow State، Execution State.' },
      { type: 'paragraph', text: 'LangGraph از Plan + Workflow یک Execution Graph می‌سازد و اجرا می‌کند.' },
      { type: 'code', text: `Workflow  = Execution Rules / Process Definition
LangGraph = Execution Engine / Orchestrator` },
      { type: 'paragraph', text: 'Workflow باید Machine-readable باشد تا LangGraph آن را اجرا کند و نباید به Implementation داخلی LangGraph وابسته باشد.' },
    ]
  },
  {
    id: 'a16',
    number: 'A.16',
    title: 'Workflow',
    content: [
      { type: 'paragraph', text: 'مستقل از Agent، Prompt، Tool و Team. یک Definition ماشین‌خوان شامل: Steps، Dependencies، Conditions، Validation، Approval، Handoff، Parallel Execution، Retry، Failure Handling، Branching.' },
      { type: 'paragraph', text: 'می‌تواند در Platform یا Project تعریف شود؛ Project می‌تواند Workflow عمومی را Configure/Extend کند.' },
      { type: 'heading', text: 'نمونه Workflow', level: 3 },
      { type: 'code', text: `workflow:
  name: software-development
  planning:
    enabled: true
  agent_selection:
    source: project_team
    strategy: dynamic
  execution:
    allow_parallel: true
  validation:
    required: true
  approval:
    required: false
  steps:
    - planner
    - architect
    - developer
    - tester
    - reviewer` },
      { type: 'heading', text: 'Dynamic Execution Graph', level: 3 },
      { type: 'paragraph', text: 'Graph هر Task می‌تواند متفاوت باشد و بر اساس Task + Plan + Workflow + Available Project Team + Runtime State ساخته می‌شود. در صورت Reject در مرحله Review، بازگشت به مرحله قبل (مثلاً Backend) و تکرار Review اتفاق می‌افتد.' },
    ]
  },
  {
    id: 'a17',
    number: 'A.17',
    title: 'Agent Runtime Context',
    content: [
      { type: 'code', text: `Agent Definition + Role + Prompt + Skills + Tools
+ Project Knowledge + Instructions + Project Memory
+ Source Code + Task + Previous Agent Outputs + Workflow State` },
      { type: 'paragraph', text: 'Agent Definition مالک این Context نیست. Project-specific Knowledge/Instructions فقط در Runtime و در Project/Task خاص Inject می‌شوند؛ Definition اصلی Agent تغییر نمی‌کند (Same Agent + Project A ≠ Same Agent + Project B از نظر Runtime).' },
      { type: 'paragraph', text: 'Team مالک Memory نیست؛ Agent از طریق Context Engine، Memory مرتبط را دریافت می‌کند.' },
    ]
  },
  {
    id: 'a18',
    number: 'A.18',
    title: 'UI سطح Platform/Project/Task',
    content: [
      { type: 'list', items: [
        'Agent UI (Platform): Identity، Role، Model Configuration، Prompt References، Skill References، Tool References/Policies، Runtime Configuration، Execution Policies، Version، Status.',
        'Project Agent Team UI: نمایش Platform Agents، Add/Enable/Disable، Project-level Settings؛ Team جدید برای هر Task ساخته نمی‌شود.',
        'Task UI: کاربر فقط Task را ایجاد می‌کند؛ سیستم Plan → Agent Selection → Execution Graph را Dynamic انجام می‌دهد. نمایش اختیاری: Selected Agents، Agents Not Used، Execution Graph، Current Step، Agent Handoff. Human Override: Automatic / Manual / Automatic with Approval — در Manual فقط Agentهای Project Team قابل Add/Constraint هستند.',
      ]},
    ]
  },
  {
    id: 'a19',
    number: 'A.19',
    title: 'Memory',
    content: [
      { type: 'paragraph', text: 'Memory برای Runtime State و History است: Current Task State، Current Plan، Decisions، Discoveries، Test Results، Execution History، Intermediate Results، Task Summary.' },
      { type: 'paragraph', text: 'Active/Short-term Memory روی Disk و Markdown نگهداری می‌شود:' },
      { type: 'tree', text: `.ai/runtime/
├── current-task.md
├── current-plan.md
├── discoveries.md
├── decisions.md
├── touched-files.md
├── test-results.md
└── task-summary.md` },
      { type: 'heading', text: 'Long-Term Memory', level: 3 },
      { type: 'code', text: `Runtime Memory → Summarize/Classify → Validation → Long-Term Memory → RAG Index` },
      { type: 'highlight', text: 'RAG ≠ Memory Source of Truth' },
    ]
  },
  {
    id: 'a20',
    number: 'A.20',
    title: 'RAG',
    content: [
      { type: 'paragraph', text: 'Retrieval Layer مستقل که می‌تواند Index کند: Source Code، Documentation، Platform Knowledge، Project Knowledge، ADRها، Historical Memory، Technical Documentation.' },
      { type: 'code', text: 'Source → Indexer → RAG Index → Retriever' },
      { type: 'highlight', text: 'RAG Source of Truth نیست. اگر RAG با Source File تضاد داشت، Source File Wins؛ RAG باید Trace به Source را حفظ کند.' },
      { type: 'paragraph', text: 'Capabilities: Vector Search، Hybrid Search، Metadata Filtering، Graph Traversal، Reranking، Embeddings، Indexing، Retrieval.' },
      { type: 'paragraph', text: 'Infrastructure پیشنهادی: Qdrant (Vector)، Neo4j (Graph) — این‌ها Infrastructure هستند، نه Domain Owner؛ Platform باید Interfaceهای خود را داشته باشد.' },
    ]
  },
  {
    id: 'a21',
    number: 'A.21',
    title: 'Project Codebase Intelligence',
    content: [
      { type: 'paragraph', text: 'ماژول مستقل برای Current Codebase Understanding.' },
      { type: 'code', text: `Codebase Intelligence ≠ Knowledge Management
Codebase Intelligence ≠ RAG` },
      { type: 'paragraph', text: 'هدف: Agent برای هر Task مجبور به Re-read کل Repository نباشد.' },
      { type: 'code', text: 'Git / Workspace → Codebase Intelligence → .ai/codebase/' },
      { type: 'paragraph', text: '.ai/codebase/ یک Derived Projection/Context است، نه Source of Truth.' },
      { type: 'tree', text: `.ai/codebase/
├── overview.md
├── architecture.md
├── modules.md
├── dependencies.md
├── conventions.md
└── structure/` },
      { type: 'paragraph', text: 'Generated Files باید Metadata داشته باشند: Generated Header، Source Commit، Generator، Generator Version.' },
      { type: 'paragraph', text: 'اگر Codebase Projection با Official Architecture Knowledge تضاد داشت: Official Knowledge Wins — و Conflict باید Detectable باشد.' },
      { type: 'heading', text: 'Full Indexing', level: 3 },
      { type: 'paragraph', text: 'در: Project Creation، First Clone، Major Repository Change، Parser Change، Index Schema Change، Codebase Intelligence Version Change.' },
      { type: 'code', text: `Repository → Parser → AST → Code Model → Code Graph → Semantic Chunks → Vector/Graph Index` },
      { type: 'heading', text: 'Incremental Indexing', level: 3 },
      { type: 'paragraph', text: 'برای تغییرات معمولی:' },
      { type: 'code', text: `Previous Commit → Git Diff → Changed Files → Affected Symbols → Reparse →
Update Graph → Update Vector Index` },
      { type: 'paragraph', text: 'بعد از هر تغییر، کل Repository دوباره Index نمی‌شود.' },
      { type: 'heading', text: 'Code Graph', level: 3 },
      { type: 'paragraph', text: 'ترجیحاً با Static Analysis/AST و Deterministic Processing ساخته می‌شود؛ LLM منبع اصلی Code Graph نیست.' },
      { type: 'paragraph', text: 'Nodes: Classes، Interfaces، Enums، Methods، Fields، Packages، Modules. Relationships: Imports، Inheritance، Implementations، Method Calls، Dependencies.' },
      { type: 'heading', text: 'Codebase Search', level: 3 },
      { type: 'paragraph', text: 'Vector Search: Semantic Search، Metadata Filtering، Hybrid Search، Incremental Upsert، Delete، Version Tracking.' },
      { type: 'paragraph', text: 'Hybrid Retrieval: Semantic Search + Lexical Search + Metadata + Code Graph + Reranking' },
      { type: 'paragraph', text: 'مثال (Where is payment authorization implemented?): Semantic Search → Symbol/File Finding → Code Graph Traversal → Caller/Callee Analysis → Reranking.' },
    ]
  },
  {
    id: 'a22',
    number: 'A.22',
    title: 'Context Engine',
    content: [
      { type: 'paragraph', text: 'مسئول جمع‌آوری و Assembly Context مورد نیاز Agent؛ مالک Sourceها نیست.' },
      { type: 'paragraph', text: 'Sources: Platform Knowledge، Project Knowledge، Instructions، Workflow، Agent، Role، Skill، Project Memory، Chat Memory، Task State، Codebase Intelligence، Workspace، RAG، Source Code، Tools، Current Task.' },
      { type: 'heading', text: 'Local-First / Layered Retrieval', level: 3 },
      { type: 'code', text: `Level 1 — Canonical Local Context
.ai/knowledge, .ai/instructions, .ai/decisions

Level 2 — Current Codebase
.ai/codebase, Workspace, Local Code Search

Level 3 — Deep / Historical Retrieval
RAG, Vector Search, Graph Search, Long-Term Memory` },
      { type: 'heading', text: 'Local Project Context Tools', level: 3 },
      { type: 'code', text: `get_project_overview()
get_project_architecture()
get_module_context(module)
get_file_context(path)
get_symbol_context(symbol)
get_codebase_dependencies(symbol)
search_local_codebase(query)` },
      { type: 'paragraph', text: 'این Toolها فقط Local Context را می‌خوانند؛ تصمیم استفاده از RAG با Context Engine/Retrieval Policy است، نه Local Tool.' },
      { type: 'highlight', text: 'اصل Assembly: Context فقط باید شامل اطلاعات Relevant برای Task و Step جاری باشد؛ Agent نباید کل Project را برای هر Task بخواند.' },
      { type: 'heading', text: 'Context Retrieval Decision', level: 3 },
      { type: 'code', text: `1. Direct Task Context
2. Project Knowledge / Instructions
3. Current Project Codebase Intelligence
4. Workspace / Local Code
5. Relevant Memory
6. RAG / Deep Retrieval
7. External Connector Data` },
      { type: 'paragraph', text: 'این ترتیب الزام مطلق نیست؛ اصل Local-first و Source-of-Truth-first باید حفظ شود.' },
    ]
  },
  {
    id: 'a23',
    number: 'A.23',
    title: 'Database',
    content: [
      { type: 'paragraph', text: 'برای Operational Metadata/Index: Project Metadata، Repository Configuration، Agent Definitions، Tool Definitions، Workflow Metadata، Knowledge Metadata، Version References، Index Metadata، Task Metadata، Execution Metadata، Configuration Metadata.' },
      { type: 'paragraph', text: 'Canonical Knowledge نباید فقط در Database باشد.' },
    ]
  },
  {
    id: 'a24',
    number: 'A.24',
    title: 'Versioning و Reproducibility',
    content: [
      { type: 'paragraph', text: 'باید Versioned باشند: Knowledge، Instructions، Prompts، Agents، Roles، Skills، Workflows، Tool Definitions، Connector Configurations، Project Teams، Index Schema، Parser، Embedding Model، Codebase Intelligence Version.' },
      { type: 'paragraph', text: 'Execution Trace باید شامل باشد: Project، Repository، Branch، Commit، Task، Workflow Version، Agent Version، Role Version، Skill Version، Prompt Version، Knowledge Version، Context Snapshot، Tool Versions، Connector Configuration/Version، RAG Index Version، Model Configuration، Team Version.' },
      { type: 'paragraph', text: 'هدف: Reproducibility، Auditability، Debugging، Historical Reconstruction.' },
    ]
  },
  {
    id: 'a25',
    number: 'A.25',
    title: 'RAG Index Metadata & Lifecycle',
    content: [
      { type: 'paragraph', text: 'Metadata: projectId, repository, branch, commitSha, filePath, symbol, lineRange, contentHash, parserVersion, embeddingVersion, indexVersion, indexedAt' },
      { type: 'code', text: `Initial:
Repository → Full Index` },
      { type: 'paragraph', text: 'بعد از تغییر:' },
      { type: 'code', text: `Previous Indexed Commit → New Commit → Git Diff → Changed/Affected Files →
Reparse → Graph Update → Vector Index Update → New Indexed Commit` },
      { type: 'paragraph', text: 'Permanent Repository Indexing بهتر است روی Target Branch نهایی (بعد از Merge) انجام شود. Temporary Task Branch Indexing اختیاری است.' },
    ]
  },
  {
    id: 'a26',
    number: 'A.26',
    title: 'چرخه حیات کامل Task',
    content: [
      { type: 'code', text: `Create Task → Resolve Project → Prepare Workspace →
Create/Checkout Task Branch → Resolve Knowledge → Resolve Agent Team →
Resolve Workflow → Load Project Context → Load Codebase Intelligence →
Retrieve Additional RAG Context → Assemble Context → Plan Task →
Dynamic Agent Selection → Create Execution Graph → Execute Workflow →
Agent/Tool Execution → Code Changes → Build/Test/Validation → Review →
Commit → Push → Pull Request → Update Runtime Memory →
Promote Relevant Long-Term Memory` },
    ]
  },
  {
    id: 'a27',
    number: 'A.27',
    title: 'معماری Runtime کامل',
    content: [
      { type: 'code', text: `User → Task → Project Resolution → Workspace Preparation → Task Branch →
Knowledge Resolution → Agent Team Resolution → Workflow Resolution →
Context Engine (Platform Knowledge, Project Knowledge, Instructions,
Project Memory, Chat Memory, Codebase Intelligence, Workspace, Source
Code, RAG) → Planner → Dynamic Agent Selection → LangGraph →
Agent Runtime → LLM → Tool Calling → Tool Executor → Connector →
Adapter → External System

Agent Code Changes → Workspace → Build/Test/Review → Git Management →
Git Connector → Commit/Push/PR` },
    ]
  },
  {
    id: 'a28',
    number: 'A.28',
    title: 'مرزهای ماژول‌ها',
    content: [
      { type: 'table', headers: ['ماژول', 'مسئولیت'], rows: [
        ['Project Management', 'Project identity/configuration'],
        ['Prompt Management', 'Prompt Definition/Version/Template/Variables/Composition/Rendering'],
        ['Tool Management', 'Tool Definition/Schema/Capability/Permission/Assignment/Configuration'],
        ['Skill Management', 'Skill Definition/Expertise'],
        ['Role Management', 'Role Definition/Responsibility/Constraints'],
        ['Agent Management', 'Agent Definition/Capabilities/Runtime Configuration'],
        ['Connector Management', 'External Connection/Authentication/Capability/Adapter'],
        ['Git Management', 'Repository/Branch/Commit/Push/PR Lifecycle'],
        ['Workspace', 'Runtime Working Copy/Files/Build/Test'],
        ['Knowledge Management', 'Permanent Knowledge/Instructions/Resolution'],
        ['Memory', 'Runtime State/History/Long-Term Memory'],
        ['RAG', 'Index/Embedding/Retrieval/Search'],
        ['Project Codebase Intelligence', 'AST/Code Graph/Current Codebase Understanding'],
        ['Context Engine', 'Context Collection/Retrieval Policy/Assembly'],
        ['Workflow', 'Machine-readable Process/Execution Rules'],
        ['Planner', 'Task Analysis/Plan/Required Capabilities'],
        ['Project Agent Team', 'Available Agent Pool'],
        ['LangGraph', 'Orchestration/State/Execution Graph'],
        ['LangChain / Spring AI', 'LLM/Tool Calling/Retrieval/Agent Execution'],
      ]},
    ]
  },
  {
    id: 'a29',
    number: 'A.29',
    title: 'قوانین Source of Truth',
    content: [
      { type: 'code', text: `Source Code            → Git
Permanent Knowledge    → Versioned Files / Git
Project Instructions   → Versioned Files / Git
ADRs                   → Versioned Files / Git
Runtime State          → Disk / Memory (.ai/runtime)
RAG                    → Index / Retrieval Layer
Codebase Intelligence  → Derived Projection
Database               → Metadata / Operational State / Index
Workspace              → Runtime Working Copy` },
    ]
  },
  {
    id: 'a30',
    number: 'A.30',
    title: 'قرارداد دایرکتوری پروژه',
    content: [
      { type: 'tree', text: `.ai/
├── knowledge/
├── instructions/
├── decisions/
├── agents/
├── workflows/
├── codebase/
│   ├── overview.md
│   ├── architecture.md
│   ├── modules.md
│   ├── dependencies.md
│   ├── conventions.md
│   └── structure/
└── runtime/
    ├── current-task.md
    ├── current-plan.md
    ├── discoveries.md
    ├── decisions.md
    ├── touched-files.md
    ├── test-results.md
    └── task-summary.md` },
    ]
  },
  {
    id: 'a31',
    number: 'A.31',
    title: 'چرخه حیات Memory',
    content: [
      { type: 'code', text: `Task Execution → Runtime Events → Active Memory → Task Summary →
Candidate Long-Term Memory → Summarize/Classify/Validate →
Long-Term Memory → RAG Index` },
      { type: 'paragraph', text: 'RAG در این جریان فقط Retrieval Layer است.' },
    ]
  },
  {
    id: 'a32',
    number: 'A.32',
    title: 'چرخه حیات Codebase Intelligence',
    content: [
      { type: 'code', text: `Project Creation/First Clone → Full Analysis → Code Graph →
Codebase Projection → RAG/Search Index

Later Changes → Git Diff → Changed Files → Affected Symbols →
Incremental Analysis → Update Projection → Update Index` },
    ]
  },
  {
    id: 'a33',
    number: 'A.33',
    title: 'مثال End-to-End — پیاده‌سازی OAuth2 Login',
    content: [
      { type: 'numbered-list', items: [
        'Resolve Project',
        'Prepare Workspace',
        'Create Task Branch',
        'Resolve Platform Knowledge',
        'Resolve Project Knowledge',
        'Resolve Instructions',
        'Resolve Project Agent Team',
        'Resolve Workflow',
        'Load Codebase Intelligence',
        'Inspect relevant local code',
        'Retrieve deeper context from RAG if needed',
        'Planner creates Plan',
        'Identify required capabilities',
        'Select subset of Project Team',
        'LangGraph creates Execution Graph',
        'Context Engine builds runtime context',
        'Architect Agent analyzes architecture',
        'Backend Agent implements',
        'Security Agent reviews security implications',
        'Reviewer Agent reviews changes',
        'QA Agent validates',
        'Build/Test runs in Workspace',
        'Failed validation can trigger retry/re-plan',
        'Final review',
        'Git Management prepares commit',
        'Git Connector accesses remote repository',
        'Commit',
        'Push',
        'Pull Request',
        'Runtime Memory updated; relevant info considered for Long-Term Memory',
      ]},
    ]
  },
  {
    id: 'a34',
    number: 'A.34',
    title: 'اصول معماری غیرقابل‌نقض',
    content: [
      { type: 'invariants', items: [
        'Knowledge همیشه Source of Truth مشخص دارد.',
        'RAG هیچ‌گاه Source of Truth نیست.',
        'Memory با Knowledge یکی نیست.',
        'Prompt مالک Knowledge نیست.',
        'Workflow مالک Agent Definition نیست.',
        'Team Execution Order را تعیین نمی‌کند.',
        'Agent Definition Project Context ندارد.',
        'Agent خارج از Project Team انتخاب نمی‌شود.',
        'Tool Definition از Tool Implementation جداست.',
        'Connector از Tool جداست.',
        'Connector از MCP جداست.',
        'MCP فقط یک Adapter است.',
        'Credential در Connector یا DB به صورت Plaintext ذخیره نمی‌شود.',
        'Git Management با Connector Management یکی نیست.',
        'Workspace با Git Repository یکی نیست.',
        'Codebase Intelligence Derived است.',
        'Context Engine مالک Sourceها نیست.',
        'LangGraph مالک Workflow Definition نیست.',
        'LangChain/Spring AI مالک Domain Management نیستند.',
        'Team به ازای هر Task ساخته نمی‌شود.',
        'Task می‌تواند Subset متفاوتی از Team را استفاده کند.',
        'Execution باید Versioned و Reproducible باشد.',
        'اضافه کردن Component جدید نباید نیازمند Core Hard-code باشد.',
      ]},
    ]
  },
  {
    id: 'a35',
    number: 'A.35',
    title: 'قرارداد نهایی معماری',
    content: [
      { type: 'numbered-list', items: [
        'Files/Git برای Knowledge دائمی و Source Code، Canonical هستند.',
        'Database فقط Metadata و Index عملیاتی نگه می‌دارد.',
        'RAG بازیابی می‌کند؛ مالک داده Canonical نیست.',
        'Disk/Workspace وضعیت Runtime فعال را نگه می‌دارد.',
        'Knowledge و Memory دامنه‌های جدا هستند.',
        'Prompt و Knowledge دامنه‌های جدا هستند.',
        'Workflow و Agent دامنه‌های جدا هستند.',
        'Agent و Tool دامنه‌های جدا هستند.',
        'Connector و Tool دامنه‌های جدا هستند.',
        'MCP یک Adapter/Protocol است، نه خود دامنه‌ی Connector.',
        'Git Management و Connector Management جدا می‌مانند.',
        'Project Team در سطح Project دائمی است، نه در سطح Task.',
        'Task یک Subset پویا از Project Team را انتخاب می‌کند.',
        'Planner نمی‌تواند خارج از Project Team انتخاب کند.',
        'Workflow قوانین اجرا را تعریف می‌کند.',
        'LangGraph آن Workflow را اجرا می‌کند.',
        'Agent Definition Reusable و مستقل از Project است.',
        'Project Context در Runtime تزریق می‌شود.',
        'Context Engine Context را Assemble می‌کند اما مالک داده منبع نیست.',
        'Codebase Intelligence، درک Derived از کد فعلی است.',
        'RAG می‌تواند Code، Docs، Knowledge و Historical Memory را Index کند.',
        'عملیات External باید از Tool Executor و Connector عبور کند.',
        'Credentialها Reference هستند؛ Secret متعلق به Secret Management است.',
        'تمام Definitionهای حیاتی و ورودی‌های Execution باید Versioned باشند.',
        'Execution Trace باید Reproducibility و Audit را پشتیبانی کند.',
        'پلتفرم باید Configuration-driven و Extensible بماند.',
        'افزودن Agent، Tool، Skill، Role، Connector، Workflow، Knowledge یا Prompt جدید نباید نیازمند تغییر Hard-code در Core باشد.',
      ]},
    ]
  },
  {
    id: 'a36',
    number: 'A.36',
    title: 'بیانیه معماری کانونیک',
    content: [
      { type: 'blockquote', text: 'Git/Files = Source of Truth. Database = Metadata/Index. RAG = Retrieval. Disk/Workspace = Active Runtime State.' },
      { type: 'blockquote', text: 'Knowledge ≠ Memory. Knowledge ≠ Prompt. Memory ≠ RAG. Prompt ≠ Workflow. Workflow ≠ Agent. Agent ≠ Tool. Connector ≠ MCP. Connector ≠ Tool. Git ≠ Workspace.' },
      { type: 'paragraph', text: 'Platform موجودیت‌های Reusable را تعریف می‌کند. Project پیکربندی و Context در دسترس را تعریف می‌کند. Task کار را تعریف می‌کند. Planner کار و Capability لازم را تعریف می‌کند. Project Team مجموعه Agent در دسترس را تعریف می‌کند. Workflow قوانین اجرا را تعریف می‌کند. LangGraph اجرا را Orchestrate می‌کند. Context Engine، Context Runtime را Assemble می‌کند. Agent اجرا می‌کند. Tool Executor عملیات را اجرا می‌کند. Connector دسترسی کنترل‌شده به External را فراهم می‌کند. Adapter مکانیزم Integration واقعی را فراهم می‌کند. Workspace محیط Runtime را فراهم می‌کند. Git Management چرخه‌عمر Repository را مدیریت می‌کند. Knowledge Management، Knowledge و Instruction دائمی را Resolve می‌کند. Memory وضعیت Runtime و History را نگه می‌دارد. RAG اطلاعات Index‌شده را بازیابی می‌کند. Codebase Intelligence درک Derived از Codebase فعلی را فراهم می‌کند. Prompt Management کنترل می‌کند Context چگونه به Model Input تبدیل شود. LangChain/Spring AI قابلیت‌های LLM، Tool Calling، Retrieval و Agent Runtime را فراهم می‌کنند.' },
      { type: 'highlight', text: 'هدف مرکزی معماری: ساخت یک پلتفرم مهندسی نرم‌افزار مبتنی بر AI که Configuration-driven، Versioned، Dynamic و Extensible باشد؛ جایی که مسئولیت‌های Domain به‌طور صریح جدا می‌مانند، اطلاعات Canonical قابل ردیابی به Files/Git باقی می‌ماند، Retrieval از Source-of-Truth Storage جدا می‌ماند، Runtime Memory از Knowledge دائمی جدا می‌ماند، و اجرای Agent می‌تواند به‌صورت پویا برای هر Task Orchestrate شود بدون نیاز به تغییر Hard-code در Core.' },
    ]
  },
];
