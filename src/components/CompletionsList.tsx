import React from "react";
import { SearchResult } from "../types";
import "./CompletionsList.scss";
import SearchIcon from "./path/SearchIcon";

type CompletionsListProps = {
  items: SearchResult[] | null;
  onItemClicked: (item: string) => void;
  onItemHovered: (index: number) => void;
  selectedIndex: number;
};

function CompletionsList(props: CompletionsListProps) {
  const { items, selectedIndex, onItemHovered } = props;
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <>
      <div className="separator"></div>
      {items &&
        items.map((item, i) => {
          return (
            <div
              className={`completionslist-item${
                selectedIndex === i ? " completionslist-item-selected" : ""
              }`}
              key={`${item}_${i}`}
              onMouseOver={() => onItemHovered(i)}
            >
              <SearchIcon />
              {item.title}
            </div>
          );
        })}
    </>
  );
}

export default CompletionsList;
