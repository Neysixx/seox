#!/usr/bin/env node
import { program } from './commands/program';

import './commands/init';
import './commands/configure';
import './commands/doctor';

program.parse(process.argv);

export default program;
