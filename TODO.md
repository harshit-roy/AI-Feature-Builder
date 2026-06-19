# TODO - AI Feature Builder

## Phase 1: Code generation stability
- [x] Update `server/services/aiService.js`
  - [x] Harden `sanitizeGeneratedCode()` to hard-strip forbidden tokens/lines (import/export/ReactDOM/createRoot/App)
  - [x] Improve `GeneratedPage` extraction (prefer const/function block)
  - [x] Strengthen `isValidGeneratedCode()` heuristics (require GeneratedPage const/function + return)
  - [x] Ensure repair pass uses sanitized bad code as input to Gemini repair prompt
- [x] Update `server/controllers/featureController.js`
  - [x] Improve deploy gating: fail-fast with clear lastError reason
  - [x] Ensure generation failure logging is more specific


## Phase 2+: Future work
- [ ] Prompt Optimizer
- [ ] AI Code Fixer (UI + endpoints)
- [ ] Notifications
- [ ] Deployment Monitoring
- [ ] Analytics

