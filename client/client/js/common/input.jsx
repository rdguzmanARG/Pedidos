import React from "react";

const Input = ({ name, label, autoFocus, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {autoFocus && (
        <input
          {...rest}
          autoFocus
          name={name}
          id={name}
          className="form-control"
        />
      )}
      {!autoFocus && (
        <input {...rest} name={name} id={name} className="form-control" />
      )}

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
