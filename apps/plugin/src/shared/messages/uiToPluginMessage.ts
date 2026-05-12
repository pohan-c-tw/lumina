export type UiComposerSubmitMessage = {
  type: "UI_COMPOSER_SUBMIT";
  payload: {
    text: string;
  };
};

export type UiResetSessionMessage = {
  type: "UI_RESET_SESSION";
};

export type UiToPluginMessage = UiComposerSubmitMessage | UiResetSessionMessage;
