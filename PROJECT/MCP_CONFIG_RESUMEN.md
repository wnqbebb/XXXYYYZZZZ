# ✅ MCP Servers Configurados - Estado Final

**Fecha:** 2026-02-17

---

## 📊 Resumen de MCPs

| MCP | Estado | Versión | Método |
|-----|--------|---------|--------|
| **GitHub** | ✅ Activo | latest | npx |
| **Vercel** | ✅ Activo | latest | npx |
| **Stitch** | ✅ Activo | API | serverUrl |
| **NotebookLM** | ✅ Instalado | 2.0.11 | npx |
| **Remotion** | ✅ Instalado | 4.0.424 | npx |

---

## 🔧 Configuración Actual

`C:\Users\Usuario\.kimi\mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "github-mcp-server@latest"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "***" }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "vercel-mcp-server@latest"],
      "env": { "VERCEL_TOKEN": "***" }
    },
    "notebooklm": {
      "command": "notebooklm-mcp",
      "args": ["--transport", "stdio"],
      "env": { "NOTEBOOKLM_MCP_DEBUG": "true" }
    },
    "stitch": {
      "serverUrl": "https://stitch.googleapis.com/mcp",
      "headers": { "X-Goog-Api-Key": "***" }
    },
    "remotion": {
      "command": "npx",
      "args": ["-y", "@remotion/mcp@latest"]
    }
  }
}
```

---

## 🎨 Stitch Skills Instaladas

Ubicación: `C:\Users\Usuario\.kimi\mcp_servers\stitch-skills/skills/`

| Skill | Descripción |
|-------|-------------|
| **design-md** | Generar archivos DESIGN.md para documentación de diseño |
| **enhance-prompt** | Mejorar prompts con keywords optimizadas |
| **react-components** | Componentes React con ejemplos y recursos |
| **remotion** | Crear videos walkthrough desde proyectos Stitch |
| **shadcn-ui** | Integración con shadcn/ui componentes |
| **stitch-loop** | Flujos de trabajo iterativos con Stitch |

---

## 🔑 Autenticación Pendiente

### NotebookLM:
- **Estado:** Instalado, requiere login
- **Comando para autenticar:** `setup_auth` (se abrirá navegador)
- **Versión:** 2.0.11

---

## 📚 Documentación de Referencia

| Recurso | URL |
|---------|-----|
| Stitch | https://stitch.withgoogle.com/ |
| Stitch MCP Docs | https://stitch.withgoogle.com/docs/mcp/setup/ |
| Stitch Skills Repo | https://github.com/google-labs-code/stitch-skills |
| Remotion MCP | https://www.remotion.dev/docs/ai/mcp |
| Remotion Skills | https://www.remotion.dev/docs/ai/skills |

---

## 🚀 Uso

Iniciar Kimi con MCPs:
```batch
kimi --mcp-config-file C:\Users\Usuario\.kimi\mcp.json
```

---

## ✅ Checklist Completado

- [x] Stitch MCP configurado con API key
- [x] Stitch Skills clonadas (6 skills)
- [x] NotebookLM MCP instalado (v2.0.11)
- [x] Remotion MCP instalado (v4.0.424)
- [ ] NotebookLM autenticación (requiere intervención manual)

---

## 📝 Notas

- **Stitch** está listo para usar con tu API key
- **Remotion** tiene tanto el MCP oficial como las skills de Stitch
- **NotebookLM** necesita autenticación vía navegador para funcionar completamente
