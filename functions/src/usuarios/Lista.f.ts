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

endpointExpress.get('/lista', async (req: any, res: any, next: any) => {

    const _usuariosCollection = db.collection('Users');
    const snapshot = await _usuariosCollection.get();

    const _usrArray = snapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data }
    });

    res.status(200);
    res.json({
        status: "success",
        usuarios: _usrArray
    });
});

exports = module.exports = functions.https.onRequest((request, response) => {
    return endpointExpress(request, response);
})


