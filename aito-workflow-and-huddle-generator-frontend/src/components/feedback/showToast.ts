/*
 * A small, self-dismissing confirmation message ("toast") shown at the bottom of the screen.
 * The app has no toast system, so this renders one shared element straight into the page:
 * calling it again replaces the message and restarts the timer, so one action never stacks
 * several toasts. role="status" makes screen readers announce the message.
 */
const TOAST_ID = "app-toast";
const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

let hideTimer: number | undefined;

export function showToast(message: string, durationMs = 2000): void {
  if (typeof document === "undefined") {
    return;
  }

  let toast = document.getElementById(TOAST_ID);

  if (!toast) {
    toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.className =
      "pointer-events-none fixed bottom-6 left-1/2 z-[300] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-[#242424] px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-opacity duration-200";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="text-[#6CCB5F]">${CHECK_ICON}</span><span></span>`;
  toast.lastElementChild!.textContent = message;
  toast.style.opacity = "1";

  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => {
    if (toast) {
      toast.style.opacity = "0";
    }
  }, durationMs);
}

/** The confirmation shown after a prompt is copied, the same everywhere in the app. */
export const PROMPT_COPIED_MESSAGE = "Prompt copied!";
