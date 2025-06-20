
function Validation(formData, touched) {
  const error = { confirmPassword: false, password: false, GSTIN: false, email: false}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  error.email = (!emailRegex.test(formData.email)) && touched.email
  error.GSTIN = (formData.GSTIN.length !== 15 ? true : false) && touched.GSTIN
  error.password = (formData.password.length < 6 ? true : false) && touched.password
  error.confirmPassword = (formData.password !== formData.confirmPassword ? true : false) && touched.confirmPassword
  const empty  = !formData.name || !formData.email || !formData.GSTIN || !formData.password || !formData.confirmPassword
  const inputVerified = !error.email && !error.GSTIN && !error.password && !error.confirmPassword;
  const inputError = error;
  return {inputError, empty, inputVerified};
}

export default Validation;
