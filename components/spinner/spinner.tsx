import { View, ActivityIndicator,StyleSheet} from 'react-native'








const Spinner = ({size = 'small',color = '#000'}:{size?:"large" | 'small';disabled?:boolean;color?:string;}) => {

  // console.log({currentColor});

  return (
    <View style={styles.spinnerWrapper}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  spinnerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  }
})

export default Spinner