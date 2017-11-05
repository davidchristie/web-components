const { customElements, HTMLElement } = window

const CAMERA = 'camera'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
    }
    :host video {
      height: auto;
      width: 100%;
    }
  </style>
  <video autoplay></video>
`

class UserMediaVideoStream extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._onCameraChange(null)
  }

  get camera () {
    return this.getAttribute(CAMERA) || null
  }

  set camera (value) {
    this.setAttribute(CAMERA, value)
  }

  static get observedAttributes () {
    return [
      CAMERA
    ]
  }

  _onCameraChange (camera) {
    const video = this.shadowRoot.querySelector('video')

    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        deviceId: {
          exact: camera
        }
      }
    })
      .then(stream => { video.srcObject = stream })
      .catch(() => { video.srcObject = null })
  }

  attributeChangedCallback (attributeName, oldValue, newValue) {
    switch (attributeName) {
      case CAMERA:
        this._onCameraChange(newValue)
        break
    }
  }

  connectedCallback () {
  }
}

customElements.define('user-media-video-stream', UserMediaVideoStream)
