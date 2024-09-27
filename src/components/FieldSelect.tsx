import { Button, MenuItem, Colors } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { useState } from "react";

export interface Field {
  title: string;
  color: string;
}

interface FieldSelectProps {
  selectedField: any;
  setSelectedField: Function;
}

export const FIELDS_LIST = [
  { title: "Metaphysic", color: Colors.RED5 },
  { title: "Logic", color: Colors.BLUE1 },
  { title: "Epistemology", color: Colors.RED3 },
  { title: "Philosophy of mind", color: Colors.BLUE5 },
  { title: "Ethic", color: Colors.RED1 },
  { title: "Political philosophy", color: Colors.RED1 },
  { title: "Aesthetics", color: Colors.BLUE3 },
  { title: "Other fields", color: Colors.BLUE3 },
];

export function FieldSelect({
  selectedField,
  setSelectedField,
}: FieldSelectProps) {
  const [queryStr, setQueryStr] = useState<string>("");

  const handleFieldSelect = (field: Field) => {
    if (selectedField.title !== field.title) {
      setSelectedField(field);
    }
    setQueryStr("");
  };
  const renderfield = (
    field: Field,
    {
      handleClick,
      modifiers,
    }: {
      handleClick: (event: React.MouseEvent<HTMLElement>) => void;
      modifiers: { matchesPredicate: boolean; active: boolean };
    }
  ) => {
    if (!modifiers.matchesPredicate) return null;
    return (
      <MenuItem
        roleStructure="listoption"
        key={field.title}
        icon={selectedField.title === field.title ? "small-tick" : null}
        text={`${field.title}`}
        onClick={handleClick}
        active={modifiers.active}
        // labelElement={
        //   <div
        //     style={{ background: field.color, width: "1.5em", height: "1.5em" }}
        //   ></div>
        // }
      />
    );
  };

  const handleClear = () => {
    setSelectedField(FIELDS_LIST[0]);
  };

  const renderTag = (field: Field): string => field.title;

  const handleTagRemove = (title: string) => {
    const fieldToRemove: Field[] = selectedField.filter(
      (field: Field) => field.title === title
    );
    handleFieldSelect(fieldToRemove[0]);
  };

  const SelectAny = Select as any;

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
      <SelectAny
        items={FIELDS_LIST}
        itemRenderer={renderfield}
        noResults={<MenuItem disabled text="No results." />}
        onItemSelect={handleFieldSelect}
        tagRenderer={renderTag}
        selectedItems={selectedField}
        onClear={handleClear}
        query={queryStr}
        onQueryChange={(query: string, e: Event) => {
          e?.stopPropagation();
          setQueryStr(query);
        }}
        inputProps={{
          inputClassName: "input-class",
        }}
        tagInputProps={{
          onRemove: handleTagRemove,
          tagProps: {
            interactive: true,
            onClick: (e: MouseEvent) => {
              e.stopPropagation();
            },
          },
        }}
        popoverProps={{ minimal: true }}
        itemPredicate={(query: string, item: Field) => {
          if (!query.trim()) return true;
          return item.title.toLowerCase().includes(query.toLowerCase());
        }}
      >
        <Button
          text={
            selectedField?.title ? <div>{selectedField.title}</div> : "Field"
          }
          rightIcon="double-caret-vertical"
        />
      </SelectAny>
    </div>
  );
}
