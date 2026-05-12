import type { SuggestionGroup } from "@ui/types";

type SuggestionChipsProps = {
  groups: SuggestionGroup[];
  onSelect: (value: string) => void;
};

function SuggestionChips({ groups, onSelect }: SuggestionChipsProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-xs font-medium text-gray-600">
            {group.label}
          </p>
          <div className="space-y-1.5">
            {group.items.map((item) => (
              <button
                key={item.value}
                onClick={() => onSelect(item.value)}
                className="w-full cursor-pointer rounded-xl border border-gray-200 px-3 py-2 text-left text-xs text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SuggestionChips;
