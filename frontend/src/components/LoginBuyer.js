import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
//USED FOR OPEN ID
// import { jwtDecode } from "jwt-decode";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
import bcrypt from "bcryptjs";

export default function LoginBuyer() {
  if (sessionStorage.getItem("sAyurCenReyub") !== null) {
    window.location.replace("/buyerhome");
  }

  const [email, setEmail] = useState({});
  const [password, setPassword] = useState({});
  const [captchaText, setCaptchaText] = useState("");

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  //USED FOR OPENID
  // useEffect(() => {
  //   loadCaptchaEnginge(6);

  //   // Check for ID token in the URL after Google OAuth login
  //   const hash = window.location.hash;
  //   if (hash) {
  //     const idToken = new URLSearchParams(hash.substring(1)).get("id_token");

  //     if (idToken) {
  //       // Decode the ID token to get user info (email)
  //       const decodedToken = jwtDecode(idToken);
  //       const buyerEmail = decodedToken.email;
  //       console.log(buyerEmail,"emailllllllll")

  //       // Set session storage items
  //       sessionStorage.setItem("sAyurCenReyub", Math.random().toString());
  //       sessionStorage.setItem("buyerEmail", buyerEmail);

  //       // Redirect to buyer home after successful login
  //       window.location.replace(`/buyerhome`);
  //     }
  //   }
  // }, []);

  const handleClick = () => {
    const callbackUrl = `http://localhost:3000/buyerhome`; // Must redirect here after Google OAuth
    const googleClientId = "252001878781-ofto9oejf5b3iv5bca0o2vmthdb62hl7.apps.googleusercontent.com";
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;

    // Redirect to Google OAuth
    window.location.href = targetUrl;
    
    // Immediately after the redirection, we capture the access token and set session storage items.
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash;
      const token = new URLSearchParams(hash.substring(1)).get("access_token");

      if (token) {
        // Fetch user info using the access token
        axios
          .get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
          .then((response) => {
            const buyerEmail = response.data.email;

            // Set session storage items
            sessionStorage.setItem("sAyurCenReyub", Math.random().toString());
            sessionStorage.setItem("buyerEmail", buyerEmail);

            // Redirect to buyer home after successful login
            window.location.replace(`/buyerhome`);
          })
          .catch((error) => {
            console.error("Failed to fetch user info:", error);
            alert("Failed to log in with Google.");
          });
      }
    });
  };

  //USED FOR OPEN ID
  // const handleClick = () => {
  //   const callbackUrl = `http://localhost:3000/buyerhome`;
  //   const googleClientId = "252001878781-ofto9oejf5b3iv5bca0o2vmthdb62hl7.apps.googleusercontent.com";
  //   const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
  //     callbackUrl
  //   )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
  //   window.location.href = targetUrl;
  // };


  // const handleClick = () => {
  //   const callbackUrl = `http://localhost:3000/buyerhome`; // Your app's redirect URI
  //   const googleClientId = "252001878781-ofto9oejf5b3iv5bca0o2vmthdb62hl7.apps.googleusercontent.com";
  //   const targetUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(
  //     callbackUrl
  //   )}&response_type=id_token&client_id=${googleClientId}&scope=openid%20email%20profile&nonce=secureNonce123&state=xyzABC&prompt=consent`;

  //   // Redirect to Google OAuth with OpenID Connect
  //   window.location.href = targetUrl;
  // };
  function validate(e) {
    e.preventDefault();
    if (validateCaptcha(captchaText) === true) {
      axios
        .get(`http://localhost:8070/buyerH/get/email/${email}`)
        .then((res) => {
          // if (res.data[0].password === password) {
          bcrypt.compare(password, res.data[0].hpw, function (err, result) {
            if (result === true) {
              sessionStorage.setItem("sAyurCenReyub", Math.random().toString());
              sessionStorage.setItem("buyerEmail", email);
              window.location.replace(`http://localhost:3000/buyerhome`);
            } else {
              alert("Invalid Credentials !");
              loadCaptchaEnginge(6);
              setCaptchaText("");
            }
          });
        })
        .catch((err) => {
          alert("Please register your account !");
          loadCaptchaEnginge(6);
          setCaptchaText("");
        });
    } else {
      alert("Captcha does not match!");
      loadCaptchaEnginge(6);
      setCaptchaText("");
    }
  }

  return (
    <div className="container">
      <a href="/">
        <Button variant="dark">Back</Button>
      </a>
      <form onSubmit={validate}>
        <section className="vh-100 gradient-custom">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div
                  className="card bg-dark text-white"
                  style={{ borderRadius: "1rem" }}
                >
                  <div className="card-body p-5 text-center">
                    <div className="mb-md-5 mt-md-4 pb-5">
                      <h2 className="fw-bold mb-2 text-uppercase">
                        Buyer Login
                      </h2>
                      <p className="text-white-50 mb-5">
                        Please enter your email and password!
                      </p>

                      <div className="form-outline form-white mb-4">
                        <input
                          type="email"
                          id="email"
                          className="form-control form-control-lg"
                          placeholder="abc@gmail.com"
                          required
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                        <label className="form-label" htmlFor="typeEmailX">
                          Email
                        </label>
                      </div>

                      <div className="form-outline form-white mb-4">
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          placeholder="Password"
                          required
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                        <label className="form-label" htmlFor="typePasswordX">
                          Password
                        </label>
                      </div>

                      <div>
                        <LoadCanvasTemplate />
                        <input
                          type="text"
                          placeholder="Captcha Text"
                          onChange={(e) => {
                            setCaptchaText(e.target.value);
                          }}
                          value={captchaText}
                          required
                        />
                      </div>
                      <br />

                      <button
                        className="btn btn-outline-light btn-lg px-5"
                        type="submit"
                      >
                        Login
                      </button>
                      <button
                        className="btn btn-outline-light btn-lg px-5"
                        type="submit"
                        onClick={handleClick}
                      >
                        Sign In With Google
                      </button>
                    </div>

                    <div>
                      <p className="mb-0">
                        Don't have an account?{" "}
                        <a
                          href="/buyersignup"
                          className="text-white-50 fw-bold"
                        >
                          Sign Up
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
