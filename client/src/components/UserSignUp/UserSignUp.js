import { useState } from "react";
import useUserAPI from '../../data/hooks/useUserAPI';
import FormWrapper from '../FormWrapper/FormWrapper';

export default () => {
  const { error, getData } = useUserAPI();
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    emailAddress: '',
    password: '',
    confirmedPassword: ''
  });

  document.title = "User Signup"

  const handleSubmit = () => {
    getData({ method: 'POST', path: '/users', body: userInfo });
  };

  return (
    <div className="form-centered">
      <h2>Sign Up</h2>
      <FormWrapper
        autoComplete="off"
        errors={error}
        formId="signin-form"
        submit={() => handleSubmit()}
        submitButtonText="Sign Up"
        elements={() => (
          <>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              type="text"
              value={userInfo.firstName}
              onChange={(e) => {
                setUserInfo({ ...userInfo, firstName: e.target.value });
              }} />
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              type="text"
              value={userInfo.lastName}
              onChange={(e) => {
                setUserInfo({ ...userInfo, lastName: e.target.value });
              }} />
            <label htmlFor="userName">User Name</label>
            <input
              id="userName"
              name="userName"
              placeholder="Enter your user name"
              type="text"
              value={userInfo.userName}
              onChange={(e) => {
                setUserInfo({ ...userInfo, userName: e.target.value });
              }} />
            <label htmlFor="emailAddress">Email Address</label>
            <input
              id="emailAddress"
              name="emailAddress"
              placeholder="Enter your email address"
              type="email"
              value={userInfo.emailAddress}
              onChange={(e) => {
                setUserInfo({ ...userInfo, emailAddress: e.target.value });
              }} />
            <label htmlFor="password">Password</label>
            <input
              autoComplete="off"
              id="password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={userInfo.password}
              onChange={(e) => {
                setUserInfo({ ...userInfo, password: e.target.value });
              }} />
            <label htmlFor="passwordConfirmation">Confirm Password</label>
            <input
              autoComplete="off"
              id="passwordConfirmation"
              name="passwordConfirmation"
              placeholder="Confirm your password"
              type="password"
              value={userInfo.confirmedPassword}
              onChange={(e) => {
                setUserInfo({ ...userInfo, confirmedPassword: e.target.value });
              }} />
          </>
        )} />
      <p>Already have a user account? Click here to <a href="/signin">sign in</a>!</p>
    </div>
  )
}
