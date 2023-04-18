import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const wo_his = collection(db, 'past_workouts');
const wo_ref = collection(db, 'workout_ref');
let errors = null;


async function get_wo_ref() {
    let data = null;
    const snap = await getDocs(wo_ref);
    data = snap.docs[0].data();
    return data;
};
function get_data(cb) {
    let docs = [];
    getDocs(wo_his).then(snap => {
        snap.docs.forEach(d => {
            docs.push({...d.data(), id: d.id})
        });
        cb(docs);
    });
};

export {get_data, get_wo_ref};