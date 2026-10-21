/** Fired by every order / buy / add button while the business is not live yet. */
export const ORDER_PROMPT_EVENT = "order-prompt";

export function requestOrder() {
  window.dispatchEvent(new Event(ORDER_PROMPT_EVENT));
}
