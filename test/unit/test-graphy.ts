import test from 'ava'

import { Graphy, Node } from '../../src/index'

const generateRandomNumber = (except?: number) => {
  let returnValue = Math.floor(Math.random() * 1000) 
  if (returnValue === except) {
    returnValue = generateRandomNumber(except)
  }
  return returnValue
}

test('Graphy is subscribing correctly to Node', (t) => {
  for (let i = 0; i < 1000; i++) {
    let initialFirstValue = generateRandomNumber()
    const nodes = [
      new Node<number>({ value: initialFirstValue, label: 'Test 1'}),
      new Node<number>({ value: generateRandomNumber(initialFirstValue), label: 'Test 2'})
    ]
    const graphy = new Graphy<number>({nodes})

    let firstValue = generateRandomNumber()
    nodes[0]!.value = firstValue
    let firstRunValue = graphy.mostRecentChange?.value
    nodes[0]!.value = generateRandomNumber(firstValue)
    let secondRunValue = graphy.mostRecentChange?.value

    t.not(firstRunValue, secondRunValue)

    let firstLabel = generateRandomNumber()
    nodes[0]!.label = `${firstLabel}`
    let firstRunLabel = graphy.mostRecentChange?.label
    nodes[0]!.label = `${generateRandomNumber(firstLabel)}`
    let secondRunLabel = graphy.mostRecentChange?.label
    
    t.not(firstRunLabel, secondRunLabel)
  }
})

test('Graphy is able to subscribe to Nodes', (t) => {
  const graphy = new Graphy<number>({ nodes: [] })
  for (let i = 0; i < 1000; i++) {
    let node = new Node<number>({ value: generateRandomNumber(), label: 'Test' })
    graphy.subscribeNodes([ node ])
  }
  let nodes = graphy.nodes
  t.is(nodes.length, 1000)
})

test('Graphy is able to unsubscribe Nodes', (t) => {
  const nodes = new Array<Node<number>>()
  for (let i = 0; i < 1000; i++) {
    nodes.push(new Node<number>({ value: generateRandomNumber(), label: 'Test' }))
  }
  const graphy = new Graphy<number>({ nodes })
  const totalNodes = graphy.nodes
  for (let i = 0; i < totalNodes.length; i++) {
    graphy.unsubscribeNodes([ totalNodes[i]! ])
  }
  t.is(graphy.nodes.length, 0)
})

test('Graphy is able to unsubscribe all Nodes', (t) => {
  const nodes = new Array<Node<number>>()
  for (let i = 0; i < 1000; i++) {
    nodes.push(new Node<number>({ value: generateRandomNumber(), label: 'Test' }))
  }
  const graphy = new Graphy<number>({ nodes })
  graphy.unsubscribeAll()
  t.is(graphy.nodes.length, 0)
})