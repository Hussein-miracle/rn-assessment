import { NewsCategoryItem } from "@/utils/types";
import { Dimensions } from "react-native";


export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;


export const DEFAULT_NEWS_SIZE = 10;
export const DEFAULT_NEWS_PAGE = 1;

export const NEWS_CATEGORIES:NewsCategoryItem[] = [
  {
    label: "Business",
    value: "business"
  },
  {
    label: "Entertainment",
    value: "entertainment"
  },
  {
    label: "General",
    value: "general"
  },
  {
    label: "Health",
    value: "health"
  },
  {
    label: "Science",
    value: "science"
  },
  {
    label: "Sports",
    value: "sports"
  },
  {
    label: "Technology",
    value: "technology"
  }
]