const hashId = (str: string): string => {
  str = String(str);
  let result: string[] = [];
  result = str.split("");
  let resultComplete: string = result
    .reduce(
      (prev: number, curr: string) =>
        ((prev << 5) - prev + curr.charCodeAt(0)) | 0,
      0,
    )
    .toString();
  resultComplete =
    resultComplete.length < 4
      ? resultComplete.padStart(4, "0")
      : resultComplete;
  resultComplete =
    resultComplete.length > 4
      ? resultComplete.substring(1, resultComplete.length)
      : resultComplete;
  return resultComplete;
};

export default {
  hashId,
};
