import axiosInstance from "../axiosInstance";
import { NewsCategory, NewsCategoryItem, NewsResponse } from "../types";

export const fetchNews = async (page:number = 1,pageSize:number=10,category:'' | NewsCategory = ''): Promise<NewsResponse> => {
  const data = await axiosInstance.get(`/top-headlines?country=us&pageSize=${pageSize}&page=${page}`);
  return data as unknown as NewsResponse;
};