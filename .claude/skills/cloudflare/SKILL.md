---
name: cloudflare
description: Comprehensive Cloudflare platform skill covering Workers, Pages, storage (KV, D1, R2), AI (Workers AI, Vectorize, Agents SDK), networking (Tunnel, Spectrum), security (WAF, DDoS), and infrastructure-as-code (Terraform, Pulumi). Use for any Cloudflare development task. Biases towards retrieval from Cloudflare docs over pre-trained knowledge.
references:
  - workers
  - pages
  - d1
  - durable-objects
  - workers-ai
---

# Cloudflare Platform Skill

Consolidated skill for building on the Cloudflare platform.

## Workflow

1. Pick the right product using the Decision Trees below.
2. Load that product's detailed reference from the Product Index.
3. Verify specifics against live sources (see Retrieval Sources).

## Retrieval Sources

Pre-trained knowledge of Cloudflare APIs, types, limits, and pricing may be outdated.

- **DO** fetch the latest information before citing specific numbers, API signatures, or configuration options.
- **DO** treat the reference files in this skill as starting points, not the source of truth.
- **DON'T** rely on baked-in knowledge or these reference files alone.

| Source | How to retrieve | Use for |
|--------|----------------|---------|
| Cloudflare docs | `cloudflare-docs` search tool or `https://developers.cloudflare.com/` | Limits, pricing, API reference, compatibility dates/flags |
| Workers types | `npm pack @cloudflare/workers-types` or check `node_modules` | Type signatures, binding shapes, handler types |
| Wrangler config schema | `node_modules/wrangler/config-schema.json` | Config fields, binding shapes, allowed values |
| Product changelogs | `https://developers.cloudflare.com/changelog/` | Recent changes to limits, features, deprecations |

**Conflict rule:** when a reference file and the docs disagree, trust the docs. This matters most for numeric limits, pricing tiers, type signatures, and configuration options.

## Decision Trees

Each entry maps a need to the reference directory to load. See the Product Index for full paths.

### "I need to run code"

- Serverless functions at the edge → `workers/`
- Full-stack web app with Git deploys → `pages/`
- Stateful coordination/real-time → `durable-objects/`
- Long-running multi-step jobs → `workflows/`
- Run containers → `containers/`
- Multi-tenant (customers deploy code) → `workers-for-platforms/`
- Scheduled tasks (cron) → `cron-triggers/`
- Lightweight edge logic (modify HTTP) → `snippets/`
- Process Worker execution events (logs/observability) → `tail-workers/`
- Optimize latency to backend infrastructure → `smart-placement/`

### "I need to store data"

- Key-value (config, sessions, cache) → `kv/`
- Relational SQL → `d1/` (SQLite) or `hyperdrive/` (existing Postgres/MySQL)
- Object/file storage (S3-compatible) → `r2/`
- Message queue (async processing) → `queues/`
- Vector embeddings (AI/semantic search) → `vectorize/`
- Strongly-consistent per-entity state → `durable-objects/` (DO storage)
- Secrets management → `secrets-store/`
- Streaming ETL to R2 → `pipelines/`
- Persistent cache (long-term retention) → `cache-reserve/`

### "I need AI/ML"

- Run inference (LLMs, embeddings, images) → `workers-ai/`
- Vector database for RAG/search → `vectorize/`
- Build stateful AI agents → `agents-sdk/`
- Gateway for any AI provider (caching, routing) → `ai-gateway/`
- AI-powered search widget → `ai-search/`

### "I need networking/connectivity"

- Expose local service to internet → `tunnel/`
- TCP/UDP proxy (non-HTTP) → `spectrum/`
- WebRTC TURN server → `turn/`
- Private network connectivity → `network-interconnect/`
- Optimize routing → `argo-smart-routing/`
- Optimize latency to backend (not user) → `smart-placement/`
- Real-time video/audio → `realtimekit/` or `realtime-sfu/`

### "I need security"

- Web Application Firewall → `waf/`
- DDoS protection → `ddos/`
- Bot detection/management → `bot-management/`
- API protection → `api-shield/`
- CAPTCHA alternative → `turnstile/`
- Credential leak detection → `waf/` (managed ruleset)

### "I need media/content"

- Image optimization/transformation → `images/`
- Video streaming/encoding → `stream/`
- Browser automation/screenshots → `browser-rendering/`
- Third-party script management → `zaraz/`

### "I need analytics/metrics data"

- Query across all Cloudflare products (HTTP, Workers, DNS, etc.) → `graphql-api/`
- Custom high-cardinality metrics from Workers → `analytics-engine/`
- Client-side (RUM) performance data → `web-analytics/`
- Workers Logs and real-time debugging → `observability/`
- Raw logs (Logpush to external tools) → Cloudflare docs

### "I need infrastructure-as-code"

- Pulumi → `pulumi/`
- Terraform → `terraform/`
- REST API → `api/`

## Product Index

### Compute & Runtime

| Product | Reference |
|---------|-----------|
| Workers | `references/workers/` |
| Pages | `references/pages/` |
| Pages Functions | `references/pages-functions/` |
| Durable Objects | `references/durable-objects/` |
| Workflows | `references/workflows/` |
| Containers | `references/containers/` |
| Workers for Platforms | `references/workers-for-platforms/` |
| Cron Triggers | `references/cron-triggers/` |
| Tail Workers | `references/tail-workers/` |
| Snippets | `references/snippets/` |
| Smart Placement | `references/smart-placement/` |

### Storage & Data

| Product | Reference |
|---------|-----------|
| KV | `references/kv/` |
| D1 | `references/d1/` |
| R2 | `references/r2/` |
| Queues | `references/queues/` |
| Hyperdrive | `references/hyperdrive/` |
| DO Storage | `references/do-storage/` |
| Secrets Store | `references/secrets-store/` |
| Pipelines | `references/pipelines/` |
| R2 Data Catalog | `references/r2-data-catalog/` |
| R2 SQL | `references/r2-sql/` |

### AI & Machine Learning

| Product | Reference |
|---------|-----------|
| Workers AI | `references/workers-ai/` |
| Vectorize | `references/vectorize/` |
| Agents SDK | `references/agents-sdk/` |
| AI Gateway | `references/ai-gateway/` |
| AI Search | `references/ai-search/` |

### Networking & Connectivity

| Product | Reference |
|---------|-----------|
| Tunnel | `references/tunnel/` |
| Spectrum | `references/spectrum/` |
| TURN | `references/turn/` |
| Network Interconnect | `references/network-interconnect/` |
| Argo Smart Routing | `references/argo-smart-routing/` |
| Workers VPC | `references/workers-vpc/` |

### Security

| Product | Reference |
|---------|-----------|
| WAF | `references/waf/` |
| DDoS Protection | `references/ddos/` |
| Bot Management | `references/bot-management/` |
| API Shield | `references/api-shield/` |
| Turnstile | `references/turnstile/` |

### Media & Content

| Product | Reference |
|---------|-----------|
| Images | `references/images/` |
| Stream | `references/stream/` |
| Browser Rendering | `references/browser-rendering/` |
| Zaraz | `references/zaraz/` |

### Real-Time Communication

| Product | Reference |
|---------|-----------|
| RealtimeKit | `references/realtimekit/` |
| Realtime SFU | `references/realtime-sfu/` |

### Developer Tools

| Product | Reference |
|---------|-----------|
| Wrangler | `references/wrangler/` |
| Miniflare | `references/miniflare/` |
| C3 | `references/c3/` |
| Observability | `references/observability/` |
| GraphQL Analytics API | `references/graphql-api/` |
| Analytics Engine | `references/analytics-engine/` |
| Web Analytics | `references/web-analytics/` |
| Sandbox | `references/sandbox/` |
| Workerd | `references/workerd/` |
| Workers Playground | `references/workers-playground/` |

### Infrastructure as Code

| Product | Reference |
|---------|-----------|
| Pulumi | `references/pulumi/` |
| Terraform | `references/terraform/` |
| API | `references/api/` |

### Other Services

| Product | Reference |
|---------|-----------|
| Email Routing | `references/email-routing/` |
| Email Workers | `references/email-workers/` |
| Static Assets | `references/static-assets/` |
| Bindings | `references/bindings/` |
