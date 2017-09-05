
class Gradient {
  constructor({initialColor, finalColor, steps = 2}) {
    if (steps < 3) return [initialColor, finalColor]
    let colorArray = []

    initialColor = this.separateColors(initialColor)
    finalColor = this.separateColors(finalColor)

    colorArray.push(initialColor)

    const step = {
      red: this.getStepLength(initialColor.red, finalColor.red, steps),
      green: this.getStepLength(initialColor.green, finalColor.green, steps),
      blue: this.getStepLength(initialColor.blue, finalColor.blue, steps),
    }

    for (var i = 0; i < steps - 1; i++) {
      let currentColor = colorArray[colorArray.length - 1]
      let nextColor = this.addStepToColor(currentColor, step)

      colorArray.push(nextColor)
    }

    colorArray.push(finalColor)

    return colorArray.map(this.toHexColor)
  }

  addStepToColor (color, step) {
    return {
      red: Math.round(color.red + step.red),
      green: Math.round(color.green + step.green),
      blue:Math.round( color.blue + step.blue),
    }
  }

  getStepLength (start, end, steps) {
    return (end - start)/steps
  }

  separateColors (color) {
    return {
      red: parseInt(color.substring(0,2), 16),
      blue: parseInt(color.substring(2,4), 16),
      green: parseInt(color.substring(4,6), 16),
    }
  }


  toHexColor (color) {
    return (
      '#' +
      color.red.toString(16) +
      color.blue.toString(16) +
      color.green.toString(16)
    )
  }
}

export default Gradient
