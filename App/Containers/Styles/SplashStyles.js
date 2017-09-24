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
    alignItems: 'center',
    backgroundColor: colorGradient[0],
  },
  splashImage: {
    flex: 5,
    width: 300,
    resizeMode: 'contain',
  },
  spinner: {
    flex: 5,
  },
  statusTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 24,
  }
}

const iOSStyle = StyleSheet.create({
  ...commonStyle,
})

const andoidStyle = StyleSheet.create({
  ...commonStyle,
})

export const styles = deviceOs == 'android' ? andoidStyle : iOSStyle
