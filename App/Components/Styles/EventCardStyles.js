import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

// import styles from './Styles/EventCardStyles'

export default StyleSheet.create({
  contentContainer: {
    height: 130,
    margin: 10,
    padding: 10,
    elevation: 3,
    backgroundColor: 'white'
  },
  name: {
    flex: 3,
    justifyContent: 'center'
  },
  nameText: {
    fontFamily: Fonts.type.normal,
    fontSize: 16,
    fontWeight: 'bold',
  },
  place: {
    flex: 2,
    justifyContent: 'center'
  },
  placeText: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.medium,
    fontWeight: 'normal',
  },
  timeContainer: {
    flex: 2,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  time: {
    flex: 2,
    flexDirection: 'row'
  },
  timeStamp: {
    flex: 4,
    marginRight: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 4
  },
  timeStampIconContainer: {
    flex: 1,
    alignItems: 'center'
  },
  timeStampIconStyle: {
    fontSize: 24,
    color: Colors.primaryLight
  },
  timeTextContainer: {
    flex: 4,
    alignItems: 'center'
  },
  timeTextStyle: {
    fontSize: 16,
    color: Colors.primaryLight
  },
  favorite: {
    flex: 1,
    marginLeft: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 4
  },
  favoriteIconContainer: {
    flex: 1,
    alignItems: 'center'
  },
  favoriteIconStyle: {
    fontSize: 24,
    color: Colors.primaryLight
  },
  like: {
    flex: 2
  },
})
