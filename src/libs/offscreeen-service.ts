import { OffscreenRequest, OffscreenResponse } from './messages'

export async function createOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({})

  const offscreenDocument = existingContexts.find(
    (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
  )

  // If an offscreen document is not already open, create one.
  if (!offscreenDocument) {
    // everyone seems to add an await here, even if it's not necessary :-/
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      // contextType: 'OFFSCREEN_DOCUMENT',
      reasons: ['WORKERS'], // should be Reason.WORKERS
      justification: 'Running fhevm WASM',
    })

    console.log('created offscreen document')
  }
}

class MinimalEventBus extends EventTarget {
  once(eventName: string, callback: (data: OffscreenResponse['data']) => void) {
    const handler = (event: CustomEvent) => {
      this.removeEventListener(eventName, handler as EventListener)
      callback(event.detail)
    }
    this.addEventListener(eventName, handler as EventListener)
  }

  emit(eventName: OffscreenRequest['type'], detail: OffscreenRequest['data']) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }))
  }
}

const eventBus = new MinimalEventBus()

/**
 * abstract some calculation from offscreen page
 * @param type: the type of service
 * @param data: the payload to compute
 * @returns
 */
export async function service({
  type,
  data,
}: Omit<OffscreenRequest, 'target'>): Promise<OffscreenResponse['data']> {
  return new Promise((resolve) => {
    // TODO: create a timeout that rejects the promise if no response is received
    // and once clears the timeout
    eventBus.once(type, async (response) => {
      console.log('service: Received message', type, response)
      resolve(response)
    })
    chrome.runtime.sendMessage({
      type,
      target: 'offscreen',
      data,
    } as OffscreenRequest)
  })
}

function dispatcher(event: OffscreenResponse) {
  console.log('dispatcher: received', event)
  eventBus.emit(event.type, event.data)
}

chrome.runtime.onMessage.addListener(dispatcher)
