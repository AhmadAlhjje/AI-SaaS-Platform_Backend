// Single source of truth for selectable models — ai-service's factory.py
// resolves the actual provider from the model name's prefix (gpt-*, claude-*,
// deepseek-*, llama*/mistral*/qwen*/gemma*/phi* -> Ollama).
export const SUPPORTED_AI_MODELS = [
  'gpt-4o-mini',
  'gpt-4o',
  'claude-haiku-4-5',
  'claude-sonnet-4-6',
  'deepseek-chat',
  'llama3.1:8b',
] as const;
