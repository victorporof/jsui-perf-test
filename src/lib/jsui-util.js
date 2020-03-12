export const oncePerAnimationFrame = fn => {
  let pending;

  return (...args) => {
    if (!pending) {
      pending = requestAnimationFrame(() => (pending = null));
      fn(...args);
    }
  };
};

export const lockstep = (iterA, iterB, cb) => {
  iterA = iterA ?? [];
  iterB = iterB ?? [];

  for (let i = 0; i < Math.max(iterA.length, iterB.length); i++) {
    cb(iterA[i], iterB[i]);
  }
};

export const lockstepObj = (objA, objB, cb) => {
  const iterA = Object.entries(objA ?? {});
  const iterB = Object.entries(objB ?? {});

  for (let i = 0; i < Math.max(iterA.length, iterB.length); i++) {
    cb(iterA[i], iterB[i]);
  }
};
