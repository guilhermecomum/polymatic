import join from "lodash/fp/join";
import reject from "lodash/fp/reject";
import isBoolean from "lodash/fp/isBoolean";
import isNil from "lodash/fp/isNil";
import flatten from "lodash/fp/flatten";
import compose from "lodash/fp/compose";

const cx = (...args: unknown[]) =>
  compose(join(" "), reject(isBoolean), reject(isNil), flatten)(args);

export { cx };
