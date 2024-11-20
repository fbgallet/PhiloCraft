import { Button, MenuItem, Colors } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { Language } from "../App";

export interface Field {
  title: {
    EN: string;
    FR: string;
  };
}

interface FieldSelectProps {
  selectedField: any;
  setSelectedField: Function;
  language: Language;
}

export const FIELDS_LIST: any = [
  {
    title: {
      EN: "Metaphysic",
      FR: "Métaphysique",
    },
  },
  {
    title: {
      EN: "Logic",
      FR: "Logique",
    },
  },
  {
    title: {
      EN: "Epistemology",
      FR: "Epistémologie",
    },
  },
  {
    title: {
      EN: "Philosophy of mind",
      FR: "Philosophie de l'esprit",
    },
  },
  {
    title: {
      EN: "Ethic",
      FR: "Ethique",
    },
  },
  {
    title: {
      EN: "Political philosophy",
      FR: "Philosophie politique",
    },
  },
  {
    title: {
      EN: "Aesthetics",
      FR: "Esthétique",
    },
  },
  {
    title: {
      EN: "Other fields",
      FR: "Autres domaines",
    },
  },
];

export function FieldSelect({
  selectedField,
  setSelectedField,
  language,
}: FieldSelectProps) {
  const [queryStr, setQueryStr] = useState<string>("");

  const handleFieldSelect = (field: Field) => {
    if (selectedField.title[language] !== field.title[language]) {
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
        key={field.title[language]}
        icon={
          selectedField.title[language] === field.title[language]
            ? "small-tick"
            : null
        }
        text={`${field.title[language]}`}
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

  const renderTag = (field: Field): string => field.title[language];

  const handleTagRemove = (title: string) => {
    const fieldToRemove: Field[] = selectedField.filter(
      (field: Field) => field.title[language] === title
    );
    handleFieldSelect(fieldToRemove[0]);
  };

  const SelectAny = Select as any;

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
      <SelectAny
        filterable={isMobile ? false : true}
        placeholder={language === "EN" ? "Filter..." : "Filtrer..."}
        items={FIELDS_LIST}
        itemRenderer={renderfield}
        noResults={
          <MenuItem
            disabled
            text={language === "EN" ? "No results" : "Aucun résultat"}
          />
        }
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
          return item.title[language]
            .toLowerCase()
            .includes(query.toLowerCase());
        }}
      >
        <Button
          text={
            selectedField?.title[language] ? (
              <div>{selectedField.title[language]}</div>
            ) : (
              "Field"
            )
          }
          rightIcon="double-caret-vertical"
        />
      </SelectAny>
    </div>
  );
}
