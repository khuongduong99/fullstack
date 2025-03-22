import specialtyService from "../services/specialtyService"

let createNewSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(infor);

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "err from sever "
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.getAllSpecialty();
        return res.status(200).json(infor);

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "err from sever "
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
        return res.status(200).json(infor);

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "err from sever "
        })
    }
}

module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}