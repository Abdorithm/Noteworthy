import { redirect } from "@remix-run/node";
import { getUserIdFromSession } from "./sessions.server"
import { getUserById } from "./.server/models/user.model";

export const requireUser = async (request: Request) => {
    const userId = await getUserIdFromSession(request);
    if(!userId) {
        throw redirect('/login');
    }
    const user = await getUserById(userId);
    if(!user) {
        throw redirect('/login');
    }
    return user;
}

export const requireAnon = async (request: Request) => {
    const userId = await getUserIdFromSession(request);
    if(userId) {
        throw redirect('/account');
    }
}

export const knownUser = async (request: Request) => {
    const userId = await getUserIdFromSession(request);
    if(!userId) {
        return null;
    }
    const user = await getUserById(userId);
    if(!user) {
        return null;
    }
    return user;
}
