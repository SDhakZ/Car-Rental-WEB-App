import React, { useEffect, useState } from "react";
import { Field, ErrorMessage } from "formik";
import FieldCSS from "./Field.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

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
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              );
            })
          : null}
      </Field>
    </div>
  );
};

export const ImageField = (props) => {
  const {
    imageName,
    onClickHandler,
    IMGvalues,
    fieldLabel,
    fieldName,
    setImageUrlShown,
    imageUrlShown,
    setFieldValue,
  } = props;
  useEffect(() => {
    if (props.imgUrl) {
      setImageUrlShown(true);
    } else {
      setImageUrlShown(false);
    }
  }, [props.imgUrl, setImageUrlShown]);
  return (
    <div className={FieldCSS["F-main-uploadContainer"]}>
      <label htmlFor="CarImage" className={FieldCSS["F-label"]}>
        {fieldLabel}
      </label>
      <div className={FieldCSS["F-btnimg-container"]}>
        <label htmlFor="CarImage" className={FieldCSS["F-uploadImage"]}>
          {props.imgUrl ? "Change Image" : "Upload Image"}
        </label>
        <input
          accept="image/*"
          type="file"
          onChange={(event) => {
            setFieldValue("CarImage", event.target.files[0]);
            setImageUrlShown(false);
          }}
          id={fieldName}
          name={fieldName}
          className={FieldCSS["F-selectFile"]}
        />
        <ErrorMessage
          name={props.fieldName}
          component="p"
          className={FieldCSS["F-validation"]}
        />
        {IMGvalues && (
          <div className={FieldCSS["F-file-group"]}>
            <div className={FieldCSS["F-file-name"]}>
              <button
                title="Remove picture"
                onClick={onClickHandler}
                className={FieldCSS["F-remove-file"]}
              >
                <i className={`${FieldCSS.fileCross} fa fa-close`}></i>
              </button>
              <label className={FieldCSS["F-file-name"]}>{imageName}</label>
            </div>
          </div>
        )}
        {imageUrlShown === true ? (
          <img
            className={FieldCSS["IM-image"]}
            src={props.imgUrl}
            alt="Preview"
          />
        ) : null}
      </div>
    </div>
  );
};
export const PasswordFields = (props) => {
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const [passwordVisible, setPasswordVisible] = useState(false);
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
      <div className={FieldCSS["F-field-password"]}>
        <Field
          placeholder={props.fieldPlaceholder}
          className={
            props.fieldAs ? FieldCSS[`F-${props.fieldAs}`] : FieldCSS["F-field"]
          }
          type={passwordVisible ? "text" : "password"}
          id={props.fieldName}
          name={props.fieldName}
          required
          as={props.fieldAs ? props.fieldAs : "input"}
          min={props.min !== undefined ? props.min : undefined}
          onKeyPress={props.onKeyPress}
        ></Field>
        <span
          className={FieldCSS["PF-password-toggle"]}
          onClick={togglePasswordVisibility}
        >
          <i
            className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}
          ></i>
        </span>
      </div>
    </div>
  );
};

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

export const DatePickerNoMods = (props) => {
  const { fieldLabel, fieldName, setFieldValue, values, fieldPlaceholder } =
    props;

  const selectedDate = values[fieldName]
    ? new Date(values[fieldName])
    : undefined;
  const currentDate = new Date();
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
          maxDate={currentDate}
        />
      </div>
    </div>
  );
};

export const SelectField = (props) => {
  const {
    carData,
    setFieldValue,
    handleSearch,
    selectedValue,
    setSelectedValue,
  } = props;
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

      <Select
        name={props.fieldName}
        value={selectedValue}
        options={carData}
        onInputChange={(inputValue) => handleSearch(inputValue)}
        onChange={(selectedOption) => {
          setFieldValue("carId", selectedOption.value);
          setSelectedValue(selectedOption);
        }}
        isLoading={carData.length < 0}
      />
    </div>
  );
};
