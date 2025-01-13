export function initializeSCCProcess(nodes, edges) {
  const nodeIds = nodes.map((n) => n.id);
  const adjacencyList = buildAdjList(nodes, edges);
  const transposedList = buildTransposeAdjList(nodes, edges);
  return {
    adjacencyList,
    transposedList,
    orderStack: [],
    currentPhase: 1,
    visitedSet: new Set(),
    currentDfsStack: [],
    nodeIds,
    sccIndex: 0,
    done: false,
  };
}

export function startSCCProcess(setIsRunning, setIsPaused) {
  setIsRunning(true);
  setIsPaused(false);
}

export function stepSCCProcess({
  sccData,
  updateNodeState,
  setIsRunning,
  isPausedRef,
}) {
  if (!sccData || sccData.done) {
    setIsRunning(false);
    return null;
  }
  if (isPausedRef.current) {
    return sccData;
  }
  if (sccData.currentPhase === 1) {
    const { visitedSet, nodeIds, adjacencyList, orderStack, currentDfsStack } =
      sccData;
    if (currentDfsStack.length === 0) {
      const unvisited = nodeIds.find((id) => !visitedSet.has(id));
      if (unvisited === undefined) {
        return {
          ...sccData,
          currentPhase: 2,
          visitedSet: new Set(),
        };
      } else {
        visitedSet.add(unvisited);
        updateNodeState(unvisited, 'visited');
        return {
          ...sccData,
          currentDfsStack: [unvisited],
        };
      }
    } else {
      const top = currentDfsStack[currentDfsStack.length - 1];
      const neighbors = adjacencyList[top] || [];
      const unvisitedNeighbor = neighbors.find((n) => !visitedSet.has(n));
      if (unvisitedNeighbor === undefined) {
        currentDfsStack.pop();
        orderStack.push(top);
        return {
          ...sccData,
        };
      } else {
        visitedSet.add(unvisitedNeighbor);
        updateNodeState(unvisitedNeighbor, 'visited');
        currentDfsStack.push(unvisitedNeighbor);
        return {
          ...sccData,
        };
      }
    }
  }
  if (sccData.currentPhase === 2) {
    const { visitedSet, transposedList, orderStack, currentDfsStack, sccIndex } =
      sccData;
    if (currentDfsStack.length === 0) {
      while (orderStack.length > 0) {
        const candidate = orderStack[orderStack.length - 1];
        if (!visitedSet.has(candidate)) {
          visitedSet.add(candidate);
          updateNodeState(candidate, 'visited');
          return {
            ...sccData,
            currentDfsStack: [candidate],
          };
        } else {
          orderStack.pop();
        }
      }
      return {
        ...sccData,
        done: true,
      };
    } else {
      const top = currentDfsStack[currentDfsStack.length - 1];
      const neighbors = transposedList[top] || [];
      const unvisitedNeighbor = neighbors.find((n) => !visitedSet.has(n));
      if (unvisitedNeighbor === undefined) {
        currentDfsStack.pop();
        updateNodeState(top, 'final');
        const lastFromOrder = orderStack.pop();
        console.log('Popped from orderStack:', lastFromOrder);
        if (currentDfsStack.length === 0) {
          const newSccIndex = sccIndex + 1;
          return {
            ...sccData,
            sccIndex: newSccIndex,
          };
        } else {
          return {
            ...sccData,
          };
        }
      } else {
        visitedSet.add(unvisitedNeighbor);
        updateNodeState(unvisitedNeighbor, 'visited');
        currentDfsStack.push(unvisitedNeighbor);
        return {
          ...sccData,
        };
      }
    }
  }
  return sccData;
}

export function pauseSCCProcess(isRunning, setIsPaused, isPaused) {
  if (!isRunning) return;
  setIsPaused(!isPaused);
}

export function resetSCCProcess(setNodes, setCurrentNode, setIsRunning, setIsPaused) {
  setNodes((prev) => prev.map((n) => ({ ...n, state: 'unvisited' })));
  setCurrentNode(null);
  setIsRunning(false);
  setIsPaused(false);
}

function buildAdjList(nodes, edges) {
  const list = {};
  nodes.forEach((n) => {
    list[n.id] = [];
  });
  edges.forEach((e) => {
    list[e.from].push(e.to);
  });
  return list;
}

function buildTransposeAdjList(nodes, edges) {
  const list = {};
  nodes.forEach((n) => {
    list[n.id] = [];
  });
  edges.forEach((e) => {
    list[e.to].push(e.from);
  });
  return list;
}
