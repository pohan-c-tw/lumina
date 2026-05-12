import type { UiToPluginMessage } from "@plugin-shared/messages/uiToPluginMessage";

export function postToPlugin(message: UiToPluginMessage) {
  parent.postMessage({ pluginMessage: message }, "*");
}
