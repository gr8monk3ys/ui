"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const FRUITS = ["Apple", "Banana", "Cherry"];

export default function Deep() {
  return (
    <main className="p-8">
      <Combobox items={FRUITS}>
        <ComboboxInput placeholder="Search…" className="w-56" />
        <ComboboxContent>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </main>
  );
}
