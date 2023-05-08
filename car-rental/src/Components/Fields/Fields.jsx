import React from "react";
import { Field, ErrorMessage } from "formik";
import FieldCSS from "./Field.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Fields = (props) => {
  const option = props.option;
  return (
    <div className={FieldCSS["F-field-container"]}>
      <div className={FieldCSS["F-label-error"]}>
        <label htmlFor={props.fieldName} className={FieldCSS["F-label"]}>
          {props.fieldLabel}
        </label>
        <ErrorMessage
          name={props.fieldName}
          component="p"
          className={FieldCSS["F-validation"]}
        />
      </div>
      <Field
        placeholder={props.fieldPlaceholder}
        className={
          props.fieldAs ? FieldCSS[`F-${props.fieldAs}`] : FieldCSS["F-field"]
        }
        type={props.fieldType}
        id={props.fieldName}
        name={props.fieldName}
        required
        as={props.fieldAs ? props.fieldAs : "input"}
        min={props.min !== undefined ? props.min : undefined}
        onKeyPress={props.onKeyPress}
      >
        {props.option
          ? option.map((option) => {
            return (
              <option key={option.value} valu={option.value}>
                {option.key}
              </option>
            );
          })
          : null}
      </Field>
    </div>
  )
}

export const DatePickerField = (props) => {
  const { fieldLabel, fieldName, setFieldValue, values, fieldPlaceholder } =
    props;

  const selectedDate = values[fieldName]
    ? new Date(values[fieldName])
    : undefined;
  const currentDate = new Date();
  let minDate;
  if (fieldName === "startDate") {
    minDate = currentDate;
  } else {
    minDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  return (
    <div className={FieldCSS["F-field-container"]}>
      <div className={FieldCSS["F-label-error"]}>
        <label htmlFor={fieldName} className={FieldCSS["F-label"]}>
          {fieldLabel}
        </label>
        <ErrorMessage
          name={fieldName}
          component="p"
          className={FieldCSS["F-validation"]}
        />
      </div>
      <div className={FieldCSS["F-field-password"]}>
        <DatePicker
          placeholderText={fieldPlaceholder}
          className="form-control"
          name={fieldName}
          selected={selectedDate}
          onChange={(date) => setFieldValue(fieldName, date)}
          minDate={currentDate}
        />
      </div>
    </div>
  );
};
