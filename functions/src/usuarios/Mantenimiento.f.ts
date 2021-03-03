import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cookieParser from 'cookie-parser';

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

const endpointExpress = express();
const _cors = cors({ origin: true });

endpointExpress.options('*', _cors);
endpointExpress.use('*', _cors);
endpointExpress.use(cookieParser());

endpointExpress.post('*', async (req: any, res: any) => {

    try {

        const _id = req.body.id;
        const _role = req.body.role;
        const _roles = req.body.roles;
        //creo claims en auth
        await admin.auth().setCustomUserClaims(_id, _role);
        //registro en firesatore ...coleccion Users
        await db.collection('Users')
            .doc(_id)
            .set({ roles: _roles }, { merge: true })

        res.status(200);
        res.json({
            status: "success"
        });

    } catch (error) {
        res.status(403);
        res.json({
            status: "error",
            mensaje: error.message
        });
    }

});

exports = module.exports = functions.https.onRequest((request, response) => {
    return endpointExpress(request, response);
})
