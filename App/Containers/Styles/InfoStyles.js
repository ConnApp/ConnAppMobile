import { StyleSheet, Platform } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

// import styles from './Styles/EventCardStyles'

const device = Platform.OS

const searchBar = device == 'android' ?
  {
    width: 150,
    height: 50,
    padding: 10,
    margin: 5,
    marginRight: 15,
    fontSize: 12,
    borderRadius: 10,
    color: 'white',
    fontSize: 16,
    textAlign: "center",
    textAlignVertical: "center"
  } :
  {
    width: 350,
    height: 35,
    padding: 0,
    marginTop: 10,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    fontSize: 12,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.backgroundColor,
    backgroundColor: '#FFFFFFAA',
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: 'center'
  }

export default StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flexDirection: 'column',
    backgroundColor: '#E9E9EE'
  },
  category: {
    borderTopColor: '#E9E9EE',
    borderLeftColor: '#E9E9EE',
    borderRightColor: '#E9E9EE',
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
  searchBar
})
