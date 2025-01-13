function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function createNode(value) {
  return {
    id: generateId(),
    value,
    next: null,
    prev: null,
  };
}

export function insertNodeToEnd(head, tail, newNode) {
  if (!head) {
    return { newHead: newNode, newTail: newNode };
  }
  tail.next = newNode;
  newNode.prev = tail;
  return { newHead: head, newTail: newNode };
}

export function findNode(head, value) {
  const steps = [];
  let current = head;
  while (current) {
    steps.push(current);
    if (current.value === value) {
      break;
    }
    current = current.next;
  }
  return steps;
}

export function deleteNodeFromList(head, tail, targetNode) {
  if (!head) {
    return { newHead: null, newTail: null };
  }

  if (targetNode === head) {
    const newHead = head.next;
    if (newHead) {
      newHead.prev = null;
    }
    const newTail = (head === tail) ? newHead : tail;
    return { newHead, newTail };
  }

  if (targetNode === tail) {
    const newTail = tail.prev;
    if (newTail) {
      newTail.next = null;
    }
    return { newHead: head, newTail };
  }

  const prevNode = targetNode.prev;
  const nextNode = targetNode.next;
  if (prevNode) {
    prevNode.next = nextNode;
  }
  if (nextNode) {
    nextNode.prev = prevNode;
  }
  return { newHead: head, newTail: tail };
}
