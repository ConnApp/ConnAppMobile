import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

// import styles from './Styles/EventCardStyles'

export default StyleSheet.create({
  contentContainer: {
    height: 40,
    marginBottom: 5,
    padding: 10,
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowRadius: 2,
    backgroundColor: 'white',
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
