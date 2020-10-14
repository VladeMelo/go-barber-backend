import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      email: 'vvv@hotmail.com',
      name: 'vlade',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'vvv@hotmail.com',
      password: '123456',
    });

    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticate with an user that does not exist', async () => {
    await expect(
      authenticateUser.execute({
        email: 'vv@hotmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate with a wrong password', async () => {
    await fakeUsersRepository.create({
      email: 'vvv@hotmail.com',
      name: 'vlade',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'vvv@hotmail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
