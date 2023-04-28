export const leftRotateArray = (arr: any[], d: number) => {
  for (let i = 0; i < d; i++) {
    leftRotateArrayByOne(arr);
  }
};

export const leftRotateArrayByOne = (arr: any[]) => {
  const temp = arr[0];
  for (let i = 0; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
  arr[arr.length - 1] = temp;
};
