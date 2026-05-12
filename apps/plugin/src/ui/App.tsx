import Composer from "@ui/components/MessageComposer";
import MessageList from "@ui/components/MessageList";
import { useMessages } from "@ui/hooks/message";
import { postToPlugin } from "@ui/utils/bridge";
import { useEffect, useRef, useState } from "react";
import type { PluginToUiMessage } from "@plugin-shared/messages/pluginToUiMessage";

function App() {
  const { messages, appendMessage, resetMessages } = useMessages();

  const [inputText, setInputText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");

  const messageListContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage as PluginToUiMessage | undefined;

      if (!message) {
        return;
      }

      switch (message.type) {
        case "PLUGIN_RESPONSE": {
          if (message.payload.variant === "status") {
            setStatusText(message.payload.text);
          } else {
            appendMessage({
              role: "assistant",
              text: message.payload.text,
              variant: message.payload.variant,
            });
            setIsProcessing(false);
            setStatusText("");
          }
          break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [appendMessage]);

  useEffect(() => {
    const container = messageListContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, isProcessing]);

  const handleComposerSubmit = (text: string) => {
    appendMessage({
      role: "user",
      text,
      variant: "info",
    });
    setInputText("");
    setIsProcessing(true);
    setStatusText("");
    postToPlugin({
      type: "UI_COMPOSER_SUBMIT",
      payload: { text },
    });
  };

  const handleComposerResetSession = () => {
    resetMessages();
    setInputText("");
    setIsProcessing(false);
    setStatusText("");
    postToPlugin({
      type: "UI_RESET_SESSION",
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={messageListContainerRef} className="flex-1 overflow-auto">
        <MessageList
          messages={messages}
          isProcessing={isProcessing}
          statusText={statusText}
          onSuggestionSelect={handleComposerSubmit}
        />
      </div>

      <div>
        <Composer
          value={inputText}
          onChange={setInputText}
          isProcessing={isProcessing}
          onSubmit={handleComposerSubmit}
          onResetSession={handleComposerResetSession}
        />
      </div>
    </div>
  );
}

export default App;
