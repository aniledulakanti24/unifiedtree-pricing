import { ICONS } from '../config.js';
import Icon from './Icon.jsx';

export default function ModuleIcon({ id, icon, color }) {
  const [name, c] = id ? ICONS[id] : [icon, color];
  return (
    <span className="ico" style={c ? { '--c': c } : undefined} aria-hidden="true">
      <Icon name={name} size={20} />
    </span>
  );
}
