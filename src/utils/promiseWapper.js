const promiseWrapper = (promise) =>
  new Promise((resolve) => {
    promise
      .then((data) => resolve({ data }))
      .catch((error) => resolve({ error }));
  });

module.exports = { promiseWrapper };
