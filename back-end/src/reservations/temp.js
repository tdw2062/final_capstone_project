function splitSum2(tour) {
  let smallest = Number.MAX_VALUE;
  for (let i = 0; i < tour.length; i++) {
    let sliced = tour.slice(0, i + 1);
    console.log("sliced", sliced);
    let preSum = sliced.reduce((a, b) => a + b, 0);

    let sliced2 = tour.slice(i + 1);
    console.log("sliced2", sliced2);
    let postSum = sliced2.reduce((a, b) => a + b, 0);
    let diff = Math.abs(preSum - postSum);
    if (diff < smallest) smallest = diff;
  }
  return smallest;
}

console.log(splitSum2([4, 12, 17, 8, 13, 24, 9]));
