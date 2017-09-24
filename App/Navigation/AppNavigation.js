import React from 'react'

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation'

import {
  Text,
  Image,
  Platform,
} from 'react-native'

import LaunchScreen from '../Containers/LaunchScreen'
import Splash from '../Containers/Splash'
import Events from '../Containers/Events'
import EventDetails from '../Containers/EventDetails'
import Icon from 'react-native-vector-icons/FontAwesome'

import { Images, Colors, Fonts } from '../Themes'
import styles from './Styles/NavigationStyles'

const device = Platform.OS

const days = [
  {date: 10, name: 'Terça-Feira' },
  {date: 11, name: 'Quarta-Feira'},
  {date: 12, name: 'Quinta-Feira'},
  {date: 13, name: 'Sexta-Feira' },
]

const buildDayTabs = (tabs, day) => {
  const sortName = day.name.substring(0, 3)
  const tabName = `${sortName} ${day.date}`
  let navigationOptions

  switch (device) {
    case 'android':
      navigationOptions = {
        tabBarLabel: tabName
      }
      break;
    case 'ios':
      navigationOptions = {
        tabBarLabel: sortName,
        tabBarIcon: ({ tintColor }) => (
          <Text style={{
            ...Fonts.style.h5,
            color: tintColor,
          }}>
            {day.date}
          </Text>
        )
      }
      break;
    default:
  }

  return {
    ...tabs,
    [tabName]: {
      screen: Events,
      navigationOptions
    }
  }
}

const tabs = days.reduce(buildDayTabs, {})

const tabBarOptions = device == 'android' ?
  ({
    style: {
      backgroundColor: Colors.background,
    },
    indicatorStyle: {
      backgroundColor: 'white'
    },
    inactiveTintColor: Colors.primaryLight,
    activeTintColor: 'white'
  }) :
  ({
    style: {
      backgroundColor:'white',
    },
    indicatorStyle: {
      backgroundColor: 'white'
    },
    inactiveTintColor: Colors.iOSInactive,
    activeTintColor:  Colors.background
  })

const Tabs = TabNavigator(
  {
    ...tabs
  },
  {
    lazy:true,
    tabBarOptions
  }
)

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  Splash: {
    screen: Splash,
    navigationOptions: {
      header: null,
    }
  },
  LaunchScreen: {
    screen: LaunchScreen,
    navigationOptions: {
      header: null,
    }
  },
  Events: {
    screen: Tabs
  },
  EventDetails: {
    navigationOptions: {},
    screen: EventDetails
  },
}, {
  // Default config for all screens
  initialRouteName: 'Splash',
  navigationOptions: {
    headerStyle: styles.header,
    headerTintColor: 'white',
  },
  elevation: 0,
  headerMode: 'screen',
})

export default PrimaryNav
