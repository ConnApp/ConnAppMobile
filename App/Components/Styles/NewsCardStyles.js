import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

// import styles from './Styles/EventCardStyles'

export default StyleSheet.create({
  contentContainer: {
    height: 130,
    margin: 10,
    padding: 10,
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowRadius: 2,
    backgroundColor: 'white'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  titleText: {
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontWeight: 'bold',
  },
  newsTextContainer: {
    flex: 2,
    padding: 10,
    justifyContent: 'center'
  },
  newsText: {
    fontFamily: Fonts.type.base
  },
  timeStampContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  timeStampText: {
    fontFamily: Fonts.type.base,
    fontSize: 18,
    alignSelf: 'flex-end',
    fontWeight: '300',
  },
})
