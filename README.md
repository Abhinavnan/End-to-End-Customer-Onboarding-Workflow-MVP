## **End-to-End Customer Onboarding Workflow MVP**

### **Background**

Every customs broker (user) using our product files customs declarations on behalf of exporters and importers. Brokers must onboard their new customers before filing declarations on their behalf. To do this, brokers must first register, verify their identity, and access their dashboard to onboard their customers (exporters/importers). This is the core onboarding flow. This workflow powers the client onboarding engine for customs broker users.

---

## **Frontend**

* **Tech Stack:**

  * **UI Framework**: [MUI](https://mui.com/) (Material-UI) for component styling.
  * **State Management**: Redux with persistent storage for storing and declaring global variables such as token, user email, and name.
  * **HTTP Client**: Axios for API calls to the backend.
  * **Custom Hooks**:

    * `useHttp`: A custom hook to manage all HTTP requests.
    * `useAuth`: A custom hook to set a timeout for logout when the token expires.

---

### **Main Components**

* **Home Page**

  * Displays dummy shipment data using the MUI DataGrid component.
  * Header includes a title and a profile icon. Clicking the profile icon navigates to the profile page.

* **Profile Page**

  * Shows user details: Name, Email, and GSTIN.
  * Includes buttons for:

    * Logout: Clears all Redux-stored details.
    * Change Password: Navigates to the change password page.
    * Delete Account: Opens the delete account confirmation popup.

* **Sign-in Page**

  * Inputs: Email and Password.
  * Validates input locally before making the backend request.
  * On success:

    * Saves response data (email, GSTIN, token) in Redux.

* **Sign-up Page**

  * Inputs: Email, Password, GSTIN, and Name.
  * Users can verify their GSTIN via a backend API before submitting the form.
  * Name field auto-fills once GSTIN is verified.
  * Browser-side validation before sending data to the backend.

* **Change Password Page**

  * Verifies input in the browser before sending the request to the backend.

* **Delete Account Popup**

  * Requires users to input their password before account deletion.

* **Error Popup**

  * Displays any backend error returned via API.

---

## **Backend**

* **Tech Stack**: Node.js with Express.js.

* **Main Routes**:

  * `auth-routes`: Handles sign-in and sign-up controllers.
  * `user-routes`: Handles GSTIN verification, password change, customer onboarding, and account deletion.

---

### **Database**

* **Database**: PostgreSQL

  * Email is used as the primary key.
  * GSTIN is set as a unique key.

---

### **Authentication & Validation**

* All incoming data is validated using the `express-validator` middleware.
* Passwords are encrypted using the **bcrypt.js** library before being stored in the database.
* On sign-up:

  * Checks if the email and GSTIN already exist in the DB.
  * Returns user data and a token upon successful registration.
* On sign-in:

  * Compares email and password with DB records.
  * Returns a JWT token upon success.
* JWT tokens are generated using **jsonwebtoken** and are valid for **4 hours**.
* Protected routes use an `auth-check` middleware to verify the token in the Authorization header.

---

### **Controllers in `user-routes`**

* **GSTIN Controller**:

  * Verifies the GSTIN number via a public API.
* **Change Password Controller**
* **Customs Controller** (for onboarding customers)
* **Delete Account Controller**

  * All of these are protected by the `auth-check` middleware.


