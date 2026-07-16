import type { EmberMessage } from "./emberConversation";

/**
 * Groups a flat message list into user/assistant pairs for the "earlier in
 * this session" history drawer. Shared between Hall of Embers and the
 * floating widget's popup so both show the same past exchanges the same way.
 */

export interface Exchange {
  question: string;
  answer: string;
}

export function pairHistory(messages: EmberMessage[]): Exchange[] {
  const pairs: Exchange[] = [];
  let i = 0;
  while (i < messages.length) {
    const m = messages[i];
    if (m.role === "user" && messages[i + 1]?.role === "assistant") {
      pairs.push({ question: m.content, answer: messages[i + 1].content });
      i += 2;
    } else {
      i += 1;
    }
  }
  return pairs;
}
