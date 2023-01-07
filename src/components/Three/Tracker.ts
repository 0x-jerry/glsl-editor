export interface Trackable {
  dispose(): any
}

export class Tracker {
  trackObjects = new Set<Trackable>()

  add(...objs: (Trackable | (() => any))[]) {
    objs.forEach((item) => {
      const normalized = typeof item === 'function' ? { dispose: item } : item

      this.trackObjects.add(normalized)
    })
  }

  dispose() {
    for (const item of this.trackObjects) {
      item.dispose()
    }
  }
}
