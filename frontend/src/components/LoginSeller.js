import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
import bcrypt from "bcryptjs";

export default function LoginSeller() {
  if (sessionStorage.getItem("sAyurCenRelles") !== null) {
    window.location.replace("/sellerhome");
  }

  const [email, setEmail] = useState({});
  const [password, setPassword] = useState({});
  const [captchaText, setCaptchaText] = useState("");

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleOAuth = () => {
    sessionStorage.setItem("oauth", "true");
    const callbackUrl = `http://localhost:3000/selleroauth`; // Must redirect here after Google OAuth
    const googleClientId =
      "252001878781-uq49h7e6iaoql9le46juvakqdps3hib1.apps.googleusercontent.com";
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;

    // Redirect to Google OAuth
    window.location.href = targetUrl;
  };

  function validate(e) {
    e.preventDefault();
    if (validateCaptcha(captchaText) === true) {
      axios
        .get(`http://localhost:8070/sellerH/get/email/${email}`)
        .then((res) => {
          // if (res.data[0].password === password) {
          bcrypt.compare(password, res.data[0].hpw, function (err, result) {
            if (result === true) {
              sessionStorage.setItem(
                "sAyurCenRelles",
                Math.random().toString()
              );
              sessionStorage.setItem("sellerEmail", email);
              window.location.replace(`http://localhost:3000/sellerhome`);
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
                        Seller Login
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
                        onClick={handleOAuth}
                      >
                        Sign In With Google
                      </button>
                    </div>

                    <div>
                      <p className="mb-0">
                        Don't have an account? Contact the administrator.
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
