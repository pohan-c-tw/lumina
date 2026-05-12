export type PluginResponseMessage = {
  type: "PLUGIN_RESPONSE";
  payload: {
    text: string;
    variant: "info" | "error" | "status";
  };
};

export type PluginToUiMessage = PluginResponseMessage;
