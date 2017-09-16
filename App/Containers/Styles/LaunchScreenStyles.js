import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors } from '../../Themes/'
import Gradient from '../../Gradient'

export const colors =  {
  initialColor: Colors.primary,
  finalColor: Colors.primaryLight,
  steps: 6
}

export const colorGradient= new Gradient(colors)

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colorGradient[0]
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
  menuList: {
    flex: 8,
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
