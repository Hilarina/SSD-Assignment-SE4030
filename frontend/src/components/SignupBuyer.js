import axios from "axios";
import { useState } from "react";
import DOMPurify from 'dompurify';

export default function SignupBuyer() {

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [nic, setNic] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Validate name
        if (!name.match(/^[A-Za-z .]{1,100}$/)) {
            newErrors.name = "Name can only contain letters and must be between 1 and 100 characters.";
        }

        // Validate address
        if (address.trim() === '') {
            newErrors.address = "Address cannot be empty.";
        }

        // Validate NIC
        if (!nic.match(/^[0-9]{9}[Vv]|[0-9]{12}$/)) {
            newErrors.nic = "NIC must be 9 digits followed by V/v or 12 digits.";
        }

        // Validate email
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Validate phone
        if (!phone.match(/^0[0-9]{9}$/)) {
            newErrors.phone = "Phone number must start with 0 and be exactly 10 digits.";
        }

        // Validate password
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordPattern.test(password)) {
            newErrors.password = "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.";
        }

        // Validate password match
        if (password !== rePassword) {
            newErrors.rePassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;  // Return true if there are no errors
    };

    function proceed(e) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        // Sanitize inputs to prevent XSS
        const sanitizedEmail = DOMPurify.sanitize(email);
        const sanitizedName = DOMPurify.sanitize(name);
        const sanitizedAddress = DOMPurify.sanitize(address);
        const sanitizedNic = DOMPurify.sanitize(nic);
        const sanitizedPhone = DOMPurify.sanitize(phone);

        // Proceed only if input validation passes
        axios.get(`http://localhost:8070/buyer/get/email/${sanitizedEmail}`).then((res) => {
            if (res.data[0] === undefined) {
                const newBuyer = {
                    name: sanitizedName,
                    address: sanitizedAddress,
                    nic: sanitizedNic,
                    email: sanitizedEmail,
                    phone: sanitizedPhone,
                    password
                };

                axios.post("http://localhost:8070/buyer/add", newBuyer).then(() => {
                    axios.post(`http://localhost:8072/email/register/${sanitizedName}/${sanitizedEmail}`).catch((err) => {
                        setErrors(prev => ({ ...prev, emailService: "Email Service is not available." }));
                    });
                    alert("Registration Successful!");
                    window.location.replace("http://localhost:3000");
                }).catch((err) => {
                    setErrors(prev => ({ ...prev, general: "Something went wrong during registration." }));
                });
            } else {
                setErrors(prev => ({ ...prev, email: "You already have an account with this email." }));
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="container">
            <a href="/buyerlogin"><button className="btn btn-primary">Back</button></a>

            <form onSubmit={proceed} noValidate> {/* Added noValidate to disable HTML5 validation */}
                <section className="vh-100 gradient-custom">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                                    <div className="card-body p-5 text-center">

                                        <div className="mb-md-5 mt-md-4 pb-5">
                                            <h2 className="fw-bold mb-2 text-uppercase">Create Your Account</h2>
                                            <p className="text-white-50 mb-5">Please enter your details!</p>

                                            {/* Name field */}
                                            <div className="form-outline form-white mb-4">
                                                <input type="text" id="name" className="form-control form-control-lg" placeholder="Enter your name" required onChange={(e) => setName(e.target.value)} />
                                                <label className="form-label" htmlFor="name">Name</label>
                                                {errors.name && <p className="text-danger">{errors.name}</p>}
                                            </div>

                                            {/* Address field */}
                                            <div className="form-outline form-white mb-4">
                                                <input type="text" id="address" className="form-control form-control-lg" placeholder="Enter your address" required onChange={(e) => setAddress(e.target.value)} />
                                                <label className="form-label" htmlFor="address">Address</label>
                                                {errors.address && <p className="text-danger">{errors.address}</p>}
                                            </div>

                                            {/* NIC field */}
                                            <div className="form-outline form-white mb-4">
                                                <input type="text" id="nic" className="form-control form-control-lg" placeholder="Enter your NIC number" required onChange={(e) => setNic(e.target.value)} />
                                                <label className="form-label" htmlFor="nic">NIC</label>
                                                {errors.nic && <p className="text-danger">{errors.nic}</p>}
                                            </div>

                                            {/* Email field */}
                                            <div className="form-outline form-white mb-4">
                                                <input type="email" id="email" className="form-control form-control-lg" placeholder="abc@gmail.com" required onChange={(e) => setEmail(e.target.value)} />
                                                <label className="form-label" htmlFor="email">Email</label>
                                                {errors.email && <p className="text-danger">{errors.email}</p>}
                                            </div>

                                            {/* Phone field */}
                                            <div className="form-outline form-white mb-4">
                                                <input type="phone" id="phone" className="form-control form-control-lg" placeholder="Phone No" required onChange={(e) => setPhone(e.target.value)} />
                                                <label className="form-label" htmlFor="phone">Phone</label>
                                                {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                            </div>

                                            {/* Password field */}
                                            <div className="form-outline form-white mb-4">
                                                <input type="password" id="newpassword" className="form-control form-control-lg" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                                                <label className="form-label" htmlFor="password">New Password</label>
                                                {errors.password && <p className="text-danger">{errors.password}</p>}
                                            </div>

                                            {/* Re-enter Password field */}
                                            <div className="form-outline form-white mb-4">
                                                <input type="password" id="repassword" className="form-control form-control-lg" placeholder="Re-enter Password" required onChange={(e) => setRePassword(e.target.value)} />
                                                <label className="form-label" htmlFor="repassword">Re-enter Password</label>
                                                {errors.rePassword && <p className="text-danger">{errors.rePassword}</p>}
                                            </div>

                                            {/* Submit button */}
                                            <button className="btn btn-outline-light btn-lg px-5" type="submit">Create</button>
                                            {errors.general && <p className="text-danger mt-3">{errors.general}</p>}
                                            {errors.emailService && <p className="text-danger mt-3">{errors.emailService}</p>}
                                        </div>

                                        <div>
                                            <p className="mb-0">Do you have an account? <a href="/buyersignup" className="text-white-50 fw-bold">Sign Up</a></p>
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
