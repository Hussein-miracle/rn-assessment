import { View, ActivityIndicator, StyleSheet } from "react-native";

const Spinner = ({
  size = "small",
  color = "#000",
  wrap = true,
}: {
  size?: "large" | "small";
  disabled?: boolean;
  color?: string;
  wrap?: boolean;
}) => {
  // console.log({currentColor});

  return (
    <>
      {wrap ? (
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={size} color={color} />
        </View>
      ) : (
        <ActivityIndicator size={size} color={color} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  spinnerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
});

export default Spinner;
