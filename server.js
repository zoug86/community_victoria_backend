const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

const dotenv = require('dotenv');
dotenv.config();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const transport = {
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
    }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

router.post('/contact', (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    const content = `name: ${name} \n email: ${email} \n subject: ${subject} \n message: ${message} `

    const mail = {
        from: email,
        to: process.env.USER_EMAIL,  // Change to email address that you want to receive messages on
        subject: subject,
        text: content
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })
        }
    })
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));