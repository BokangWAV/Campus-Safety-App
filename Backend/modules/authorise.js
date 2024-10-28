const { admin } = require('./init.js')
const { getUser } = require('./users.js')


async function verifyUser(authtoken, uid){
    var status, role;
    try {
        const authUser = await admin.auth().verifyIdToken(authtoken);
        if(authUser.uid !== uid) {
            console.log(uid)
            console.log(authUser.uid)
            status = 403; 
        }else{
            role = (await getUser(uid));
            if(role.length>0) role = role[0].role
            status = 200;
        }
        
    } catch (error) {
        console.error(error);
        status = 401
    }

    console.log("A user has been verified");

    return { status, role}
}


module.exports = { verifyUser }
