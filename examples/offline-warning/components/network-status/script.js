const STATUS = 'status'

class NetworkStatus extends window.HTMLElement {
  constructor () {
    super()
    const updateOnlineStatus = event => {
      const status = navigator.onLine ? 'online' : 'offline'
      console.log(status)
      this.setAttribute(STATUS, status)
    }
    window.addEventListener('offline', updateOnlineStatus)
    window.addEventListener('online', updateOnlineStatus)
    updateOnlineStatus()
  }
}

window.customElements.define('network-status', NetworkStatus)
