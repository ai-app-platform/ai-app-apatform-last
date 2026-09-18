-- ============================================
-- AI App Platform — Database Seed Data
-- ============================================

-- Projects
INSERT INTO projects (id, name, description, repository_url, default_branch, status, agent_team_id, created_at, updated_at, version, deleted) VALUES
('p1', 'Payment Service', 'میکروسرویس پرداخت با Spring Boot', 'https://github.com/org/payment-service', 'main', 'ACTIVE', 't1', NOW(), NOW(), 1, false),
('p2', 'User Dashboard', 'داشبورد کاربر با React و TypeScript', 'https://github.com/org/user-dashboard', 'main', 'ACTIVE', 't2', NOW(), NOW(), 1, false),
('p3', 'API Gateway', 'گیت‌وی اصلی API با Spring Cloud', 'https://github.com/org/api-gateway', 'main', 'ACTIVE', 't1', NOW(), NOW(), 1, false);

-- Agents
INSERT INTO agents (id, name, type, description, capabilities, model_config, allowed_tools, skills, status, created_at, updated_at, version, deleted) VALUES
('a1', 'Architect Agent', 'ARCHITECT', 'تحلیل معماری و طراحی سیستم', '["architecture-analysis","design-patterns"]', '{"provider":"openai","model":"gpt-4o","temperature":0.3}', '["t1","t2","t3"]', '["s1","s2"]', 'ACTIVE', NOW(), NOW(), 1, false),
('a2', 'Backend Developer', 'DEVELOPER', 'پیاده‌سازی بک‌اند Java/Spring', '["code-generation","refactoring"]', '{"provider":"openai","model":"gpt-4o","temperature":0.2}', '["t1","t2","t4","t5"]', '["s1","s3"]', 'ACTIVE', NOW(), NOW(), 1, false),
('a3', 'Frontend Developer', 'DEVELOPER', 'پیاده‌سازی فرانت‌اند React', '["ui-implementation","component-design"]', '{"provider":"anthropic","model":"claude-3.5-sonnet","temperature":0.2}', '["t1","t2","t6"]', '["s5","s6"]', 'ACTIVE', NOW(), NOW(), 1, false),
('a4', 'Code Reviewer', 'REVIEWER', 'بررسی کیفیت کد', '["code-review","security-audit"]', '{"provider":"openai","model":"gpt-4o","temperature":0.1}', '["t1","t2","t3"]', '["s1","s7"]', 'ACTIVE', NOW(), NOW(), 1, false),
('a5', 'Security Agent', 'SECURITY', 'بررسی امنیتی', '["vulnerability-scan","security-review"]', '{"provider":"openai","model":"gpt-4o","temperature":0.1}', '["t1","t2","t7"]', '["s7","s8"]', 'ACTIVE', NOW(), NOW(), 1, false),
('a6', 'QA Agent', 'QA', 'تست و اعتبارسنجی', '["test-generation","test-execution"]', '{"provider":"openai","model":"gpt-4o","temperature":0.2}', '["t1","t4","t5","t8"]', '["s9"]', 'ACTIVE', NOW(), NOW(), 1, false),
('a7', 'Planner Agent', 'PLANNER', 'تحلیل Task و ایجاد Plan', '["task-analysis","planning"]', '{"provider":"openai","model":"gpt-4o","temperature":0.3}', '["t1","t3"]', '["s1","s2"]', 'ACTIVE', NOW(), NOW(), 1, false);

-- Tools
INSERT INTO tools (id, name, description, category, schema, permissions, status, created_at, updated_at, version, deleted) VALUES
('t1', 'read_file', 'خواندن محتوای فایل', 'FILE', '{"input":{"path":"string"},"output":{"content":"string"}}', '[{"action":"read","scope":"workspace"}]', 'ACTIVE', NOW(), NOW(), 1, false),
('t2', 'write_file', 'نوشتن/ویرایش فایل', 'FILE', '{"input":{"path":"string","content":"string"},"output":{"success":"boolean"}}', '[{"action":"write","scope":"workspace"}]', 'ACTIVE', NOW(), NOW(), 1, false),
('t3', 'search_codebase', 'جستجو در کدبیس', 'SEARCH', '{"input":{"query":"string"},"output":{"results":"array"}}', '[{"action":"read","scope":"workspace"}]', 'ACTIVE', NOW(), NOW(), 1, false),
('t4', 'run_build', 'اجرای build پروژه', 'BUILD', '{"input":{"command":"string"},"output":{"success":"boolean"}}', '[{"action":"execute","scope":"workspace"}]', 'ACTIVE', NOW(), NOW(), 1, false),
('t5', 'run_tests', 'اجرای تست‌ها', 'TEST', '{"input":{"pattern":"string"},"output":{"results":"object"}}', '[{"action":"execute","scope":"workspace"}]', 'ACTIVE', NOW(), NOW(), 1, false),
('t6', 'git_commit', 'ایجاد commit', 'GIT', '{"input":{"message":"string","files":"array"},"output":{"sha":"string"}}', '[{"action":"execute","scope":"git"}]', 'ACTIVE', NOW(), NOW(), 1, false),
('t7', 'security_scan', 'اسکن امنیتی', 'EXTERNAL', '{"input":{"scope":"string"},"output":{"vulnerabilities":"array"}}', '[{"action":"execute","scope":"external"}]', 'ACTIVE', NOW(), NOW(), 1, false),
('t8', 'get_project_overview', 'دریافت overview پروژه', 'CONTEXT', '{"input":{},"output":{"overview":"string"}}', '[{"action":"read","scope":"codebase"}]', 'ACTIVE', NOW(), NOW(), 1, false);

-- Connectors
INSERT INTO connectors (id, name, type, description, adapter_type, config, credential_ref, capabilities, status, created_at, updated_at, version, deleted) VALUES
('c1', 'GitHub', 'GIT', 'اتصال به GitHub', 'REST', '{"baseUrl":"https://api.github.com"}', 'vault://github-token', '["clone","push","pull","pr"]', 'ACTIVE', NOW(), NOW(), 1, false),
('c2', 'GitLab CI', 'CI_CD', 'اتصال به GitLab CI/CD', 'REST', '{"baseUrl":"https://gitlab.com/api/v4"}', 'vault://gitlab-token', '["trigger-pipeline","get-status"]', 'ACTIVE', NOW(), NOW(), 1, false),
('c3', 'Snyk', 'CUSTOM', 'اسکن امنیتی', 'REST', '{"baseUrl":"https://api.snyk.io"}', 'vault://snyk-token', '["vulnerability-scan","license-check"]', 'ACTIVE', NOW(), NOW(), 1, false),
('c5', 'OpenAI', 'LLM', 'LLM Provider', 'SDK', '{"model":"gpt-4o"}', 'vault://openai-key', '["chat","embedding","function-calling"]', 'ACTIVE', NOW(), NOW(), 1, false);

-- Workflows
INSERT INTO workflows (id, name, description, scope, steps, config, status, created_at, updated_at, version, deleted) VALUES
('w1', 'Software Development', 'Workflow استاندارد توسعه نرم‌افزار', 'PLATFORM', '[{"id":"s1","name":"Planning","type":"agent","agentRole":"planner","dependencies":[]},{"id":"s2","name":"Architecture","type":"agent","agentRole":"architect","dependencies":["s1"]},{"id":"s3","name":"Implementation","type":"parallel","dependencies":["s2"]},{"id":"s4","name":"Testing","type":"agent","agentRole":"qa","dependencies":["s3"]},{"id":"s5","name":"Review","type":"agent","agentRole":"reviewer","dependencies":["s4"]}]', '{"allowParallel":true,"validationRequired":true,"approvalRequired":false,"agentSelectionStrategy":"dynamic"}', 'ACTIVE', NOW(), NOW(), 1, false);

-- Skills
INSERT INTO skills (id, name, domain, description, level, tags, created_at, updated_at, version, deleted) VALUES
('s1', 'Java', 'Programming Language', 'تسلط بر Java 21+', 'EXPERT', '["backend","jvm"]', NOW(), NOW(), 1, false),
('s2', 'System Design', 'Architecture', 'طراحی سیستم‌های مقیاس‌پذیر', 'EXPERT', '["architecture"]', NOW(), NOW(), 1, false),
('s3', 'Spring Boot', 'Framework', 'توسعه با Spring Boot 4', 'EXPERT', '["backend","framework"]', NOW(), NOW(), 1, false),
('s5', 'React', 'Frontend', 'توسعه فرانت‌اند با React 19', 'EXPERT', '["frontend","ui"]', NOW(), NOW(), 1, false),
('s7', 'Security', 'Security', 'امنیت اپلیکیشن و OWASP', 'INTERMEDIATE', '["security"]', NOW(), NOW(), 1, false),
('s9', 'Testing', 'Quality', 'تست نویسی و اتوماسیون تست', 'EXPERT', '["testing","qa"]', NOW(), NOW(), 1, false);

-- Roles
INSERT INTO roles (id, name, description, responsibilities, constraints, referenced_skills, created_at, updated_at, version, deleted) VALUES
('r1', 'Architect', 'معمار سیستم', '["تحلیل معماری","طراحی سیستم"]', '["تغییر مستقیم کد ممنوع"]', '["s1","s2"]', NOW(), NOW(), 1, false),
('r2', 'Backend Developer', 'توسعه‌دهنده بک‌اند', '["پیاده‌سازی API","نوشتن business logic"]', '[]', '["s1","s3"]', NOW(), NOW(), 1, false),
('r3', 'Reviewer', 'بررسی‌کننده کد', '["Code Review","بررسی best practices"]', '["نباید خودش کد بنویسد"]', '["s1","s7"]', NOW(), NOW(), 1, false);

-- Agent Teams
INSERT INTO agent_teams (id, name, project_id, members, status, created_at, updated_at, version, deleted) VALUES
('t1', 'Payment Service Team', 'p1', '[{"agentId":"a1","role":"architect","enabled":true},{"agentId":"a2","role":"backend-developer","enabled":true},{"agentId":"a4","role":"reviewer","enabled":true},{"agentId":"a5","role":"security","enabled":true},{"agentId":"a6","role":"qa","enabled":true},{"agentId":"a7","role":"planner","enabled":true}]', 'ACTIVE', NOW(), NOW(), 1, false),
('t2', 'Dashboard Team', 'p2', '[{"agentId":"a3","role":"frontend-developer","enabled":true},{"agentId":"a4","role":"reviewer","enabled":true},{"agentId":"a6","role":"qa","enabled":true}]', 'ACTIVE', NOW(), NOW(), 1, false);

-- Knowledge
INSERT INTO knowledge_entries (id, title, file_path, content_hash, category, scope, project_id, tags, priority, created_at, updated_at, version, deleted) VALUES
('k1', 'Java Coding Standards', '.platform/knowledge/java-standards.md', 'abc123', 'STANDARDS', 'PLATFORM', NULL, '["java","standards"]', 1, NOW(), NOW(), 1, false),
('k2', 'Spring Boot Best Practices', '.platform/knowledge/spring-boot.md', 'def456', 'CONVENTIONS', 'PLATFORM', NULL, '["spring","backend"]', 2, NOW(), NOW(), 1, false),
('k3', 'Payment Service Architecture', '.ai/knowledge/architecture.md', 'ghi789', 'ARCHITECTURE', 'PROJECT', 'p1', '["architecture","payment"]', 1, NOW(), NOW(), 1, false);
