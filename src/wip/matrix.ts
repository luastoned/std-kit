/**
 * Transposes a matrix and reverses the rows.
 *
 * @param matrix - The matrix to transpose.
 * @returns The transposed matrix.
 */
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

/**
 * Flips a matrix by swapping rows and columns.
 *
 * @param matrix - The matrix to flip.
 * @returns The flipped matrix.
 */
export const flipMatrix = (matrix: any[][]) => matrix[0].map((column, index) => matrix.map((row) => row[index]));

/**
 * Rotates a matrix clockwise.
 *
 * @param matrix - The matrix to rotate.
 * @returns The rotated matrix.
 */
export const rotateMatrix = compose(flipMatrix, reverse);

/**
 * Flips a matrix counterclockwise.
 *
 * @param matrix - The matrix to flip.
 * @returns The flipped matrix.
 */
export const flipMatrixCounterClockwise = compose(reverse, rotateMatrix);

/**
 * Rotates a matrix counterclockwise.
 *
 * @param matrix - The matrix to rotate.
 * @returns The rotated matrix.
 */
export const rotateMatrixCounterClockwise = compose(reverse, flipMatrix);
