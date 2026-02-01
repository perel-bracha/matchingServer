// const resetDB = require("./resetDB");
// const createDB = require("./createDB");
// const createTables = require("./createTables");
// const initialization = require("./initialization");
// async function startup() {
//   console.log(`startup`);
//   await resetDB();
//   console.log(`resetDB`);
//   await createDB();
//   console.log(`createDB`);
//   await createTables();
//   console.log(`createTables`);
//   await initialization();
//   console.log(`initialization`);
// }
// startup();
function TreeNode(data) {
  this.data = data;
  this.left = null;
  this.right = null;
}

function f(A) {
  let index;
  // let matrix = new Array(A + 1).fill([]).map(() => new Array(A + 1).fill([]));
  let matrix = new Array(A + 1).fill(null).map(() => new Array(A + 1).fill(null).map(() => []));

  for (let i = 0; i < A; i++)
    for (let j = 1; j <= A - i; j++) {
      index = 0;
      for (let k = j; k <= j + i; k++) {
        console.log(k, j, i);

        if (i == 0) matrix[j][j] = [new TreeNode(k)];
        if (k == j + i) {
          for (let y = 0; y < matrix[j][k - 1].length; y++) {
            console.log(`in just left tree k=${k} index=${index}`)
            matrix[j][j + i][index] = new TreeNode(k);
            matrix[j][j + i][index++].left = matrix[j][k - 1][y];
          }
        } else {
          if (k == j) {
            for (let x = 0; x < matrix[k + 1][j + i].length; x++) {
              ///let rightTree of matrix[k + 1][j + i]
              console.log(`in just right tree k=${k} index=${index}`)
              matrix[j][j + i][index] = new TreeNode(k);
              matrix[j][j + i][index++].right = matrix[k + 1][j + i][x];
            }
          }

          for (let y = 0; y < matrix[j][k - 1].length; y++) {
            //let leftTree of matrix[j][k - 1]
            console.log(k, j, i);
            // console.log(matrix[k + 1][j + i]);

            for (let x = 0; x < matrix[k + 1][j + i].length; x++) {
              matrix[j][j + i][index] = new TreeNode(k);
              matrix[j][j + i][index].left = matrix[j][k - 1][y];
              matrix[j][j + i][index++].right = matrix[k + 1][j + i][x];
            }
          }
        }
      }
      console.log(matrix[j][j + i]);
    }
  return matrix[1][A];
}
const result = f(3);
console.log(result);
