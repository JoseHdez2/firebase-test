// https://twitter.com/JoshWComeau/status/1221608059035963392
function usePersistedState(name, defaultValue) {
  const [value, setValue] = React.useState(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    const persistedValue = window.localStorage.getItem(name);

    return persistedValue !== null ? JSON.parse(persistedValue) : defaultValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(name, JSON.stringify(value));
  }, [name, value]);

  return [value, setValue];
}
