import { StyleSheet, Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors } from '../../Themes/'
import Gradient from '../../Gradient'

export const colors =  {
  initialColor: Colors.primary,
  finalColor: Colors.primaryLight,
  steps: 6
}

export const colorGradient= new Gradient(colors)

const deviceOs = Platform.OS

const commonStyle = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colorGradient[0],
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    flex: 1,
    marginTop: 0,
    width: 300,
    resizeMode: 'contain',
  }
}

const iOSStyle = StyleSheet.create({
  ...commonStyle,
  headerImage: {
    flex: 1,
    marginTop: 30,
    width: 300,
    resizeMode: 'contain',
  },
  menuList: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  menuButtonView: {
    flex: 1
  },
  menuButton: {
    height: 80,
    width: 700
  },
})

const andoidStyle = StyleSheet.create({
  ...commonStyle,
  menuList: {
    flex: 3,
    marginLeft: -15,
    marginRight: -15
  },
  menuButtonView: {
    flex: 1
  },
  menuButton: {
    flex: 1
  }
})

export const styles = deviceOs == 'android' ? andoidStyle : iOSStyle
