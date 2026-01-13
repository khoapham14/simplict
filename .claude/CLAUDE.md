# Project Guidelines

## Code Quality Principles

### Simplicity First
- Write simple, readable code over clever solutions
- Avoid over-engineering - only implement what's needed now
- Keep functions small and focused on a single responsibility
- Prefer explicit over implicit behavior

### Security Best Practices
- Never expose secrets, API keys, or credentials in code
- Validate all user inputs at system boundaries
- Use parameterized queries for database operations
- Follow OWASP Top 10 guidelines
- Implement proper authentication and authorization checks

### Repository Conventions
- **Always** follow existing patterns and conventions in this codebase
- Match the coding style of surrounding code (formatting, naming, structure)
- Use existing utilities and helpers before creating new ones
- Maintain consistency with established architectural patterns

## Agent Allocation Guidelines - MANDATORY SDLC CYCLE

**CRITICAL:** Custom agents are PRIMARY, not fallbacks. For ALL non-trivial tasks, you MUST follow the SDLC cycle below. Only fall back to generic Plan/Explore agents if NO custom agent matches the task.

### Step 1: Identify the Right Custom Agent(s)

Match the task to the appropriate custom agent(s). Multiple agents can work together if the task spans domains.

| Task Type | Primary Custom Agent |
|-----------|---------------------|
| Performance, Lighthouse, page speed, Core Web Vitals, bundle size, loading optimization | **performance-engineer** |
| API design, endpoints, REST, GraphQL | **api-designer** |
| Database schema, migrations, query optimization | **database-administrator** |
| AWS/Azure/GCP architecture, scaling, cost | **cloud-architect** |
| CI/CD, Pulumi, infrastructure as code | **devops-engineer** |
| Full-stack feature implementation | **fullstack-developer** |
| Visual design, UI/UX, design systems, accessibility, interaction patterns | **ui-designer** |
| React components, frontend architecture, web standards, client-side logic | **frontend-developer** |
| Server-side APIs, microservices, backend architecture, business logic | **backend-developer** |

### Step 2: MANDATORY SDLC Cycle

**This cycle is COMPULSORY for all implementation tasks:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: DESIGN (Custom Agent)                                     │
│  - Invoke the matched custom agent(s) to analyze and design         │
│  - Agent produces a detailed technical design/solution              │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 2: IMPLEMENTATION PLAN                                       │
│  - Convert the design into a concrete implementation plan           │
│  - Document files to modify, specific changes, and order            │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 3: CODE REVIEW (code-reviewer agent)                         │
│  - code-reviewer agent reviews the plan for:                        │
│    • Security vulnerabilities                                       │
│    • Code quality issues                                            │
│    • Best practices violations                                      │
│    • Potential bugs or edge cases                                   │
│  - Plan cannot proceed until code-reviewer approves                 │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 4: TEST PLANNING (qa-expert agent)                           │
│  - After code-reviewer approves, qa-expert agent:                   │
│    • Identifies what tests are needed                               │
│    • Plans test cases for the implementation                        │
│    • Ensures test coverage for the changes                          │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 5: IMPLEMENTATION                                            │
│  - Execute the approved plan                                        │
│  - Write the code changes                                           │
│  - Write the tests identified by qa-expert                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Example Workflows

**Performance Optimization Task:**
1. **performance-engineer** → Analyzes bottlenecks, designs optimization strategy
2. Convert to implementation plan with specific file changes
3. **code-reviewer** → Reviews plan for issues, approves or requests changes
4. **qa-expert** → Plans tests to verify performance improvements
5. Implement changes and tests

**New Feature (API + Database + UI):**
1. **ui-designer** → Designs visual interface and user experience
2. **database-administrator** + **api-designer** + **backend-developer** → Design data model and API contracts
3. **frontend-developer** → Plans component architecture and client-side implementation
4. Convert to implementation plan
5. **code-reviewer** → Reviews for security and quality
6. **qa-expert** → Plans integration and unit tests
7. Implement changes and tests

**Frontend Feature/Component:**
1. **ui-designer** → Designs visual interface, interaction patterns, accessibility
2. **frontend-developer** → Plans React component architecture and implementation
3. Convert to implementation plan
4. **code-reviewer** → Reviews for quality and best practices
5. **qa-expert** → Plans component and integration tests
6. Implement changes and tests

**Backend API Feature:**
1. **api-designer** + **backend-developer** → Design API contracts and server-side architecture
2. **database-administrator** → Plans any required schema changes
3. Convert to implementation plan
4. **code-reviewer** → Reviews for security and quality
5. **qa-expert** → Plans API and integration tests
6. Implement changes and tests

**Infrastructure Changes:**
1. **cloud-architect** + **devops-engineer** → Design infrastructure solution
2. Convert to implementation plan
3. **code-reviewer** → Reviews for security and best practices
4. **qa-expert** → Plans infrastructure tests
5. Implement with Pulumi/IaC

### Fallback to Generic Agents

Only use generic **Explore** or **Plan** agents when:
- Task is purely exploratory (no implementation needed)
- Task is trivial (typo fix, single-line change)
- No custom agent matches the task domain

### Agent Reference

| Agent | Domain |
|-------|--------|
| **performance-engineer** | Performance optimization, bottleneck identification, scalability |
| **code-reviewer** | Code review, security audit, quality checks |
| **qa-expert** | Test planning, test writing, coverage analysis |
| **api-designer** | REST/GraphQL API design and implementation |
| **database-administrator** | Schema design, migrations, query optimization |
| **cloud-architect** | Cloud architecture (AWS/Azure/GCP), scaling |
| **devops-engineer** | CI/CD, Pulumi, infrastructure as code |
| **fullstack-developer** | Cross-stack feature implementation |
| **ui-designer** | Visual design, UI/UX, design systems, accessibility, interaction patterns |
| **frontend-developer** | React components, frontend architecture, web standards, client-side logic |
| **backend-developer** | Server-side APIs, microservices, backend architecture, business logic |

## Critical Rules

### Destructive Operations - FORBIDDEN without explicit approval:
- `pulumi destroy` or any destroy commands
- Deleting AWS resources (RDS, S3, CloudFront, AppRunner)
- Database migrations that drop tables or data
- Deployment commands (user will run manually)

### Before Any Infrastructure Change:
1. Create a detailed plan of what will be created/modified/deleted
2. List all affected resources with IDs/names
3. Ask about backups before destructive actions
4. Wait for explicit "yes, proceed" approval

### General Guidelines
- Never assume - investigate first by reading files and checking logs
- Ask clarifying questions for ambiguous requests
- Don't commit code unless explicitly asked
- Log debugging attempts to a markdown file for complex issues
- Prioritize data integrity and safety in all operations
