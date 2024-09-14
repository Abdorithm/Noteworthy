import { redirect } from "@remix-run/node";
import { getUserIdFromSession } from "./sessions.server"
import { getUserById } from "./.server/models/user.model";

export const requireUser = async (requset: Request) => {
    const userId = await getUserIdFromSession(requset);
    if(!userId) {
        throw redirect('/login');
    }
    const user = await getUserById(userId);
    if(!user) {
        throw redirect('/login');
    }
    return user;
}

export const requireAnon = async (requset: Request) => {
    const userId = await getUserIdFromSession(requset);
    if(userId) {
        throw redirect('/account');
    }
}

export const knownUser = async (requset: Request) => {
    const userId = await getUserIdFromSession(requset);
    if(!userId) {
        return null;
    }
    const user = await getUserById(userId);
    if(!user) {
        return null;
    }
    return user;
}
