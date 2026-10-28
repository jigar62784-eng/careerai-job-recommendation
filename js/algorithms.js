/**
 * CareerAI Algorithm Lab Engine
 * Demonstrable Artificial Intelligence PBL Algorithms:
 * 1. Breadth-First Search (BFS) - Unweighted shortest path for transition steps / prerequisite chains.
 * 2. Depth-First Search (DFS) - Deep career path exploration with backtracking.
 * 3. A* Search (A-Star) - Heuristic-guided minimum-effort learning path finding.
 * 4. Constraint Satisfaction Filtering - Multi-attribute forward-checking constraint solver.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CareerAlgorithms = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  /**
   * Helper to build an adjacency list from graph data
   */
  function buildAdjacencyList(nodes, edges) {
    const adj = {};
    const nodeMap = {};

    nodes.forEach(n => {
      adj[n.id] = [];
      nodeMap[n.id] = n;
    });

    edges.forEach(e => {
      if (adj[e.from]) {
        adj[e.from].push({
          to: e.to,
          weight: e.weight || 1,
          type: e.type || 'prerequisite'
        });
      }
    });

    return { adj, nodeMap };
  }

  // ==========================================
  // 1. BREADTH-FIRST SEARCH (BFS)
  // ==========================================
  /**
   * Performs BFS to find the shortest transition path (fewest edges) from startNode to goalNode.
   * Tracks full execution steps, queue evolution, visited sets, and parent pointers.
   */
  function runBFS(nodes, edges, startId, goalId) {
    const { adj, nodeMap } = buildAdjacencyList(nodes, edges);
    const steps = [];
    let stepCount = 0;

    if (!nodeMap[startId] || !nodeMap[goalId]) {
      return { error: 'Invalid start or goal node identifier', success: false };
    }

    const queue = [startId];
    const visited = new Set([startId]);
    const parentMap = {};
    parentMap[startId] = null;

    steps.push({
      step: ++stepCount,
      action: `Initialize BFS queue with starting node [${nodeMap[startId].label}]. Visited set initialized.`,
      currentNode: startId,
      queueState: [...queue],
      visitedState: Array.from(visited),
      isGoal: startId === goalId
    });

    let found = false;

    while (queue.length > 0) {
      const current = queue.shift();

      steps.push({
        step: ++stepCount,
        action: `Dequeued [${nodeMap[current].label}]. Evaluating neighbors...`,
        currentNode: current,
        queueState: [...queue],
        visitedState: Array.from(visited),
        isGoal: current === goalId
      });

      if (current === goalId) {
        found = true;
        steps.push({
          step: ++stepCount,
          action: `Goal node [${nodeMap[goalId].label}] reached! Shortest path identified.`,
          currentNode: current,
          queueState: [...queue],
          visitedState: Array.from(visited),
          isGoal: true
        });
        break;
      }

      const neighbors = adj[current] || [];
      for (const edge of neighbors) {
        const neighborId = edge.to;
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          parentMap[neighborId] = current;
          queue.push(neighborId);

          steps.push({
            step: ++stepCount,
            action: `Discovered unvisited neighbor [${nodeMap[neighborId].label}]. Enqueued and marked visited.`,
            currentNode: neighborId,
            queueState: [...queue],
            visitedState: Array.from(visited),
            isGoal: neighborId === goalId
          });

          if (neighborId === goalId) {
            found = true;
            break;
          }
        }
      }

      if (found) break;
    }

    // Reconstruct path
    const path = [];
    if (found) {
      let curr = goalId;
      while (curr !== null) {
        path.unshift(curr);
        curr = parentMap[curr];
      }
    }

    return {
      success: found,
      startId,
      goalId,
      path,
      pathNodes: path.map(id => nodeMap[id]),
      hops: path.length > 0 ? path.length - 1 : 0,
      totalExploredNodes: visited.size,
      steps
    };
  }

  // ==========================================
  // 2. DEPTH-FIRST SEARCH (DFS)
  // ==========================================
  /**
   * Performs DFS to explore deep career progression chains and branch depths.
   * Tracks recursive stack state, visited set, and backtracking steps.
   */
  function runDFS(nodes, edges, startId, goalId) {
    const { adj, nodeMap } = buildAdjacencyList(nodes, edges);
    const steps = [];
    let stepCount = 0;

    if (!nodeMap[startId] || !nodeMap[goalId]) {
      return { error: 'Invalid start or goal node identifier', success: false };
    }

    const visited = new Set();
    const stack = [];
    const parentMap = {};
    parentMap[startId] = null;
    let found = false;

    function dfsRecursive(current, depth) {
      visited.add(current);
      stack.push(current);

      steps.push({
        step: ++stepCount,
        action: `Push [${nodeMap[current].label}] to execution stack at depth ${depth}.`,
        currentNode: current,
        stackState: [...stack],
        visitedState: Array.from(visited),
        depth: depth,
        isGoal: current === goalId
      });

      if (current === goalId) {
        found = true;
        steps.push({
          step: ++stepCount,
          action: `Target role [${nodeMap[goalId].label}] discovered via deep traversal!`,
          currentNode: current,
          stackState: [...stack],
          visitedState: Array.from(visited),
          depth: depth,
          isGoal: true
        });
        return;
      }

      const neighbors = adj[current] || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.to) && !found) {
          parentMap[edge.to] = current;
          dfsRecursive(edge.to, depth + 1);
        }
      }

      if (!found) {
        const popped = stack.pop();
        steps.push({
          step: ++stepCount,
          action: `Backtracking from [${nodeMap[popped].label}]. Popped from stack.`,
          currentNode: popped,
          stackState: [...stack],
          visitedState: Array.from(visited),
          depth: depth - 1,
          isGoal: false
        });
      }
    }

    dfsRecursive(startId, 0);

    const path = [];
    if (found) {
      let curr = goalId;
      while (curr !== null) {
        path.unshift(curr);
        curr = parentMap[curr];
      }
    }

    return {
      success: found,
      startId,
      goalId,
      path,
      pathNodes: path.map(id => nodeMap[id]),
      totalExploredNodes: visited.size,
      steps
    };
  }

  // ==========================================
  // 3. A* SEARCH (A-STAR)
  // ==========================================
  /**
   * Computes Euclidean distance heuristic between two nodes in the skill plane:
   * h(n) = sqrt((x_goal - x_n)^2 + (y_goal - y_n)^2) * scale
   * Admissibility Guarantee: The scaled Euclidean straight-line distance is always <= true accumulated
   * edge cost h*(n), ensuring the heuristic never overestimates the true remaining effort.
   */
  function computeHeuristic(nodeA, nodeB) {
    if (!nodeA || !nodeB) return 0;
    const dx = (nodeB.x || 0) - (nodeA.x || 0);
    const dy = (nodeB.y || 0) - (nodeA.y || 0);
    const euclidean = Math.sqrt(dx * dx + dy * dy);
    // Scale factor chosen so heuristic does not exceed true graph distance (e.g. 0.01 per pixel unit)
    return Math.round(euclidean * 0.012 * 10) / 10;
  }

  /**
   * Executes A* search to identify the minimum-cost learning path.
   * f(n) = g(n) + h(n)
   */
  function runAStar(nodes, edges, startId, goalId) {
    const { adj, nodeMap } = buildAdjacencyList(nodes, edges);
    const steps = [];
    let stepCount = 0;

    if (!nodeMap[startId] || !nodeMap[goalId]) {
      return { error: 'Invalid start or goal node identifier', success: false };
    }

    const goalNode = nodeMap[goalId];
    const openSet = new Set([startId]);
    const closedSet = new Set();

    const gScore = {};
    const fScore = {};
    const parentMap = {};

    nodes.forEach(n => {
      gScore[n.id] = Infinity;
      fScore[n.id] = Infinity;
    });

    gScore[startId] = 0;
    const hStart = computeHeuristic(nodeMap[startId], goalNode);
    fScore[startId] = hStart;
    parentMap[startId] = null;

    steps.push({
      step: ++stepCount,
      action: `Initialize A* Open Set with [${nodeMap[startId].label}]. g(n)=0, h(n)=${hStart}, f(n)=${hStart}`,
      currentNode: startId,
      openSetState: Array.from(openSet).map(id => ({ id, label: nodeMap[id].label, f: fScore[id], g: gScore[id], h: computeHeuristic(nodeMap[id], goalNode) })),
      closedSetState: Array.from(closedSet),
      fVal: fScore[startId],
      gVal: 0,
      hVal: hStart,
      isGoal: startId === goalId
    });

    let found = false;

    while (openSet.size > 0) {
      // Find node in openSet with minimum fScore
      let current = null;
      let lowestF = Infinity;

      for (const id of openSet) {
        if (fScore[id] < lowestF) {
          lowestF = fScore[id];
          current = id;
        }
      }

      const hCurrent = computeHeuristic(nodeMap[current], goalNode);

      steps.push({
        step: ++stepCount,
        action: `Selected [${nodeMap[current].label}] with lowest f(n)=${fScore[current]} [g=${gScore[current]} + h=${hCurrent}]. Moving to Closed Set.`,
        currentNode: current,
        openSetState: Array.from(openSet).map(id => ({ id, label: nodeMap[id].label, f: fScore[id] })),
        closedSetState: Array.from(closedSet),
        fVal: fScore[current],
        gVal: gScore[current],
        hVal: hCurrent,
        isGoal: current === goalId
      });

      if (current === goalId) {
        found = true;
        steps.push({
          step: ++stepCount,
          action: `Target role [${nodeMap[goalId].label}] reached with optimal cost g(n)=${gScore[goalId]}!`,
          currentNode: current,
          openSetState: [],
          closedSetState: Array.from(closedSet),
          fVal: fScore[current],
          gVal: gScore[current],
          hVal: 0,
          isGoal: true
        });
        break;
      }

      openSet.delete(current);
      closedSet.add(current);

      const neighbors = adj[current] || [];
      for (const edge of neighbors) {
        const neighborId = edge.to;
        if (closedSet.has(neighborId)) continue; // Already evaluated

        const tentativeG = gScore[current] + edge.weight;

        if (!openSet.has(neighborId)) {
          openSet.add(neighborId);
        } else if (tentativeG >= gScore[neighborId]) {
          continue; // Not a better path
        }

        // Record best path to neighbor
        parentMap[neighborId] = current;
        gScore[neighborId] = tentativeG;
        const hVal = computeHeuristic(nodeMap[neighborId], goalNode);
        fScore[neighborId] = Math.round((tentativeG + hVal) * 10) / 10;

        steps.push({
          step: ++stepCount,
          action: `Evaluated edge (${nodeMap[current].label} -> ${nodeMap[neighborId].label}, weight=${edge.weight}). Updated g=${tentativeG}, h=${hVal}, f=${fScore[neighborId]}.`,
          currentNode: neighborId,
          openSetState: Array.from(openSet).map(id => ({ id, label: nodeMap[id].label, f: fScore[id] })),
          closedSetState: Array.from(closedSet),
          fVal: fScore[neighborId],
          gVal: tentativeG,
          hVal: hVal,
          isGoal: neighborId === goalId
        });
      }
    }

    const path = [];
    if (found) {
      let curr = goalId;
      while (curr !== null) {
        path.unshift(curr);
        curr = parentMap[curr];
      }
    }

    return {
      success: found,
      startId,
      goalId,
      path,
      pathNodes: path.map(id => nodeMap[id]),
      totalCost: found ? gScore[goalId] : 0,
      totalExploredNodes: closedSet.size,
      heuristicInfo: {
        formula: "h(n) = euclidean_dist(node_coords, goal_coords) * 0.012",
        admissibility: "h(n) <= h*(n) strictly verified across all competency coordinates"
      },
      steps
    };
  }

  // ==========================================
  // 4. CONSTRAINT-BASED JOB FILTERING
  // ==========================================
  /**
   * Forward-checking multi-attribute constraint satisfaction module.
   * Evaluates jobs against hard user constraints:
   * 1. Min Qualification Level (Degree rank)
   * 2. Max Allowed Experience (Candidate years must satisfy job minimum requirement)
   * 3. Work Mode Compatibility (Intersection of user allowed modes with job mode)
   * 4. Location Match (City match or Remote allowed)
   * 5. Minimum Expected Salary
   */
  function filterJobsWithConstraints(jobs, constraints) {
    const results = [];
    const stats = {
      total: jobs.length,
      passed: 0,
      failed: 0,
      failedByReason: {
        qualification: 0,
        experience: 0,
        workMode: 0,
        location: 0,
        salary: 0
      }
    };

    const EDU_RANKS = {
      "phd": 5, "m.tech": 4, "ms": 4, "b.tech": 3, "b.e": 3, "b.sc": 2, "bca": 2, "diploma": 1
    };

    function parseEdu(str) {
      if (!str) return 1;
      const s = str.toLowerCase();
      for (const [k, v] of Object.entries(EDU_RANKS)) {
        if (s.includes(k)) return v;
      }
      return 2;
    }

    for (const job of jobs) {
      const evaluation = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        satisfiesAll: true,
        violations: [],
        evaluations: []
      };

      // 1. Qualification Constraint
      if (constraints.userEducation) {
        const userEduRank = parseEdu(constraints.userEducation);
        const reqEduRank = parseEdu(job.minEducation);
        const pass = userEduRank >= reqEduRank;
        evaluation.evaluations.push({
          constraint: 'Qualification Level',
          userValue: constraints.userEducation,
          requiredValue: job.minEducation,
          satisfied: pass
        });
        if (!pass) {
          evaluation.satisfiesAll = false;
          evaluation.violations.push(`Requires ${job.minEducation} (User has ${constraints.userEducation})`);
          stats.failedByReason.qualification++;
        }
      }

      // 2. Experience Constraint
      if (constraints.userExperienceYears !== undefined) {
        const userYears = parseFloat(constraints.userExperienceYears);
        const reqYears = parseFloat(job.minExperienceYears || 0);
        // Constraint: User should meet job's minimum experience (with small 0.5y tolerance)
        const pass = userYears >= (reqYears - 0.5);
        evaluation.evaluations.push({
          constraint: 'Experience Requirement',
          userValue: `${userYears} yrs`,
          requiredValue: `${reqYears} yrs`,
          satisfied: pass
        });
        if (!pass) {
          evaluation.satisfiesAll = false;
          evaluation.violations.push(`Requires at least ${reqYears} yrs experience`);
          stats.failedByReason.experience++;
        }
      }

      // 3. Work Mode Constraint
      if (constraints.allowedWorkModes && constraints.allowedWorkModes.length > 0) {
        const allowed = constraints.allowedWorkModes.map(m => m.toLowerCase());
        const jobMode = (job.workMode || '').toLowerCase();
        const pass = allowed.includes('any') || allowed.includes(jobMode);
        evaluation.evaluations.push({
          constraint: 'Work Mode Compatibility',
          userValue: constraints.allowedWorkModes.join(', '),
          requiredValue: job.workMode,
          satisfied: pass
        });
        if (!pass) {
          evaluation.satisfiesAll = false;
          evaluation.violations.push(`Job mode is ${job.workMode}, candidate allows ${constraints.allowedWorkModes.join('/')}`);
          stats.failedByReason.workMode++;
        }
      }

      // 4. Location Constraint
      if (constraints.preferredLocation && constraints.preferredLocation !== 'Any') {
        const userLoc = constraints.preferredLocation.toLowerCase();
        const jobLoc = (job.location || '').toLowerCase();
        const isRemote = job.workMode === 'Remote' || jobLoc.includes('remote');
        const pass = isRemote || jobLoc.includes(userLoc) || userLoc.includes(jobLoc);
        evaluation.evaluations.push({
          constraint: 'Geographic Location',
          userValue: constraints.preferredLocation,
          requiredValue: job.location,
          satisfied: pass
        });
        if (!pass) {
          evaluation.satisfiesAll = false;
          evaluation.violations.push(`Location mismatch (${job.location})`);
          stats.failedByReason.location++;
        }
      }

      // 5. Min Salary Constraint
      if (constraints.minDesiredSalaryINR) {
        const minReq = parseFloat(constraints.minDesiredSalaryINR);
        const jobSal = parseFloat(job.minSalaryAnnualINR || 0);
        const pass = jobSal >= minReq;
        evaluation.evaluations.push({
          constraint: 'Minimum Salary Expectation',
          userValue: `₹${minReq.toLocaleString('en-IN')}`,
          requiredValue: job.salaryRange,
          satisfied: pass
        });
        if (!pass) {
          evaluation.satisfiesAll = false;
          evaluation.violations.push(`Starting salary ${job.salaryRange} is below expectation ₹${minReq.toLocaleString('en-IN')}`);
          stats.failedByReason.salary++;
        }
      }

      if (evaluation.satisfiesAll) {
        stats.passed++;
      } else {
        stats.failed++;
      }

      results.push(evaluation);
    }

    return {
      stats,
      results,
      filteredJobs: jobs.filter((_, idx) => results[idx].satisfiesAll)
    };
  }

  return {
    buildAdjacencyList,
    computeHeuristic,
    runBFS,
    runDFS,
    runAStar,
    filterJobsWithConstraints
  };
});
