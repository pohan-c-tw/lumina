import type { PluginResponseMessage } from "@plugin-shared/messages/pluginToUiMessage";

export function postPluginResponse({
  text,
  variant,
}: PluginResponseMessage["payload"]) {
  const message: PluginResponseMessage = {
    type: "PLUGIN_RESPONSE",
    payload: {
      text,
      variant,
    },
  };
  figma.ui.postMessage(message);
}
