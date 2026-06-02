import Moment from "moment";
import { extendMoment } from "moment-range";

// Extend moment with moment-range exactly once from a single, extensible
// module instance. Importing moment via `import * as Moment` yields a frozen
// ESM namespace object that extendMoment cannot mutate ("Cannot add property
// range, object is not extensible"), and calling extendMoment from multiple
// modules on the same singleton risks a redefine error. Centralising it here
// avoids both problems.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moment = extendMoment(Moment as any);

export default moment;
