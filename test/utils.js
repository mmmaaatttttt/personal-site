export function mathRandom(nums = [0.5]) {
  let idx = -1;
  global.Math.random = jest.fn(() => {
    idx++;
    return nums[idx % nums.length];
  });
}
