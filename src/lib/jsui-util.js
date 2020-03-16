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
  // eslint-disable-next-line guard-for-in
  for (const key in objA) {
    cb(key, objA[key], objB[key]);
  }
  for (const key in objB) {
    if (!(key in objA)) {
      cb(key, undefined, objB[key]);
    }
  }
};
