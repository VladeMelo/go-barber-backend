// FORMATO DOS DADOS
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/Users';

// isso se chama um "Decorator", funciona como uma função. Nesse caso Entity vai ser a função que terá como parâmetro o que vem logo abaixo, ou seja, a classe Appointment, toda vez que essa classe for salva ela será armazenada dentro da tabela de "appointments"
@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string; // id da referência de um usuário

  @ManyToOne(type => User)
  @JoinColumn({ name: 'provider_id' } /* name of the column in the database */)
  provider: User;

  @Column() // coluna no banco de dados
  user_id: string; // if just have the id, use this

  @ManyToOne(type => User) // apenas um relacionamento no js/programação
  @JoinColumn({ name: 'user_id' } /* name of the column in the database */)
  user: User; // if have the user object, use this

  @Column('timestamp with time zone') // tem suporte apenas no postgres
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
