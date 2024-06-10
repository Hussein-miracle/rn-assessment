import React, { useState, useEffect, useMemo ,useCallback} from "react";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StatusBar,
  Alert,
  FlatList,
  TextInput,
  RefreshControl,
} from "react-native";

import { DEFAULT_NEWS_PAGE, DEFAULT_NEWS_SIZE, SCREEN_WIDTH } from "@/constants";
import NewsItemCard from "@/components/news-item-card/news-item-card";
import { NewsCategoryItem, NewsItem } from "@/utils/types";
import { fetchNews } from "@/utils/api";
import Spinner from "@/components/spinner/spinner";
import { useDebounce } from "@/hooks/client/use-debounce";


export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [news, setNews] = useState<Array<NewsItem>>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [category, setCategory] = useState<NewsCategoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [filteredNews, setFilteredNews] = useState<Array<NewsItem>>([]);
  // const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const newsDataResponse = await fetchNews(page,pageSize);
        // console.log({ newsDataResponse });
        if (newsDataResponse?.status === "error") {
          throw new Error(
            newsDataResponse?.message ?? "An error occurred while fetching news"
          );
        }
        const totalItems = newsDataResponse.totalResults;
        const newsData = newsDataResponse.articles;
        
        setTotalResults(totalItems);
        setNews(newsData);
      } catch (error: any) {
        // console.error({ error });
        Alert.alert("Error", error?.message);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const filteredNewsData = useMemo(() => {
    if (searchQuery.length === 0) {
      // EARLY RETURN IF SEARCH QUERY IS EMPTY
      return news;
    }
    

    return news.filter((newsItem: NewsItem) =>
      newsItem?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [news, searchQuery]);


  const onRefresh = async () => {
    setPage(DEFAULT_NEWS_PAGE);
    setPageSize(DEFAULT_NEWS_SIZE);
    setIsRefreshing(true);
    try {
      const newsDataResponse = await fetchNews(DEFAULT_NEWS_PAGE,DEFAULT_NEWS_SIZE);
      // console.log({ newsDataResponse });
      if (newsDataResponse?.status === "error") {
        throw new Error(
          newsDataResponse?.message ?? "An error occurred while fetching news"
        );
      }
      const newsData = newsDataResponse.articles;
      setTotalResults(newsDataResponse.totalResults);

      setNews(newsData);

    } catch (error: any) {
      // console.error({ error });
      Alert.alert("Error", error?.message);
    } finally {
      setIsRefreshing(false);
    }
  };


  const handleViewAll =  useCallback(async () => {
    const ceiled = Math.ceil(totalResults / pageSize);
    if(news.length >= totalResults || pageSize >= totalResults || page >= ceiled){
      return;
    }
    setIsLoading(true);
    // setPageSize(totalResults)
    setPageSize(totalResults);


    try {
      const newsDataResponse = await fetchNews(DEFAULT_NEWS_PAGE,totalResults,category?.value ?? "");
      // console.log({ newsDataResponse });
      if (newsDataResponse?.status === "error") {
        throw new Error(
          newsDataResponse?.message ?? "An error occurred while fetching news"
        );
      }
      const newsData = newsDataResponse.articles;
      setTotalResults(newsDataResponse.totalResults);
      setNews((prevNews:NewsItem[]) => [...prevNews, ...newsData]);
    } catch (error: any) {
      // console.error({ error });
      Alert.alert("Error", error?.message);
    } finally {
      setIsLoading(false);
    }
  },[page,pageSize,category?.value,news,totalResults]);



  const handleFetchMore = useCallback(async (page:number,pageSize:number,category:NewsCategoryItem | null) => {
    setIsLoadingMore(true);

    try {
      const newsDataResponse = await fetchNews(page + 1,pageSize,category?.value ?? "");
      // console.log({ newsDataResponse });
      if (newsDataResponse?.status === "error") {
        throw new Error(
          newsDataResponse?.message ?? "An error occurred while fetching news"
        );
      }
      const newsData = newsDataResponse.articles;
      setTotalResults(newsDataResponse.totalResults);
      setNews((prevNews:NewsItem[]) => [...prevNews, ...newsData]);
    } catch (error: any) {
      // console.error({ error });
      Alert.alert("Error", error?.message);
    } finally {
      setIsLoadingMore(false);
    }
  },[page,pageSize,category?.value]);

  const onEndReached = useCallback(async () => {
    
    // console.log({page,newsLength:news.length,totalResults,pageSize});
    const ceiled = Math.ceil(totalResults / pageSize);
    if(news.length >= totalResults || pageSize >= totalResults || page >= ceiled){
      return;
    }
    
    setPage((prevPage:number) => prevPage + 1);

    await handleFetchMore(page + 1,pageSize,category);
    


  },[news.length,totalResults,pageSize,page,category,handleFetchMore])

  return (
    <View style={styles.wrapperStyle}>
      <View style={styles.headerStyle}>
        
        <TextInput
          placeholder="Search news title..."
          style={styles.headerSearchInputStyle}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
      />

      </View>
      <View style={styles.listStyle}>
        <View style={styles.listHeaderStyle}>
          <Text style={styles.listHeaderTextStyle}>Todays</Text>
          <TouchableOpacity activeOpacity={0.5} onPress={handleViewAll}>
            <Text style={styles.listHeaderCTATextStyle}>View&nbsp;All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContentStyle}>
          {!isLoading && news?.length > 0 ? (
            <FlatList
              data={filteredNewsData}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: SCREEN_WIDTH * 0.2,
              }}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              keyExtractor={(item: NewsItem) =>
                item.title + item?.urlToImage + item?.publishedAt  + new Date().getTime()?.toString() + Math.random().toString()
              }
              onScroll={(e) => {
                // console.log({ e:e.i });
              }}
              renderItem={({ item }: { item: NewsItem }) => {
                // console.log({ item });
                return <NewsItemCard newsItem={item} />;
              }}

              refreshing={isRefreshing}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} colors={['#000']} onRefresh={onRefresh} />
              }

              ListFooterComponent={() =>
                isLoadingMore ? (
                  <View  style={styles.loadMoreStyle}>
                    <Spinner wrap={false} />
                    <Text
                      style={styles.loadMoreTextStyle}
                    >
                      Loading
                    </Text>
                  </View>
                ) : null
              }
            />
          ) : null}

          {isLoading && <Spinner />}

          {!isLoading && (news?.length === 0) ? (
            <View style={styles.listEmptyStyle}>
              <Text style={styles.listEmptyTextStyle}>No news available</Text>
            </View>
          ) : null}
          {!isLoading && (news?.length > 0 && filteredNewsData.length <= 0) ? (
            <View style={styles.listEmptyStyle}>
              <Text style={styles.listEmptyTextStyle}>News with that title is not available</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    flex: 1,
    backgroundColor: "#eee",
    paddingTop: (StatusBar.currentHeight ?? 0) + 20,
    paddingHorizontal: 30,
    gap: 20,
  },
  headerStyle: {},
  headerSearchInputStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    fontFamily: "SpaceMono",
    fontSize: 16,
    padding: 10,

    
  },
  listStyle: {
    flex: 1,
    gap: 20,
  },
  listHeaderStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding:10,
  },
  listHeaderTextStyle: {
    color: "#000",
    fontFamily: "SpaceMono",
    fontSize: 20,
  },
  listHeaderCTATextStyle: {
    textDecorationLine: "underline",
    color: "blue",
    fontSize: 20,
    fontFamily: "SpaceMono",
  },
  listHeaderCTABtnStyle: {},
  listContentStyle: {
    width: "100%",
  },
  listEmptyStyle: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  listEmptyTextStyle: {
    fontSize: 18,
    color: "#000",
    fontFamily: "SpaceMono",
  },
  loadMoreStyle: {
    transform:[{translateY:-10}],
    flexDirection:'row',
    gap:10,
    width:"100%",
    alignContent:'center',
    justifyContent:'center', 
  },
  loadMoreTextStyle: {
    textAlign: "center",
    fontFamily: "SpaceMono",
    fontSize: 13,
    color: "#000",
    padding: 6,
    
  }
});
