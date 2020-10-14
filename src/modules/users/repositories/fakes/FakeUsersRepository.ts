import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../../dtos/IFindAllProvidersDTO';

import User from '../../infra/typeorm/entities/Users';

class FakeUsersRepository implements IUsersRepository {
  private usersRepository: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.usersRepository.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.usersRepository.find(user => user.email === email);

    return findUser;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { usersRepository } = this;

    if (except_user_id) {
      usersRepository = usersRepository.filter(
        user => user.id !== except_user_id,
      );
    }

    return usersRepository;
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuid(),
      email,
      name,
      password,
    });

    this.usersRepository.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.usersRepository.findIndex(
      findUser => user.id === findUser.id,
    );

    this.usersRepository[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
