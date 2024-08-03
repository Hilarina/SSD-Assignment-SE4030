const express = require("express");
const sgMail = require("@sendgrid/mail");
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Apply security middleware
router.use(helmet());
router.use(express.json());

const validateEmail = [
    check('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    check('name').notEmpty().withMessage('Name is required').trim().escape(),
];

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

router.use(limiter);

const sendEmail = async (to, subject, html) => {
    const msg = {
        to,
        from: 'spshayurvedicbusiness@gmail.com',
        subject,
        html,
    };
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error.message);
        throw new Error('Email Service is not available.');
    }
};

router.route("/register/:name/:email").post(validateEmail, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.params;
    const htmlContent = `<p>
        Dear ${name},<br/><br/>
        Thank you for registering with us. Your account has been created successfully.<br/><br/>
        If you have any questions or concerns, please don't hesitate to contact us. Our team is always here to help.<br/>
        Thank you for choosing our service, and we look forward to continuing to serve you.<br/><br/>
        Regards, <br/>
        Administrator, <br/>
        SPSH Ayurvedic Center, Sri Lanka
    </p>`;

    try {
        await sendEmail(email, 'Registration Successful', htmlContent);
        res.status(200).send('Email sent');
    } catch (error) {
        res.status(500).send('Email Service is not available.');
    }
});

router.route("/update/:name/:email").post(validateEmail, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.params;
    const htmlContent = `<p>
        Dear ${name},<br/><br/>
        We wanted to let you know that we have recently updated your account details.
        Please review the changes we made to ensure that your information is accurate and up-to-date.<br/><br/>
        If you have any questions or concerns about these changes, please don't hesitate to contact us. Our team is always here to help.<br/>
        Thank you for choosing our service, and we look forward to continuing to serve you.<br/><br/>
        Best Regards, <br/>
        Administrator, <br/>
        SPSH Ayurvedic Center, Sri Lanka
    </p>`;

    try {
        await sendEmail(email, 'Your Account Details Have Been Updated', htmlContent);
        res.status(200).send('Email sent');
    } catch (error) {
        res.status(500).send('Email Service is not available.');
    }
});

router.route("/delete/:name/:email").post(validateEmail, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.params;
    const htmlContent = `<p>
        Dear ${name},<br/><br/>
        We're sorry to see you go, but we wanted to confirm that your account has been successfully removed from our system.<br/><br/>
        If you have any questions or concerns, please don't hesitate to contact us. Our team is always here to help.<br/>
        Thank you for the time you spent with us and we wish you all the best.<br/><br/>
        Regards, <br/>
        Administrator, <br/>
        SPSH Ayurvedic Center, Sri Lanka
    </p>`;

    try {
        await sendEmail(email, 'Your Account Has Been Removed', htmlContent);
        res.status(200).send('Email sent');
    } catch (error) {
        res.status(500).send('Email Service is not available.');
    }
});

router.route("/payment").post([
    check('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    check('name').notEmpty().withMessage('Name is required').trim().escape(),
    check('orderRef').notEmpty().withMessage('Order reference is required').trim().escape(),
    check('totalAmount').isFloat({ gt: 0 }).withMessage('Invalid total amount'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, orderRef, totalAmount } = req.body;
    const htmlContent = `<p>
        Dear ${name},<br/><br/>
        Thank you for your recent purchase on SPSH Ayurvedic Center. We are pleased to confirm that your order has been successfully processed and is now being prepared for shipping.<br/><br/>
        <u>Order Details:</u><br/><br/>
        <b>Order Number:</b> ${orderRef}<br/>
        <b>Total Amount:</b> Rs.${parseFloat(totalAmount).toFixed(2)}<br/><br/>
        If you have any questions or concerns, please don't hesitate to contact us. Our team is always here to help.<br/>
        Thank you for choosing our service, and we look forward to continuing to serve you.<br/><br/>
        Regards, <br/>
        Administrator, <br/>
        SPSH Ayurvedic Center, Sri Lanka
    </p>`;

    try {
        await sendEmail(email, `Order Confirmation - ${orderRef}`, htmlContent);
        res.status(200).send('Email sent');
    } catch (error) {
        res.status(500).send('Email Service is not available.');
    }
});

module.exports = router;








// const router = require("express").Router();
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// router.route("/register/:name/:email").post((req, res) => {
//   let name = req.params.name;
//   let email = req.params.email;

//   const msg = {
//     to: email,
//     from: "spshayurvedicbusiness@gmail.com",
//     subject: "Registration Successful",
//     text: "test",
//     html: `<p>
//                 Dear ${name},<br/><br/>

//                 Thank you for registering with us. Your account has been created successfully.<br/><br/>

//                 If you have any questions or concerns, please don't hesitate to contact us. Our team is always here to help.<br/>

//                 Thank you for choosing our service, and we look forward to continuing to serve you.<br/><br/>

//                 Regards, <br/>
//                 Administrator, <br/>
//                 SPSH Ayurvedic Center, Sri Lanka
//             </p>`,
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//       res.send("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//       res.send(error);
//     });
// });

// router.route("/update/:name/:email").post((req, res) => {
//   let name = req.params.name;
//   let email = req.params.email;

//   const sgMail = require("@sendgrid/mail");
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: email,
//     from: "spshayurvedicbusiness@gmail.com",
//     subject: "Your Account Details Have Been Updated",
//     text: "test",
//     html: `<p>
//                     Dear ${name},<br/><br/>

//                     We wanted to let you know that we have recently updated your account details. 
//                     Please review the changes we made to ensure that your information is accurate and up-to-date.<br/><br/>

//                     If you have any questions or concerns about these changes, please don't hesitate to contact us. Our team is always here to help.<br/>

//                     Thank you for choosing our service, and we look forward to continuing to serve you.<br/><br/>

//                     Best Regards, <br/>
//                     Administrator, <br/>
//                     SPSH Ayurvedic Center, Sri Lanka
//                 </p>`,
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//       res.send("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//       res.send(error);
//     });
// });

// router.route("/delete/:name/:email").post((req, res) => {
//   let name = req.params.name;
//   let email = req.params.email;

//   const sgMail = require("@sendgrid/mail");
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: email,
//     from: "spshayurvedicbusiness@gmail.com",
//     subject: "Your Account Has Been Removed",
//     text: "test",
//     html: `<p>
//                     Dear ${name},<br/><br/>

//                     We're sorry to see you go, but we wanted to confirm that your account has been successfully removed from our system.<br/><br/>

//                     If you have any questions or concerns, please don't hesitate to contact us. Our team is always here to help.<br/>

//                     Thank you for the time you spent with us and we wish you all the best.<br/><br/>

//                     Regards, <br/>
//                     Administrator, <br/>
//                     SPSH Ayurvedic Center, Sri Lanka
//                 </p>`,
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//       res.send("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//       res.send(error);
//     });
// });

// router.route("/payment").post((req, res) => {
//   let name = req.body.name;
//   let email = req.body.email;
//   let orderRef = req.body.orderRef;
//   let totAmount = req.body.totalAmount;

//   const msg = {
//     to: email,
//     from: "spshayurvedicbusiness@gmail.com",
//     subject: `Order Confirmation - ${orderRef}`,
//     text: "test",
//     html: `<p>
//                 Dear ${name},<br/><br/>

//                 Thank you for your recent purchase on SPSH Ayurvedic Center. We are pleased to confirm that your order has been successfully processed and is now being prepared for shipping.<br/><br/>

//                 <u>Order Details:</u><br/><br/>
//                 <b>Order Number:</b> ${orderRef}<br/>
//                 <b>Total Amount:</b> Rs.${parseFloat(totAmount).toFixed(
//                   2
//                 )}<br/><br/>

//                 If you have any questions or concerns, please don't hesitate to contact us. Our team is always here to help.<br/>

//                 Thank you for choosing our service, and we look forward to continuing to serve you.<br/><br/>

//                 Regards, <br/>
//                 Administrator, <br/>
//                 SPSH Ayurvedic Center, Sri Lanka
//             </p>`,
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//       res.send("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//       res.send(error);
//     });
// });

// module.exports = router;
