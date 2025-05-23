const defaultLogin = (): string => {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
    <style>
      body {
        background: #121212;
        font-family: "Raleway", sans-serif;
        color: #e0e0e0;
        margin: 0;
      }

      a {
        color: #ffffff;
        font-weight: 600;
        font-size: 0.85em;
        text-decoration: none;
      }

      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .form {
        background: #1e1e1e;
        margin: 15px;
        padding: 25px;
        border-radius: 25px;
        box-shadow: 0px 10px 25px 5px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 400px;
      }

      .sign-in-section {
        padding: 30px;
      }

      .sign-in-section h1 {
        text-align: center;
        font-weight: 700;
        position: relative;
        margin-top: 0;
        color: #ffffff;
      }

      .sign-in-section h1::after {
        content: "";
        position: absolute;
        height: 4px;
        bottom: -15px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 40px;
        background: linear-gradient(to right, #bb86fc, #6200ee);
        transition: width 0.25s;
      }

      .sign-in-section h1:hover::after {
        width: 100px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 40px 0 0px;
        text-align: center;
      }

      .form-field label {
        margin-bottom: 10px;
        font-weight: 600;
        color: #f0f0f0;
      }

      .form-field input[type="password"] {
        padding: 15px;
        border-radius: 10px;
        background: #2a2a2a;
        border: 1px solid #444;
        color: #f0f0f0;
        width: 100%;
        max-width: 300px;
        text-align: center;
      }

      .form-field input::placeholder {
        color: #888;
      }

      .form-field input:focus {
        border-color: #bb86fc;
        outline: none;
      }

      .btn {
        padding: 15px;
        font-size: 1em;
        width: 100%;
        border-radius: 25px;
        border: none;
        margin-top: 10px;
        cursor: pointer;
        color: #fff;
        background: linear-gradient(to right, #bb86fc, #6200ee);
        box-shadow: 0px 5px 15px 5px rgba(187, 134, 252, 0.2);
      }

      .btn:hover {
        opacity: 0.95;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="form">
        <div class="sign-in-section">
          <h1>Log in</h1>
          <form method="POST" action="/login">
            <div class="form-field">
              <label for="api_key">API Key</label>
              <input
                id="api_key"
                type="password"
                placeholder="Enter your API key"
                name="api_key"
                required
              />
            </div>
            <div class="form-field">
              <input type="submit" class="btn" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </body>
</html>  
`;
};

const default404 = (): string => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404 Not Found</title>
    <style>
      body {
        background: #121212;
        font-family: "Raleway", sans-serif;
        color: #e0e0e0;
        margin: 0;
      }

      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .box {
        background: #1e1e1e;
        padding: 40px;
        border-radius: 25px;
        box-shadow: 0px 10px 25px 5px rgba(0, 0, 0, 0.5);
        text-align: center;
        max-width: 400px;
        width: 90%;
      }

      h1 {
        font-size: 4em;
        margin: 0;
        color: #bb86fc;
      }

      h2 {
        margin: 20px 0 10px;
        font-size: 1.5em;
        font-weight: 500;
        color: #ffffff;
      }

      p {
        margin-bottom: 25px;
        font-size: 0.95em;
        color: #bbbbbb;
      }

      .btn {
        padding: 12px 25px;
        font-size: 1em;
        border-radius: 25px;
        border: none;
        cursor: pointer;
        background: linear-gradient(to right, #bb86fc, #6200ee);
        color: #fff;
        text-decoration: none;
        display: inline-block;
        box-shadow: 0px 5px 15px 5px rgba(187, 134, 252, 0.2);
        transition: opacity 0.2s ease;
      }

      .btn:hover {
        opacity: 0.9;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you’re looking for doesn’t exist or was moved.</p>
        <a href="/" class="btn">Go Home</a>
      </div>
    </div>
  </body>
</html>
  `;
};

const default401 = (): string => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>401 Unauthorized</title>
    <style>
      body {
        background: #121212;
        font-family: "Raleway", sans-serif;
        color: #e0e0e0;
        margin: 0;
      }

      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .box {
        background: #1e1e1e;
        padding: 40px;
        border-radius: 25px;
        box-shadow: 0px 10px 25px 5px rgba(0, 0, 0, 0.5);
        text-align: center;
        max-width: 400px;
        width: 90%;
      }

      h1 {
        font-size: 4em;
        margin: 0;
        color: #ff6e6e;
      }

      h2 {
        margin: 20px 0 10px;
        font-size: 1.5em;
        font-weight: 500;
        color: #ffffff;
      }

      p {
        margin-bottom: 25px;
        font-size: 0.95em;
        color: #bbbbbb;
      }

      .btn {
        padding: 12px 25px;
        font-size: 1em;
        border-radius: 25px;
        border: none;
        cursor: pointer;
        background: linear-gradient(to right, #ff6e6e, #ff3c3c);
        color: #fff;
        text-decoration: none;
        display: inline-block;
        box-shadow: 0px 5px 15px 5px rgba(255, 110, 110, 0.2);
        transition: opacity 0.2s ease;
      }

      .btn:hover {
        opacity: 0.9;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box">
        <h1>401</h1>
        <h2>Unauthorized</h2>
        <p>You do not have permission to access this page.</p>
        <a href="/login" class="btn">Go to Login</a>
      </div>
    </div>
  </body>
</html>
  `;
};

export { defaultLogin, default404, default401 };
