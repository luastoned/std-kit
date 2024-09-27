export const transpose = (matrix: any[][]) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < row; col++) {
      [matrix[row][col], matrix[col][row]] = [matrix[col][row], matrix[row][col]];
    }
  }

  return matrix[0].map((col, colIdx) => matrix.map((row) => row[colIdx]).reverse());
};

const compose = (a: <T>(matrix: T[][]) => T[][], b: <T>(matrix: T[][]) => T[][]) => (matrix: any[][]) => a(b(matrix));

export const flipMatrix = (matrix: any[][]) => matrix[0].map((column, index) => matrix.map((row) => row[index]));
export const rotateMatrix = compose(flipMatrix, reverse);
export const flipMatrixCounterClockwise = compose(reverse, rotateMatrix);
export const rotateMatrixCounterClockwise = compose(reverse, flipMatrix);
