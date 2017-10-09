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
  name: {
    flex: 2,
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventtype: {
    flex: 3,
    justifyContent: 'center'
  },
  eventtypeText: {
    fontSize: Fonts.size.medium,
    fontWeight: 'normal',
  },
  timeContainer: {
    flex: 2,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  time: {
    flex: 4,
    flexDirection: 'row'
  },
  timeStamp: {
    flex: 4,
    marginRight: 1,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9E9EE',
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
    backgroundColor: '#E9E9EE',
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
  likeWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 2
  },
  like: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  likeIconStyle: {
    fontSize: 24,
  },
  likeTextStyle: {
    fontSize: 16,
    marginRight: 8,
  },
})
