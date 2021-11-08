/**
 * Node is used to store values in a Queue
 */
class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class Queue {
  constructor() {
    this.first = null;
    this.last = null;
  }

  enqueue(value) {
    const newNode = new Node(value);

    if (this.first) {
      this.last.next = newNode;
    } else {
      // Set the node of the queue's next to be the new node
      this.first = newNode;
    }

    //make the new node the last item on the queue
    this.last = newNode;
  }

  dequeue() {
    if (this.first) {
      const dequeued = this.first;
      this.first = dequeued.next;

      if (dequeued === this.last) {
        this.last = null;
      }

      return dequeued.value;
    }
  }

  peek() {
    return this.first.value;
  }

  isEmpty() {
    return this.first === null;
  }
}

class ParkingLot {
  constructor(capacity, rate) {
    this.spaces = new Array(capacity).fill("vacant");
    this.rate = rate;
    this.revenue = 0;
    this.queue = new Queue();
  }

  /**
   * Returns the number of vacant parking spaces
   * @returns {Number}
   *  the total number of spaces where the value is "vacant".
   */

  get vacantSpaces() {
    return this.spaces.reduce(
      (sum, space, index) => sum + (space === "vacant" ? 1 : 0),
      0
    );
  }

  /**
   * As cars enter the parking lot, the license plate number is entered and the car is parked in the first vacant space.
   * If the lot is full, the car is added to the queue to be parked when a spot is available.
   *
   * @param licensePlateNumber
   *  the license plate number of the car entering
   */
  enter(licensePlateNumber) {
    let full = true;
    for (let i = 0; i < this.spaces.length; i++) {
      if (this.spaces[i] === "vacant") {
        this.spaces[i] = licensePlateNumber;
        full = false;
        break;
      }
    }
    if (full === true) {
      this.queue.enqueue(licensePlateNumber);
    }
  }

  /**
   * As a car leaves the parking lot, or the queue, the leave method is called with the license plate number of the car leaving.
   * @param licensePlateNumber
   *    *  the license plate number of the car leaving.
   */
  leave(licensePlateNumber) {
    //If the car is in the queue and leaves, dequeue it
    let node = this.queue.first;
    if (node !== null) {
      if (node.value === licensePlateNumber) this.queue.dequeue();

      //Declare prevNode to be used in loop
      let prevNode = {};
      prevNode.value = null;
      console.log("queue", this.queue);
      while (node) {
        console.log("node at beginning of loop", node);
        console.log("prevNode at beginning of loop", prevNode);
        console.log("license plate at beginning", licensePlateNumber);
        //If the previous node is the licensePlate value then set
        if (node.value === licensePlateNumber) {
          console.log("license plate found");
          console.log("prev node", prevNode, "current node", node);
          prevNode.next = node.next;

          console.log("prev node 2", prevNode);

          break;
        }
        //Advance prevNode and Node
        prevNode = node;
        node = node.next;
      }
    }

    //If the car is parked, take it out and put the first in queue in that spot
    for (let i = 0; i < this.spaces.length; i++) {
      console.log("run loop");
      if (this.spaces[i] === licensePlateNumber) {
        this.revenue = this.revenue + this.rate;
        console.log("license plate found:", licensePlateNumber);
        console.log("here is revenue", this.revenue);
        if (this.queue.isEmpty() === false) {
          this.spaces[i] = this.queue.dequeue();
        } else {
          this.spaces[i] === "vacant";
        }
        break;
      }
    }
  }

  /**
   * Lists each space in the parking lot along with the license plate number of the car parked there, or
   * "vacant" as the license plate if the spot is vacant.
   * @returns {{licensePlateNumber: string, space: Number}[]}
   */
  get occupants() {
    return this.spaces.map((licensePlateNumber, index) => ({
      space: index + 1,
      licensePlateNumber,
    }));
  }

  /**
   * The total cumulative revenue for the parking lot. The parking rate is paid when the car leaves, it does not matter how long the car stays in the spot.
   * @returns {number}
   *  the total revenue for the parking lot.
   */
  get totalRevenue() {
    return this.revenue;
  }
}

const parkingLot = new ParkingLot(10, 9);

parkingLot.enter("YGN-9484");
parkingLot.enter("CNC-3349");
parkingLot.enter("EBN-9309");

console.log(parkingLot);

parkingLot.leave("CNC-3349");

console.log(parkingLot.totalRevenue);
