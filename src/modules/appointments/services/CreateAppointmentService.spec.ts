import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 30, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 5, 30, 13),
      provider_id: '123123123',
      user_id: '111111',
    });

    expect(appointment).toHaveProperty('id');
  });
  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 30, 12).getTime();
    });

    await createAppointment.execute({
      date: new Date(2020, 5, 30, 13),
      provider_id: '123123123',
      user_id: '111111',
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 30, 13),
        provider_id: '123123123',
        user_id: '111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment in the past', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 30, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 30, 11),
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment with yourself', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 30, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 30, 13),
        provider_id: 'Joao',
        user_id: 'Joao',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment before 8am', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: '123123123',
        user_id: '111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: '123123123',
        user_id: '111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
