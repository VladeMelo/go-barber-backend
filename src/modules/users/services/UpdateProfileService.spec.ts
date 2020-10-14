import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfileService: UpdateProfileService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'vvv@hotmail.com',
      name: 'Vlade',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Vagner',
      email: 'vava@hotmail.com',
    });

    expect(updatedUser.name).toBe('Vagner');
  });
  it('should not be able to update the profile of a non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing',
        name: 'Vagner',
        email: 'vava@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to change to another user email', async () => {
    const user = await fakeUsersRepository.create({
      email: 'vvv@hotmail.com',
      name: 'Vlade',
      password: '123456',
    });

    await fakeUsersRepository.create({
      email: 'vava@hotmail.com',
      name: 'Vlade',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Vagner',
        email: 'vava@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'vvv@hotmail.com',
      name: 'Vlade',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Vlade',
      email: 'vvv@hotmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });
  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'vvv@hotmail.com',
      name: 'Vlade',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Vagner',
        email: 'vava@hotmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'vvv@hotmail.com',
      name: 'Vlade',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Vagner',
        email: 'vava@hotmail.com',
        old_password: '111111',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
