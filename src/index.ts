/**
 * graphy
 * Typescript library for graph visualization
 */

/**
 * g
 */
const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  .replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export class Node<T> {
  public uuid: string
  private graph: Graphy<T> | undefined
  private _label: string
  private _value: T

  constructor({ label, value }: { label: string; value: T }) {
    this.uuid = uuid()
    this._label = label
    this._value = value
  }

  // START of Getters and setters

  public set value(value: T) {
    this._value = value
    this.updateSubscribers()
  }

  public get value() {
    return this._value
  }

  public set label(label: string) {
    this._label = label
    this.updateSubscribers()
  }

  public get label() {
    return this._label
  }

  // END of Getters and setters

  public unsubscribe() {
    this.graph = undefined
    return true
  }

  public subscribe(graph: Graphy<T>) {
    if (graph instanceof Graphy<T>) {
      this.graph = graph
      return true
    } else {
      return false
    }
  }

  private updateSubscribers() {
    if (this.graph !== undefined) {
      this.graph.update(this)
    }
  }
}

export class Graphy<T> {
  /**
   * g.Graph
   * @param nodes
   * @param edges
   */
  private subscribedNodes: Node<T>[]
  public mostRecentChange: Node<T> | undefined
  
  constructor({ nodes }: { nodes: Node<T>[] }) {
    this.subscribedNodes = new Array<Node<T>>();
    this.init(nodes)
  }

  private init(nodes: Node<T>[]) {
    this.subscribeNodes(nodes)
  }

  // START of Getters and setters

  public get nodes() {
    return this.subscribedNodes
  }

  // END of Getters and setters

  public render() {
  }
  
  public update(changedNode: Node<T>) {
    this.mostRecentChange = changedNode
    this.render()
  }

  public subscribeNodes(nodes: Node<T>[]) {
    nodes.forEach((value) => {
      const isSubscribed = value.subscribe(this)
      if (isSubscribed) {
        this.subscribedNodes.push(value)
        this.update(value)
      }
    })
  }

  public unsubscribeNodes(nodes: Node<T>[]) {
    nodes.forEach((value) => {
      const isUnsubscribed = value.unsubscribe()
      if (isUnsubscribed) {
        this.subscribedNodes = this.subscribedNodes.filter((node) => node.uuid !== value.uuid)
      }
    })
  }

  public unsubscribeAll() {
    this.unsubscribeNodes(this.subscribedNodes)
  }
}
