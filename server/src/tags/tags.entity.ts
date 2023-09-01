import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class TagsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
