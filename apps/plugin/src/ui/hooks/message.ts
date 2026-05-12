import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Message } from "@ui/types";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  const appendMessage = (data: Omit<Message, "id">): void => {
    const message = {
      id: uuidv4(),
      ...data,
    };

    setMessages((prev) => [...prev, message]);
  };

  const resetMessages = (): void => {
    setMessages([]);
  };

  return { messages, appendMessage, resetMessages };
}
