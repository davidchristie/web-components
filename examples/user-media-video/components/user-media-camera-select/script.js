const { customElements, Event, HTMLElement } = window

const VALUE = 'value'

class UserMediaCameraSelect extends HTMLElement {
  constructor () {
    super()

    this.attachShadow({mode: 'open'})

    this._setState({
      cameras: [],
      value: null
    })
  }

  static get observedAttributes () {
    return [
      VALUE
    ]
  }

  get value () {
    return this._state.value
  }

  set value (value) {
    this.setAttribute(VALUE, value)
  }

  _render () {
    this.shadowRoot.innerHTML = `
      <select>
        <option>Select a camera...</option>
        ${this._state.cameras.map(camera => {
          return `
            <option
              ${this._state.value === camera.deviceId ? 'selected' : ''}
              value="${camera.deviceId}"
            >
              ${camera.label || camera.deviceId}
            </option>
          `
        }).join('')}
      </select>
    `
    this.shadowRoot.querySelector('select').addEventListener('change', event => {
      this.value = event.target.value
    })
  }

  _setState (newState) {
    this._state = {
      ...this._state,
      ...newState
    }
    this._render()
  }

  _updateCameras () {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const cameras = devices.filter(device => device.kind === 'videoinput')
        this._setState({
          cameras
        })
      })
      .catch(error => {
        console.error(
          'navigator.mediaDevices.enumerateDevices error: ',
          error
        )
      })
  }

  attributeChangedCallback (attributeName, oldValue, newValue) {
    switch (attributeName) {
      case VALUE:
        this._setState({
          value: newValue
        })
        this.dispatchEvent(new Event('change', {
          target: this
        }))
        break
    }
  }

  connectedCallback () {
    this._updateCameras()
  }
}

customElements.define('user-media-camera-select', UserMediaCameraSelect)
