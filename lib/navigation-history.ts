const NAVIGATION_STACK_KEY = "narzza-navigation-stack";
const MAX_STACK_SIZE = 50;

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizePath(path: string) {
  return path.trim() || "/";
}

export function readNavigationStack(): string[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.sessionStorage.getItem(NAVIGATION_STACK_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is string => typeof item === "string")
      .map(normalizePath)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function writeNavigationStack(stack: string[]) {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.setItem(
      NAVIGATION_STACK_KEY,
      JSON.stringify(stack.slice(-MAX_STACK_SIZE))
    );
  } catch {
    // ignore storage failures
  }
}

export function trackNavigationEntry(path: string) {
  if (!isBrowser()) return;

  const normalizedPath = normalizePath(path);
  const currentStack = readNavigationStack();

  if (currentStack[currentStack.length - 1] === normalizedPath) {
    return;
  }

  writeNavigationStack([...currentStack, normalizedPath]);
}

export function canNavigateBackSafely() {
  return readNavigationStack().length > 1;
}

export function prepareSafeBackNavigation() {
  const currentStack = readNavigationStack();
  if (currentStack.length <= 1) return;

  currentStack.pop();
  writeNavigationStack(currentStack);
}

