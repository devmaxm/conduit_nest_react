import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsEntity } from './tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsEntity)
    private readonly tagRepository: Repository<TagsEntity>,
  ) {}

  async findAll(): Promise<TagsEntity[]> {
    return await this.tagRepository.find();
  }
}