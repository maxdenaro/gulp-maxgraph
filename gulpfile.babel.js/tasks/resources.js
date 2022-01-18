import { dest, src } from 'gulp';
import paths from '../config/paths';

const resources = () => src(`${paths.resourcesFolder}/**`)
    .pipe(dest(paths.buildFolder));

export default resources;
