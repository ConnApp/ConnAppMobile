import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

// import styles from './Styles/EventCardStyles'

export default StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    backgroundColor: '#efefef'
  },
  category: {
    borderTopColor: '#efefef',
    borderLeftColor: '#efefef',
    borderRightColor: '#efefef',
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderRightWidth: 5,
  },
  header: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerImage: {
    flex: 1,
    marginTop: 0,
    width: 300,
    resizeMode: 'contain'
  },
})
