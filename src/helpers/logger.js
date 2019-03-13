import settings from '../data/settings'


const logger = {
  log(...data) {
    if (this.isDebug()) {
      data.forEach((info) => {
        if (typeof info === 'object') {
          console.log(JSON.stringify(info, null, 2))
        } else {
          console.log(info)
        }
      })
    }
  },
  logError(...data) {
    if (this.isDebug() || this.isProduction()) {
      let errors = ''
      data.forEach((info) => {
        if (info instanceof Error) {
          errors += info.toString()
        } else if (typeof info === 'object') {
          errors += JSON.stringify(info)
        } else {
          errors += info
        }
        errors += ' '
        console.error(info)
      })
    }
  },
  logDivider(text) {
    if (this.isDebug()) {
      console.log('\n ############### ' + text + ' ############### \n')
    }
  },
  logInit() {
    this.logDivider('Handle Request')
  },
  logEnd() {
    if (this.isDebug()) {
      this.logDivider('End Request')
      console.log('        （ ^_^）RESPONSE（^_^ ）        ')
      console.log('                   ⮟                  \n')
    }
  },
  isDebug() {
    return settings.DEBUG === 'true'
  },
  isProduction() {
    return !['local', 'testing'].includes(settings.ENVIRONMENT)
  }
}

export default logger

