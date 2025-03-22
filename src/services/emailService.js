import 'dotenv/config';
import { reject } from 'lodash';
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Khuong Duong 👻" <duongvankhuong197@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmail(dataSend),
    });


}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
                <h3>Xin chào: ${dataSend.patientName}</h3>
                <p>Bạn nhận đươc email này từ phòng khám Đông Y</p>
                <p>Thông tin đặt lịch khám bệnh: </p>
                <div><p>Thời gian: ${dataSend.time}</p></div>
                <div><p>TBác sĩ: ${dataSend.doctorName}</p></div>
                <p>Nếu đúng thông tin vui lòng click vào link dưới để xác nhận !</p>
                <div><a href=${dataSend.redirectLink} target="_blank" >Click here </a></div>
                `
    }
    if (dataSend.language === 'en') {
        result = `
                <h3>Hello: ${dataSend.patientName}</h3>
                <p>You have received this email from Đông Y Clinic.</p>
                <p>Appointment details:</p>
                <div><p>Time: ${dataSend.time}</p></div>
                <div><p>Doctor: ${dataSend.doctorName}</p></div>
                <p>If the information is correct, please click the link below to confirm!</p>
                <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
                `
    }
    return result
}


let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào: ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này vì đã đặt lịc khám bệnh</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>

        <div>Xin chân thành cảm ơn !</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello: ${dataSend.patientName} !</h3>
        <p>You are receiving this email because you have booked an appointment</p>
        <p>The prescription/invoice information is sent in the attached file.</p>

        <div>Thank you very much!</div>
        `
    }
    return result
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            })
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Khuong Duong 👻" <duongvankhuong197@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    }
                ]
            });
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}