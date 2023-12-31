import * as Hapi from '@hapi/hapi';
import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import { Test, getServerInjectOptions } from './utils';
import { ICredentials, ISignUpCredentials, IUpdateData } from '../src/server/interfaces';
import { getUUID } from '../src/server/utils';

describe('Users', () => {
    let server: Hapi.Server;
	let res: any;

	let password: string = 'Password123!!';
    let firstName: string = 'Vitalik'
    let lastName: string = 'Buterin'

	let access: string;

    const uuid = '' //paste created id in /test_database

	let email: string = `${getUUID()}@example.com`;

	const signUp: ISignUpCredentials = {
		email,
		password,
	};

	const specialistCred: ICredentials = {
		login: email,
		password,
	};

    const updateData: IUpdateData = {
        firstName: firstName,
        lastName: lastName,
    }

    beforeAll(async () => {
        server = await Test.start();
        res = await server.inject(
			getServerInjectOptions('/api/auth/registration', 'POST', null, signUp),
		);

        res = await server.inject(
			getServerInjectOptions('/api/auth/login', 'POST', null, specialistCred),
		);

		access = res.result.result.access;
    });

    afterAll(async () => {
        await server.stop();
    });

    it('Get By Id', async () => {
        res = await server.inject(
            getServerInjectOptions(`/api/user/${uuid}`, 'GET', access)
        );

        expect(res.statusCode).toEqual(200);
    });

    it('Get All', async () => {
        res = await server.inject(
            getServerInjectOptions(`/api/user/search`, 'GET', access)
        );

        expect(res.statusCode).toEqual(200);
    });

    it('Get by email', async () => {
        res = await server.inject(
            getServerInjectOptions(`/api/user/search/${email}`, 'GET', access)
        );

        expect(res.statusCode).toEqual(200);
    });

    it('Get by pagination', async () => {
        res = await server.inject(
            getServerInjectOptions(`/api/user/search?page=1&pageSize=4`, 'GET', access)
        );

        expect(res.statusCode).toEqual(200);
    });

    it('Get by last month', async () => {
        res = await server.inject(
            getServerInjectOptions(`/api/user/info/last-month`, 'GET', access)
        );

        expect(res.statusCode).toEqual(200);
    });

    it('Get by last month by pagination', async () => {
        res = await server.inject(
            getServerInjectOptions(`/api/user/info/last-month?page=1&pageSize=4`, 'GET', access)
        );

        expect(res.statusCode).toEqual(200);
    });

    it('Update User\'s data', async () => {
        res = await server.inject(
            getServerInjectOptions(`/api/user/update`, 'PUT', access, updateData)
        )

        expect(res.statusCode).toEqual(200);
    })
});
