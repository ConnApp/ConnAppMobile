import { StackNavigator, TabNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import Events from '../Containers/Events'
import EventDetails from '../Containers/EventDetails'

import styles from './Styles/NavigationStyles'

const Tabs = TabNavigator(
  {
    'Ter 10': {
      screen: Events,
    },
    'Qua 11': {
      screen: Events
    },
    'Qui 12': {
      screen: Events
    },
    'Sex 13': {
      screen: Events
    }
  },
  {
    lazy:true,
    tabBarOptions: {
      style: {
        backgroundColor: '#054D73',
      },
      indicatorStyle: {
        backgroundColor: 'white'
      },
      inactiveTintColor: '#5FA7CD',
      activeTintColor: 'white'
    }
  }
)

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: {
    screen: LaunchScreen,
    navigationOptions: {
      header: null,
    }
  },
  Events: {
    navigationOptions: {
      title: 'Programação',
    },
    screen: Tabs
  },
  EventDetails: {
    navigationOptions: {
      title: 'Carregando Evento',
    },
    screen: EventDetails
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
