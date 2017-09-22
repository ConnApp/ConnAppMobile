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
  searchBar: {
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
  },
})
