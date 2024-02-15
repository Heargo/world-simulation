import { Burg } from './world';

export interface Node {
  id: number;
  x: number;
  y: number;
  relatedBurg?: Burg;
}

export interface Edge {
  id: number;
  length: number;
  nodes: number[];
}

export interface Path {
  steps: (Burg | number)[];
  length: number;
}

export class TransportationGrid {
  static NODE_ID = 0;
  static EDGE_ID = 0;
  constructor(
    private nodes: Node[] = [],
    private edges: Edge[] = [],
    private precision: number = 0.5
  ) {
    this.edges = edges;
    this.nodes = nodes;
  }

  addNode(x: number, y: number, relatedBurg?: Burg) {
    // add a new node to the grid if it doesn't already close to another node (within acceptable distance)
    let node = this.nodes.find(node => {
      return (
        Math.abs(node.x - x) < this.precision &&
        Math.abs(node.y - y) < this.precision
      );
    });
    if (!node) {
      node = { id: TransportationGrid.NODE_ID++, x, y, relatedBurg };
      this.nodes.push(node);
    }
    return node;
  }

  getNodes() {
    return this.nodes;
  }

  getNode(id: number) {
    return this.nodes.find(node => node.id == id);
  }

  addEdge(node1: number, node2: number, length: number) {
    // add a new edge to the grid if it doesn't already exist
    let id = TransportationGrid.EDGE_ID++;
    let exists = this.edges.some(
      edge => edge.nodes.includes(node1) && edge.nodes.includes(node2)
    );
    if (!exists) {
      this.edges.push({ id, length, nodes: [node1, node2] });
    }
  }

  addEdges(ed: Edge[]) {
    ed.forEach(e => {
      let exists = this.edges.some(
        edge =>
          edge.nodes.includes(e.nodes[0]) && edge.nodes.includes(e.nodes[1])
      );
      if (!exists) {
        this.edges.push(e);
      }
    });
  }

  showEdges(edges: Edge[]) {
    edges.forEach(edge => {
      let start = this.getNode(edge.nodes[0]);
      let end = this.getNode(edge.nodes[1]);
      console.log(
        `${start?.relatedBurg ? start?.relatedBurg?.name : start?.id} --[ ${
          edge.length
        } ]--> ${end?.relatedBurg ? end?.relatedBurg?.name : end?.id}`
      );
    });
  }

  getNodeClosestTo(x: number, y: number): Node {
    // find the node closest to the given coordinates
    let closest: Node | null = null;
    let minDistance = Infinity;
    this.nodes.forEach(node => {
      let distance = Math.sqrt(
        Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
      );
      if (distance < minDistance) {
        closest = node;
        minDistance = distance;
      }
    });
    return closest!;
  }

  findClosestNode(distances: { [key: number]: number }, visited: number[]) {
    // find the closest node to the start node
    let closest = null;
    let minDistance = Infinity;
    for (let node in distances) {
      if (distances[node] < minDistance && !visited.includes(parseInt(node))) {
        closest = parseInt(node);
        minDistance = distances[node];
      }
    }
    return closest;
  }

  getMatriceAdjacencePondere() {
    let matriceAdjacence: any[][] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      matriceAdjacence.push(new Array(this.nodes.length).fill(0));
    }

    this.edges.forEach(edge => {
      matriceAdjacence[edge.nodes[0]][edge.nodes[1]] = edge.length;
      matriceAdjacence[edge.nodes[1]][edge.nodes[0]] = edge.length;
    });

    return matriceAdjacence;
  }

  shortestPath(start: number, end: number) {
    let matriceAdjacence = this.getMatriceAdjacencePondere();
    matriceAdjacence.forEach(row => {
      row.forEach((value, index) => {
        if (value == 0) {
          row[index] = Infinity;
        }
      });
    });

    let floydWarshall =
      this.FloydWarshallWithPathReconstruction(matriceAdjacence);
    let path = floydWarshall.reconstructPath(start, end);
    // convert to Path object
    let pathObj: Path = { steps: [], length: floydWarshall.dist[start][end] };

    path.forEach(id => {
      let node = this.nodes.find(node => node.id == id);
      if (node?.relatedBurg) {
        pathObj.steps.push(node.relatedBurg);
      } else {
        pathObj.steps.push(id);
      }
    });

    return pathObj;
  }

  FloydWarshallWithPathReconstruction(adjacencyMatrix: number[][]) {
    const numVertices = adjacencyMatrix.length;

    // Initialize distance and predecessor matrices
    const dist = Array.from({ length: numVertices }, () =>
      Array.from({ length: numVertices }, () => Infinity)
    );
    const prev: number[][] = Array.from({ length: numVertices }, () =>
      Array.from({ length: numVertices }, () => -1)
    );

    // Fill in edge weights and corresponding predecessors
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (adjacencyMatrix[i][j] !== undefined) {
          dist[i][j] = adjacencyMatrix[i][j];
          prev[i][j] = i; // Set predecessor to itself initially
        }
      }
    }

    // Set diagonal distances to 0 and predecessors to the vertex itself
    for (let i = 0; i < numVertices; i++) {
      dist[i][i] = 0;
      prev[i][i] = i;
    }

    // Floyd-Warshall dynamic programming
    for (let k = 0; k < numVertices; k++) {
      for (let i = 0; i < numVertices; i++) {
        for (let j = 0; j < numVertices; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            prev[i][j] = prev[k][j]; // Update predecessor based on new path
          }
        }
      }
    }

    // Check for negative cycles
    for (let k = 0; k < numVertices; k++) {
      for (let i = 0; i < numVertices; i++) {
        if (dist[i][i] < 0) {
          throw new Error('Graph contains a negative cycle!');
        }
      }
    }

    // Function to reconstruct a path between two vertices
    function reconstructPath(source: number, destination: number) {
      const path = [];
      if (source === destination) {
        path.push(source);
        return path;
      } else if (prev[source][destination] === null) {
        throw new Error(
          'No path exists between ' + source + ' and ' + destination
        );
      }

      let intermediate: number = destination;
      while (intermediate !== source) {
        path.push(intermediate);
        intermediate = prev[source][intermediate]!;
      }
      path.push(source);
      return path.reverse(); // Reverse to get source at the beginning
    }

    return { dist, prev, reconstructPath };
  }
}
