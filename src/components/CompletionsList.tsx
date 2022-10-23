import React, { useMemo } from "react";
import "./CompletionsList.scss";
import SearchIcon from "./path/SearchIcon";
import classNames from "classnames";
import { SearchHistory } from "../types";

type CompletionsListProps = {
  items: string[] | null;
  onItemClicked: (item: string) => void;
  onItemDeleted: (item: string) => void;
  onItemHovered: (index: number) => void;
  selectedIndex: number;
  searchHistory: SearchHistory;
};

type CompletionItem = {
  text: string;
  searched: boolean;
};

function CompletionsList(props: CompletionsListProps) {
  const {
    items,
    selectedIndex,
    onItemHovered,
    onItemClicked,
    onItemDeleted,
    searchHistory,
  } = props;

  const sortedItems: CompletionItem[] | null = useMemo(() => {
    if (!items || items.length === 0) {
      return null;
    }
    const result = items
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
    result.splice(10);
    return result;
  }, [searchHistory, items]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="completionslist-separator">
        <div />
      </div>
      {sortedItems &&
        sortedItems.map((item, i) => {
          const itemClassNames = classNames("completionslist-item", {
            selected: selectedIndex === i,
            searched: item.searched,
          });
          return (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              className={itemClassNames}
              key={`${item.text}_${i}`}
            >
              <div
                className="main"
                onMouseOver={() => onItemHovered(i)}
                onClick={() => {
                  onItemClicked(item.text);
                }}
              >
                <SearchIcon />
                {item.text}
              </div>
              {item.searched && selectedIndex === i && (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    onItemDeleted(item.text);
                  }}
                  className="delete-button"
                >
                  Delete
                </div>
              )}
            </div>
          );
        })}
    </>
  );
}

export default CompletionsList;
