import { createUser } from "../user.model";

describe('creating a user', () => {
    it('can create a user properly', async () => {
        const user = await createUser({
            username: 'test-user',
            email: 'test@test.test',
            firstName: 'Test',
            lastName: 'User',
        });
        expect(user).toBeDefined();
    });

    it('cannot create a user with an already existing email', async () => {
        await createUser({
            username: 'test-user1',
            email: 'duplicate@test.test',
            firstName: 'Test1',
            lastName: 'User1',
        });

        await expect(createUser({
            username: 'test-user2',
            email: 'duplicate@test.test',
            firstName: 'Test2',
            lastName: 'User2',
        })).rejects.toThrow();
    });
});