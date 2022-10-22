import React, { useMemo } from "react";
import "./CompletionsList.scss";
import SearchIcon from "./path/SearchIcon";
import classNames from "classnames";
import { SearchHistory } from "../types";

type CompletionsListProps = {
  items: string[] | null;
  onItemClicked: (item: string) => void;
  onItemHovered: (index: number) => void;
  selectedIndex: number;
  searchHistory: SearchHistory;
};

type CompletionItem = {
  text: string;
  searched: boolean;
};

function CompletionsList(props: CompletionsListProps) {
  const { items, selectedIndex, onItemHovered, onItemClicked, searchHistory } =
    props;

  const sortedItems: CompletionItem[] | null = useMemo(() => {
    if (!items || items.length === 0) {
      return null;
    }
    return items
      .map((item) => {
        return {
          text: item,
          searched: searchHistory[item.toLowerCase()] === true,
        };
      })
      .sort((a, b) => {
        if (a.searched && !b.searched) {
          return -1;
        }
        return 1;
      });
  }, [searchHistory, items]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="separator"></div>
      {sortedItems &&
        sortedItems.map((item, i) => {
          const itemClassNames = classNames("completionslist-item", {
            "completionslist-item-selected": selectedIndex === i,
            "completionslist-item-searched": item.searched,
          });
          return (
            <div
              className={itemClassNames}
              key={`${item.text}_${i}`}
              onMouseOver={() => onItemHovered(i)}
              onClick={() => {
                onItemClicked(item.text);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
            >
              <SearchIcon />
              {item.text}
            </div>
          );
        })}
    </>
  );
}

export default CompletionsList;
