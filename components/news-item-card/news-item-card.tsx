import { View, Text, StyleSheet,Image } from "react-native";
import React from "react";
import { NewsItem } from "@/utils/types";
import { formatDateToTimeAgo } from "@/utils";

interface NewsItemCardProps {
  newsItem: NewsItem;
}
const NewsItemCard = ({newsItem}:NewsItemCardProps) => {

  return (
    <View style={styles.newsItemCard}>
      <View style={styles.newsItemCardImageWrapper}>
        <Image
          source={ newsItem?.urlToImage ? { uri: newsItem?.urlToImage } : require('../../assets/images/react-logo.png') }
          style={styles.newsItemCardImage}
        />
      </View>
      <View style={styles.newsItemCardContentWrapper}>
        <View style={{}}>
          <Text style={styles.newsItemCardTitle} numberOfLines={2}>
            {newsItem?.title ?? 'N/A'}
          </Text>
        </View>
        <View style={{}}>
          <Text style={styles.newsItemCardDescription} numberOfLines={2}>
            {newsItem?.description ?? 'N/A'}
          </Text>
        </View>
        <View style={styles.newsItemCardFooter}>
          <Text style={styles.newsItemCardFooterText} numberOfLines={2}>
             {newsItem?.publishedAt ? formatDateToTimeAgo(newsItem?.publishedAt) : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  newsItemCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 10,
    marginVertical: 10,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,

    width: "100%",
    height: 160,
    flexDirection: "row",
    gap: 10,
  },
  newsItemCardImageWrapper: {
    // width: '30%',
    flex: 0.45,
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#c1c1c1",
    justifyContent: "center",
    alignItems: "center",
  },
  newsItemCardImage: {
    width: "100%",
    height: "100%",
  },
  newsItemCardContentWrapper: {
    flex: 0.7,
    paddingVertical: 10,
    gap: 6,
    justifyContent: "space-between",
  },
  newsItemCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    fontFamily: 'SpaceMono',
  },
  newsItemCardDescription: {
    fontSize: 14,
    color: "black",
    fontFamily: 'SpaceMono',
  },
  newsItemCardFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  newsItemCardFooterText: {
    color: "blue",
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
});

export default NewsItemCard;
