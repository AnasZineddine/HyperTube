import { Formik } from "formik";
import * as Yup from "yup";
import Error from "../utils/formError";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "Must have a character")
    .max(255, "Must be shorter than 255")
    .required("Must enter a firstname"),
  lastName: Yup.string()
    .min(1, "Must have a character")
    .max(255, "Must be shorter than 255")
    .required("Must enter a lastname"),
  userName: Yup.string()
    .min(1, "Must have a character")
    .max(255, "Must be shorter than 255")
    .required("Must enter a username"),
  email: Yup.string()
    .email("Must be a valid email adress")
    .max(255, "Must be shorter than 255")
    .required("Must enter an email"),
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
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <form>
          <div className="input-row">
            <label htmlFor="firstName">Firstname</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your Firstname"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
              className={touched.firstName && errors.name ? "has-error" : null}
            />
            <Error touched={touched.firstName} message={errors.firstName} />
          </div>

          <div className="input-row">
            <label htmlFor="lastName">Lastname</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your Lastname"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
              className={touched.lastName && errors.name ? "has-error" : null}
            />
            <Error touched={touched.lastName} message={errors.lastName} />
          </div>

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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              className={touched.email && errors.name ? "has-error" : null}
            />
            <Error touched={touched.email} message={errors.email} />
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
            <button type="submit">Register</button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SignUp;
