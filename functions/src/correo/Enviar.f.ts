import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as nodemaile from 'nodemailer';

//defino un aconmst que tendra la con de la cuenta que enviara correos
const transportador = nodemaile.createTransport({
    service: 'gmail',
    auth: {
        user: 'elegio.maldito@gmail.com',
        pass: 'livertad33'
    }
});


//constante de express
const endpointExpress = express();
const _cors = cors({ origin: true });//cors abierto desde cualquier dominio
endpointExpress.options('*', _cors);
endpointExpress.use('*', _cors);
endpointExpress.use(cookieParser());
endpointExpress.use(express.json);//que use un formato json

endpointExpress.post('*', async (req: any, res: any) => {
    const $ime = req.body.email;
    const $title = req.body.titulo;
    const $message = req.body.mensaje;

    const imeOptionalJson = {
        from: 'fcavieres@dim.cl',//mascara
        to: $ime,
        subject: $title,
        html: `<p>${$message}</p>`
    }

    transportador.sendMail(imeOptionalJson, function (err, info) {
        if (err) {
            res.sen(err);
        } else {
            res.send("El email fue enviado correctamente");
        }
    });

});

exports = module.exports = functions.https.onRequest((request, response) => {
    return endpointExpress(request, response);
})
