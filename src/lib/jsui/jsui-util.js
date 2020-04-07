export const oncePerAnimationFrame = (fn) => {
  const pending = [];
  let waiting = false;

  return (...args) => {
    const next = () => {
      if (waiting) {
        return;
      }
      if (!pending.length) {
        return;
      }
      requestAnimationFrame(() => {
        waiting = false;
        next();
      });
      const args = pending.shift();
      fn(...args);
    };

    pending.push(args);
    next();
  };
};

export const justOnceUntilNextFrame = (fn) => {
  let pending;

  return (...args) => {
    if (!pending) {
      pending = requestAnimationFrame(() => (pending = null));
      fn(...args);
    }
  };
};

export const justOnceUntilIdle = (fn, options) => {
  let pending;

  return (...args) => {
    if (!pending) {
      pending = requestIdleCallback(() => (pending = null), options);
      fn(...args);
    }
  };
};

export const justOnceDuringNextFrame = (fn) => {
  let pending;

  return (...args) => {
    if (!pending) {
      pending = requestAnimationFrame(() => {
        pending = null;
        fn(...args);
      });
    }
  };
};

export const justOnceWhenIdle = (fn, options) => {
  let pending;

  return (...args) => {
    if (!pending) {
      pending = requestIdleCallback(() => {
        pending = null;
        fn(...args);
      }, options);
    }
  };
};

export const lockstepArr = (iterA, iterB, cb) => {
  iterA = iterA ?? [];
  iterB = iterB ?? [];

  for (let i = 0; i < iterA.length; i++) {
    cb(iterA[i], iterB[i]);
  }
  for (let i = iterA.length; i < iterB.length; i++) {
    cb(undefined, iterB[i]);
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
