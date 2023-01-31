module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(tsx?)$": "ts-jest",
    "^.+\\.(jsx?)$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
};
