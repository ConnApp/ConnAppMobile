import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import Events from '../Containers/Events'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: {
    screen: LaunchScreen,
  },
  Events: {
    screen: Events,
    navigationOptions: {
      title: 'Programação'
    }
  },

}, {
  // Default config for all screens
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header,
    headerTintColor: 'white',
  },
  elevation: 0,
  headerMode: 'screen',
})

export default PrimaryNav
