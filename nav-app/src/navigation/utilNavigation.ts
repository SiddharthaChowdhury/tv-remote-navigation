const utilNavigation = {
  vsStringToNumberArr: (vsIdString: string) => {
    const [x, y] = vsIdString.split(",");
    return [parseInt(x), parseInt(y)];
  },
};

export default utilNavigation;
