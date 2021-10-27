import { Formik } from "formik";
import * as Yup from "yup";
import Error from "../utils/formError";

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .min(1, "Must have a character")
    .max(255, "Must be shorter than 255")
    .required("Must enter a username"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(255, "Must be shorter than 255")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.") // TODO:make it stronger
    .required("Must enter a password"),
});

const SignUp = () => {
  return (
    <Formik
      initialValues={{
        userName: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        //TODO:handesumit and setSubmitting to false
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="Enter an username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.userName}
              className={touched.username && errors.name ? "has-error" : null}
            />
            <Error touched={touched.userName} message={errors.userName} />
          </div>

          <div className="input-row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter a password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              className={touched.password && errors.name ? "has-error" : null}
            />
            <Error touched={touched.password} message={errors.password} />
          </div>

          <div className="input-row">
            <button type="submit" disabled={isSubmitting}>
              Sign in
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SignUp;
