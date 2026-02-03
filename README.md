# 🚀 SEO Meta Engine

**Opinionated SEO for Next.js & React** – bring SEO rules directly into your codebase!  
Analyze routes, content quality, and metadata while enforcing CI-ready SEO standards.

---

## 🎯 What is this?

SEO Meta Engine is **not just another meta tag generator**.  
It’s a **framework-aware, opinionated SEO engine** for Next.js and React projects.  
It deeply scans your project’s routing, content structure, and metadata to produce:

- SEO-compliant page metadata
- Rule-based scoring of content and technical SEO
- CI/CD-ready enforcement of SEO standards

Think of it as **“SEO rules as code”** for your web projects.

---

## 📦 Features

- **Framework Detection:** Next.js App Router vs Pages Router, i18n aware  
- **Route Scanner:** Detect static & dynamic routes intelligently  
- **Content Analyzer:** Heading hierarchy, text-to-HTML ratio, thin content detection  
- **SEO Analyzer:** Rule-based numeric scoring + thresholds for CI/CD  
- **Meta Generator:** Suggests optimized `<meta>` data based on content  
- **CI Integration:** `--fail-on=error` for automated quality gates  
- **Extensible & Plugin-ready:** Future-proof architecture for community rules

---

## ⚡ Installation

```bash
# Global via npx
npx seo-meta-engine init

# Or add as a dev dependency
npm install --save-dev seo-meta-engine
# Then run
npx seo-meta-engine init
```

The init command will create a starter config (`seo.config.ts`).

---

## 🛠 Usage

### Run SEO Analysis
```bash
npx seo-meta-engine analyze
```

### Optional flags:

| Flag | Description |
|------|-------------|
| `--fail-on=warning` | Fail CI build on warnings |
| `--fail-on=error` | Fail CI build on errors |
| `--report-only` | Run without modifying files (Read-only) |

### Sample Output (JSON)
```json
[
  {
    "route": "/blog/seo-tips",
    "rule": "meta-description-length",
    "score": 15,
    "max": 20,
    "status": "warning"
  },
  {
    "route": "/about",
    "rule": "heading-hierarchy",
    "score": 20,
    "max": 20,
    "status": "pass"
  }
]
```

---

## 🧪 Testing

```bash
# Run TypeScript checks
npm run build

# Run unit tests
npm test

# Optional: link locally for testing npx
npm link
npx seo-meta-engine analyze
```

---

## 📖 Configuration

SEO rules are strict by default, but fully customizable via `seo.config.ts`:

```ts
export default {
  rules: {
    "titleLength": { min: 40, max: 60, severity: 'warning' },
    "headingHierarchy": { enabled: true, severity: 'error' },
    // ...
  }
}
```

---

## 💡 Why “Opinionated”?

Most SEO tools just generate meta tags.
We enforce rules as code, give numeric scores, and integrate directly into your build pipelines.
This ensures:

- SEO consistency across your team
- Automated CI/CD quality checks
- Better Google and user experience

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a PR

We ❤️ contributions that add framework support, new rules, or improved analysis.
