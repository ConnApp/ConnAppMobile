import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

// import styles from './Styles/EventCardStyles'

export default StyleSheet.create({
  contentContainer: {
    margin: 10,
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
  bottomContainer: {
    flex: 1,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E9E9EE',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleContainer: {
    maxWidth: 175,
    justifyContent: 'center'
  },
  titleText: {
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontWeight: '600',
  },
  timeStampContainer: {
  },
  timeStampText: {
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontWeight: '300',
  },
})
