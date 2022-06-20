const { request, response } = require('express');
const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

/*const accountTransport = require('../accout_transport.json');

const mail_rover = async (callback) => {
    const oauth2Client = new OAuth2(
        accountTransport.auth.clientID,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.getAccessToken((err,token) =>{
        if (err)
            return console.log(err);
        accountTransport.auth.accessToken = token;
        callback(nodemailer.createTransport(accountTransport));
    })
}*/

const envioCorreo = (req = request, resp = response) => {
    let body = req.body;
    let config = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port:465,
        secure: true,
        auth:{
            type: "OAuth2",
            user: "intjairolopez@gmail.com",
            clientId:'811269512428-7g1il5aiupqci9b02p4i9h8pqedaibke.apps.googleusercontent.com',
            clientSecret:'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',
            refreshToken: "1//04ly-nZoVhYgkCgYIARAAGAQSNwF-L9IrSiXNHovMoU1kuUnJjYP9vBctsIiGmvC6Ov9emL6rayX77mh9-LzgUT3GocCwcGYYJgU",
            accessToken: "ya29.a0ARrdaM872Wm88RjSJv_Ks1TpcaNhTZImUPrK-uVJU-EjRuGit-_evA05s2H4YTE0_Ti43pYhv47O3BqYMo4n_gngFhAcmfhGq9D5L8vbM5d-GV3fulNWUaYUUUUqMOMYhnvd301gJ1t7VfobmcP13zDTLofc"
        }
    });
   
    const opciones = {
        from: 'storeF',
        subject: body.asunto,
        to: "xjlopz10@gmail.com",
        text: body.mensaje
    };
    console.log(req);
    config.sendMail(opciones, function(error,result){
        if(error) return resp.json({ok:false,msg:error});
        return resp.json({
            ok:true,
            msg:result
        });
    })
}


module.exports = {
    envioCorreo
}