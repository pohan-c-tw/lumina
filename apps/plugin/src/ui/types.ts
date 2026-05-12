export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  variant: "info" | "error" | "status";
};

export type SuggestionItem = {
  label: string;
  value: string;
};

export type SuggestionGroup = {
  label: string;
  items: SuggestionItem[];
};
