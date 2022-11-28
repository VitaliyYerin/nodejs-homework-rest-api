const fs = require("fs/promises");
const path = require("path");
const { User } = require("../../models/user");
const Jimp = require('jimp');

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { path: tempUpload, originalname } = req.file;
        const extension = originalname.split(".").pop();
        const filename = `${_id}.${extension}`;
        const resultUpload = path.join(avatarsDir, filename);

        await Jimp.read(tempUpload)
            .then((avatar) => {
                return avatar.resize(250, 250).write(resultUpload);
            })
            .catch(err => {
                console.error(err)
            });

        await fs.rename(tempUpload, resultUpload);
        const avatarURL = path.join("public", "avatars", filename);
        await User.findByIdAndUpdate(_id, { avatarURL });
        res.json({
            avatarURL,
        })


    } catch (error) {
        console.log(error)
    }

}

module.exports = updateAvatar;