import { Link, useLocation } from 'react-router-dom';
import FormErrorsDisplay from '../FormErrorsDisplay/FormErrorsDisplay';
import './FormWrapper.css';

/**
 * FormWrapper component
 *
 * @param {object} props
 * @param {string} props.autoComplete - autoComplete "on|off" to be passed to form.
 * @param {function} props.elements - Function which returns input fields to be used.
 * @param {object} props.errors - Validation errors to be displayed, received from API.
 * @param {string} props.formId - ID of the form.
 * @param {function} props.submit - Function to be called when form is submitted.
 * @param {string} props.submitButtonText - Text to be displayed in submit button.
 *
 * @description Uses 'render prop' technique to render forms consistently across the app.
 *
 * @returns {JSX} JSX representation of the FormWrapper component
 *
 * This component enables consistent behavior across forms for features such as:
 * - Form styling
 * - Submit button `preventsDefault()` behavior
 * - Cancel button behavior: Redirects user to the previous page in the browser history.
 * - <ErrorDisplay> integration: Used to render any validation errors sent from the API.
 * - noValidate attribute
 *
 * @ref https://reactjs.org/docs/render-props.html
 */

export default (props) => {
  const {
    autoComplete,
    elements,
    errors,
    formId,
    submit,
    submitButtonText,
  } = props;
  const location = useLocation();
  let prevPath = location.state?.prevPath || '/';

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  return (
    <div>
      <form autoComplete={autoComplete} id={formId} onSubmit={handleSubmit} noValidate>
        <FormErrorsDisplay formId={formId} errors={errors} />
        {elements()}
        <button
          className="btn btn-primary"
          type="submit">
          {submitButtonText}
        </button>
        <Link
          className="btn btn-secondary"
          to={prevPath}
          state={{ alertTheme: null, alertMessage: null }}>
          Cancel
        </Link>
      </form>
    </div>
  );
}
