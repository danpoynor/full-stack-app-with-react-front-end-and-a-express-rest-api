import './FormErrorsDisplay.css'

export default ({ formId, errors }) => {
  const form = document.getElementById(formId);

  if (errors?.length === 0) {
    // If no errors, remove the validation errors panel if it exists
    document.querySelector(`${formId} .validation-errors`) && form.removeChild(form.querySelector(`${formId} .validation-errors`));
    return;
  }

  if (errors?.length === 1 && errors[0] === undefined) {
    // If there's only one error and it's undefined, remove the validation
    // errors panel if it exists. This occurs when signin form is submitted
    // and server responds with a 401 error.
    // FIXME: This feels like a hack that could be resolved in
    // UserSignIn.js perhaps before this component is rendered.
    document.querySelector(`${formId} .validation-errors`) && form.removeChild(form.querySelector(`${formId} .validation-errors`));
    return;
  }

  // Re-word some messages to be more user-friendly
  if (errors?.includes('Title is required.')) {
    errors.splice(errors.indexOf('Title is required.'), 1, 'Please provide a value for "Title"');
  }

  if (errors?.includes('Description is required.')) {
    errors.splice(errors.indexOf('Title is required.'), 1, 'Please provide a value for "Description"');
  }

  if (errors?.length > 0) {
    return (
      <div className="validation-errors">
        <h3>Validation Errors</h3>
        <ul>
          {
            errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))
          }
        </ul>
      </div >
    )
  }

  return null;
}
