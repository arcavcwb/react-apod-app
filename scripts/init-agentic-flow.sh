#!/usr/bin/env bash
# ==============================================================================
# Antigravity Squad — Universal Agentic Flow Scaffolder & Doctor
# Despliega y diagnostica el flujo agéntico (Modo Operativo) en react-apod-app
# ==============================================================================
set -e

# Colores para terminal
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TARGET_DIR="${REPO_ROOT}"
MODE="operative"
CHECK_ENV=false

show_banner() {
  echo -e "${CYAN}${BOLD}"
  echo "┌────────────────────────────────────────────────────────┐"
  echo "│         ANTIGRAVITY SQUAD — FLOW SCAFFOLDER            │"
  echo "│     Zero-Trust • Impeccable • Ponytail • Caveman       │"
  echo "└────────────────────────────────────────────────────────┘"
  echo -e "${NC}"
}

show_help() {
  echo -e "${BOLD}Uso:${NC} bash $0 [opciones]"
  echo ""
  echo -e "${BOLD}Opciones:${NC}"
  echo "  -m, --mode <operative>             Modo de flujo (por defecto: operative)"
  echo "  -t, --target <directorio>          Directorio destino (por defecto: raíz del repo)"
  echo "  -c, --check-env                    Ejecuta el diagnóstico Doctor sobre el entorno"
  echo "  -h, --help                         Muestra esta ayuda"
  echo ""
  echo -e "${BOLD}Ejemplos:${NC}"
  echo "  bash $0 --check-env                # Verifica salud del entorno y variables"
  echo "  bash $0                            # Valida y asegura el Modo Operativo"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case $1 in
    -m|--mode)
      MODE="$2"
      shift 2
      ;;
    -t|--target)
      TARGET_DIR="$(cd "$2" 2>/dev/null && pwd || echo "$2")"
      shift 2
      ;;
    -c|--check-env)
      CHECK_ENV=true
      shift
      ;;
    -h|--help)
      show_help
      ;;
    *)
      echo -e "${RED}Opción desconocida: $1${NC}"
      show_help
      ;;
  esac
done

run_doctor() {
  echo -e "${BLUE}${BOLD}🔍 Ejecutando Diagnóstico de Entorno (Doctor)...${NC}\n"
  local issues=0

  # 1. Verificar Git
  if git -C "$TARGET_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Git inicializado"
    local branch
    branch="$(git -C "$TARGET_DIR" branch --show-current 2>/dev/null || echo 'desconocida')"
    echo -e "    Rama activa: ${CYAN}${branch}${NC}"
  else
    echo -e "  ${YELLOW}⚠${NC} Git no inicializado en $TARGET_DIR"
    issues=$((issues + 1))
  fi

  # 2. Verificar GitHub CLI
  if command -v gh >/dev/null 2>&1; then
    if gh auth status >/dev/null 2>&1; then
      local gh_user
      gh_user="$(gh api user -q .login 2>/dev/null || echo 'autenticado')"
      echo -e "  ${GREEN}✓${NC} GitHub CLI (gh) autenticado como: ${CYAN}@${gh_user}${NC}"
    else
      echo -e "  ${YELLOW}⚠${NC} GitHub CLI (gh) instalado pero no autenticado (ejecuta: gh auth login)"
      issues=$((issues + 1))
    fi
  else
    echo -e "  ${YELLOW}⚠${NC} GitHub CLI (gh) no encontrado en PATH"
    issues=$((issues + 1))
  fi

  # 3. Verificar archivo .env
  if [[ -f "$TARGET_DIR/.env" ]]; then
    echo -e "  ${GREEN}✓${NC} Archivo .env presente"
    if grep -q "NODE_ENV" "$TARGET_DIR/.env" 2>/dev/null; then
      echo -e "    ${CYAN}•${NC} Variables de entorno básicas detectadas"
    fi
  else
    echo -e "  ${YELLOW}⚠${NC} Archivo .env no encontrado en $TARGET_DIR"
    issues=$((issues + 1))
  fi

  # 4. Verificar Skills esenciales
  local skills_found=0
  local all_skills=(impeccable caveman ponytail contract-first-api vite-modernizer web-vitals-heavy-media pnpm-monorepo-architect playwright-e2e-suite)
  for sk in "${all_skills[@]}"; do
    if [[ -d "$TARGET_DIR/.agents/skills/$sk" ]]; then
      skills_found=$((skills_found + 1))
    fi
  done

  if [[ $skills_found -eq ${#all_skills[@]} ]]; then
    echo -e "  ${GREEN}✓${NC} Todas las skills maestras presentes (${skills_found}/${#all_skills[@]})"
  else
    echo -e "  ${YELLOW}⚠${NC} Faltan skills maestras en .agents/skills/ (${skills_found}/${#all_skills[@]} encontradas)"
    issues=$((issues + 1))
  fi

  # 5. Verificar verificación de diseño en package.json
  if [[ -f "$TARGET_DIR/package.json" ]]; then
    if grep -q "check:design" "$TARGET_DIR/package.json"; then
      echo -e "  ${GREEN}✓${NC} Script 'check:design' configurado en package.json"
    else
      echo -e "  ${YELLOW}⚠${NC} Script 'check:design' falta en package.json"
      issues=$((issues + 1))
    fi
  fi

  echo ""
  if [[ $issues -eq 0 ]]; then
    echo -e "${GREEN}${BOLD}✨ Todo en orden. Tu entorno agéntico está 100% operativo.${NC}\n"
  else
    echo -e "${YELLOW}${BOLD}⚠ Se detectaron $issues advertencia(s). Revisa las notas anteriores.${NC}\n"
  fi
}

if [[ "$CHECK_ENV" == true ]]; then
  show_banner
  run_doctor
  exit 0
fi

show_banner

echo -e "${BLUE}🚀 Verificando y blindando entorno en:${NC} ${BOLD}${TARGET_DIR}${NC}"
echo -e "${BLUE}📦 Modo:${NC} ${BOLD}${MODE^^}${NC}\n"

# 1. Asegurar directorios
mkdir -p "$TARGET_DIR/.agents/rules"
mkdir -p "$TARGET_DIR/.agents/skills"
mkdir -p "$TARGET_DIR/docs/walkthroughs"

# 2. Asegurar .env.example y .env
if [[ ! -f "$TARGET_DIR/.env.example" ]]; then
  cat << 'ENVEOF' > "$TARGET_DIR/.env.example"
# MODO OPERATIVO - STARTER / FAST-TRACK
NODE_ENV=development
PORT=3000
REACT_APP_NASA_API_KEY=DEMO_KEY
ENVEOF
fi

if [[ ! -f "$TARGET_DIR/.env" ]]; then
  cp "$TARGET_DIR/.env.example" "$TARGET_DIR/.env"
  echo -e "  ${GREEN}✓${NC} Archivo .env inicial creado"
fi

# 3. Blindar .gitignore
GITIGNORE_FILE="$TARGET_DIR/.gitignore"
touch "$GITIGNORE_FILE"

ensure_ignore() {
  local entry="$1"
  if ! grep -q "^${entry}$" "$GITIGNORE_FILE" 2>/dev/null; then
    echo "$entry" >> "$GITIGNORE_FILE"
  fi
}

ensure_ignore ".env"
ensure_ignore ".env.local"
ensure_ignore "*.log"
ensure_ignore "node_modules/"
ensure_ignore "build/"
ensure_ignore "dist/"
ensure_ignore "coverage/"

# 4. Asegurar script check:design en package.json
if [[ -f "$TARGET_DIR/package.json" ]]; then
  if ! grep -q "check:design" "$TARGET_DIR/package.json"; then
    echo -e "  ${CYAN}•${NC} Inyectando script 'check:design' en package.json..."
    node -e "
      const fs = require('fs');
      const p = '$TARGET_DIR/package.json';
      const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
      pkg.scripts = pkg.scripts || {};
      pkg.scripts['check:design'] = '.agents/skills/impeccable/scripts/impeccable detect';
      fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
    " 2>/dev/null || true
  fi
fi

# 5. Asegurar README en docs/walkthroughs/
if [[ ! -f "$TARGET_DIR/docs/walkthroughs/README.md" ]]; then
  cat << 'WALKEOF' > "$TARGET_DIR/docs/walkthroughs/README.md"
# Registro de Walkthroughs y Entregas

Este directorio almacena los reportes técnicos detallados generados al finalizar cada tarea o Issue.
Cada archivo documenta: cambios realizados, contratos modificados, comandos ejecutados y resultados de pruebas.
WALKEOF
fi

echo -e "${GREEN}✓ Entorno agéntico validado y asegurado.${NC}"
run_doctor
