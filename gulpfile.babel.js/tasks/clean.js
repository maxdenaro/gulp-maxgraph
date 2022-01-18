import del from 'del';
import paths from '../config/paths';

const clean = () => del([paths.buildFolder]);

export default clean;
