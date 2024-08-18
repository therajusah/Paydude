
import PropTypes from 'prop-types';

export function InputBox({ label, placeholder, onChange, type }) {
  return (
    <div>
      <div className="py-2 text-sm font-medium text-left">{label}</div>
      <input
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded border-slate-200"
        type={type}
      />
    </div>
  );
}


InputBox.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};
