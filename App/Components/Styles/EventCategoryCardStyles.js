import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

// import styles from './Styles/EventCardStyles'

export default StyleSheet.create({
  contentContainer: {
    height: 40,
    margin: 10,
    padding: 10,
    elevation: 3,
    backgroundColor: 'white'
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.input,
    fontWeight: 'bold',
  },
})
