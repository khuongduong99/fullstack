import { emit } from "nodemon";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'
import { reject } from "lodash";
import { where } from "sequelize";
import { raw } from "body-parser";


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.fullName || !data.selectGender || !data.address
            ) {
                resolve({
                    errCode: 0,
                    errMessage: 'miss'
                    //data: doctors
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail
                    ({
                        receiverEmail: data.email,
                        patientName: data.fullName,
                        time: data.timeString,
                        doctorName: data.doctorName,
                        language: data.language,
                        redirectLink: buildUrlEmail(data.doctorId, token)
                    })
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectGender,
                        address: data.address,
                        firstName: data.fullName
                    }
                });
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed !'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data) => {
    //console.log('check mail: ', data)
    return new Promise(async (resolve, reject) => {
        try {
            //
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'miss data'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                console.log("📌 Token nhận được từ request:", data.token);

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Succeed'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'hmmmmm'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
}