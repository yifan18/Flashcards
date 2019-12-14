export function api(path: string, method?: "get" | "post", body?: any) {
  path = "/api/" + path;
  return new Promise((resolve, reject) => {
    if (method === "get") {
      resolve(
        fetch(
          path +
            "?" +
            Object.keys(body)
              .map(k => `${k}=${body[k]}`)
              .join("&"),
          {
            method
          }
        )
      );
      return;
    }
    resolve(
      fetch(path, {
        method,
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json"
        }
      })
    );
  })
    .then((res: Response) => res.json())
    .then(({ status, data, message }) => {
      if ("ok" === status) return data;
      throw new Error(message);
    })
    .catch(err => console.error(err));
}
